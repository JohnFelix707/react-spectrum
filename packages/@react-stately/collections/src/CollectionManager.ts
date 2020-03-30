/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {CancelablePromise, easeOut, tween} from './tween';
import {Collection, CollectionManagerDelegate, InvalidationContext} from './types';
import {concatIterators, difference} from './utils';
import {Key} from 'react';
import {Layout} from './Layout';
import {LayoutInfo} from './LayoutInfo';
import {OverscanManager} from './OverscanManager';
import {Point} from './Point';
import {Rect, RectCorner} from './Rect';
import {ReusableView} from './ReusableView';
import {Size} from './Size';
import {Transaction} from './Transaction';

interface ScrollAnchor {
  key: Key,
  layoutInfo: LayoutInfo,
  corner: RectCorner,
  offset: number
}

export interface CollectionManagerOptions<T extends object, V, W> {
  collection?: Collection<T>,
  layout?: Layout<T>,
  delegate?: CollectionManagerDelegate<T, V, W>,
  transitionDuration?: number,
  anchorScrollPosition?: boolean,
  anchorScrollPositionAtTop?: boolean,
  shouldOverscan?: boolean
}

/**
 * The CollectionView class renders a scrollable collection of data using customizable layouts,
 * and manages animated updates to the data over time. It supports very large collections by
 * only rendering visible views to the DOM, reusing them as you scroll. Collection views can
 * present any type of view, including non-item views such as section headers and footers.
 * Optionally, the {@link EditableCollectionView} subclass can be used to enable user interaction
 * with the collection, including drag and drop, multiple selection, and keyboard interacton.
 *
 * Collection views get their data from a {@link DataSource} object that you provide. Items are
 * grouped into sections by the data source, and the collection view calls its methods to retrieve
 * the data. When data changes, the data source emits change events, and the collection view
 * updates as appropriate, optionally with an animated transition. There is one built-in data source
 * implementation, {@link ArrayDataSource}, which renders content from a 2d array.
 *
 * Collection views use {@link Layout} objects to compute what views should be visible, and how
 * to position and style them. This means that collection views can have their items arranged in
 * a stack, a grid, a circle, or any other layout you can think of. The layout can be changed
 * dynamically at runtime as well, optionally with an animated transition between the layouts.
 *
 * Layouts produce information on what views should appear in the collection view, but do not create
 * the views themselves directly. It is the responsibility of the {@link CollectionViewDelegate} object
 * to create instances of {@link ReusableView} subclasses which render the items into DOM nodes.
 * The delegate determines what type of view to display for each item, and creates instances of
 * views as needed by the collection view. Those views are then reused by the collection view as
 * the user scrolls through the content.
 */
export class CollectionManager<T extends object, V, W> {
  /**
   * The collection view delegate. The delegate is used by the collection view
   * to create and configure views.
   */
  delegate: CollectionManagerDelegate<T, V, W>;

  /** The duration of animated layout changes, in milliseconds. Default is 500ms. */
  transitionDuration: number;

  /** 
   * Whether to enable scroll anchoring. This will attempt to restore the scroll position
   * after layout changes outside the viewport. Default is off.
   */
  anchorScrollPosition: boolean;

  /** Whether to anchor the scroll position when at the top of the content. Default is off. */
  anchorScrollPositionAtTop: boolean;

  /** 
   * Whether to overscan the visible area to pre-render items slightly outside and 
   * improve performance. Default is on.
   */
  shouldOverscan: boolean;
  
  private _collection: Collection<T>;
  private _layout: Layout<T>;
  private _contentSize: Size;
  private _visibleRect: Rect;
  private _reusableViews: {[type: string]: ReusableView<T, V>[]};
  private _visibleViews: Map<Key, ReusableView<T, V>>;
  private _renderedContent: WeakMap<T, V>;
  private _children: Set<ReusableView<T, V>>;
  private _invalidationContext: InvalidationContext<T, V> | null;
  private _overscanManager: OverscanManager;
  private _relayoutRaf: number | null;
  private _scrollAnimation: CancelablePromise<void> | null;
  private _sizeUpdateQueue: Map<Key, Size>;
  private _animatedContentOffset: Point;
  private _transaction: Transaction<T, V> | null;
  private _nextTransaction: Transaction<T, V> | null;
  private _transactionQueue: Transaction<T, V>[];

  constructor(options: CollectionManagerOptions<T, V, W> = {}) {
    this._contentSize = new Size;
    this._visibleRect = new Rect;

    this._reusableViews = {};
    this._visibleViews = new Map();
    this._renderedContent = new WeakMap();
    this._children = new Set();
    this._invalidationContext = null;
    this._overscanManager = new OverscanManager();

    this._scrollAnimation = null;
    this._sizeUpdateQueue = new Map();
    this._animatedContentOffset = new Point(0, 0);

    this._transaction = null;
    this._nextTransaction = null;
    this._transactionQueue = [];

    // Set options from passed object if given
    this.transitionDuration = options.transitionDuration || 500;
    this.anchorScrollPosition = options.anchorScrollPosition || false;
    this.anchorScrollPositionAtTop = options.anchorScrollPositionAtTop || false;
    this.shouldOverscan = options.shouldOverscan !== false;
    for (let key of ['delegate', 'size', 'layout', 'collection']) {
      if (options[key]) {
        this[key] = options[key];
      }
    }
  }

  _setContentSize(size: Size) {
    this._contentSize = size;
    this.delegate.setContentSize(size);
  }

  _setContentOffset(offset: Point) {
    let rect = new Rect(offset.x, offset.y, this._visibleRect.width, this._visibleRect.height);
    this.delegate.setVisibleRect(rect);
  }

  /**
   * Get the size of the scrollable content
   */
  get contentSize(): Size {
    return this._contentSize;
  }

  /**
   * Get the collection view's currently visible rectangle
   */
  get visibleRect(): Rect {
    return this._visibleRect;
  }

  /**
   * Set the collection view's currently visible rectangle
   */
  set visibleRect(rect: Rect) {
    this._setVisibleRect(rect);
  }

  _setVisibleRect(rect: Rect, forceUpdate = false) {
    let current = this._visibleRect;

    // Ignore if the rects are equal
    if (rect.equals(current)) {
      return;
    }

    if (this.shouldOverscan) {
      this._overscanManager.setVisibleRect(rect);
    }

    let shouldInvalidate = this.layout && this.layout.shouldInvalidate(rect);

    this._resetAnimatedContentOffset();
    this._visibleRect = rect;

    if (shouldInvalidate) {
      this.relayout({
        offsetChanged: !rect.pointEquals(current),
        sizeChanged: !rect.sizeEquals(current)
      });
    } else {
      this.updateSubviews(forceUpdate);
      this.correctItemOrder();
    }
  }

  get collection(): Collection<T> {
    return this._collection;
  }

  set collection(data: Collection<T>) {
    this._setData(data);
  }

  private _setData(data: Collection<T>) {
    if (data === this._collection) {
      return;
    }

    if (this._collection) {
      this._runTransaction(() => {
        this._collection = data;
      }, false); // TODO: determine if we should animate somehow??
    } else {
      this._collection = data;
      this.reloadData();
    }
  }

  /**
   * Reloads the data from the data source and relayouts the collection view.
   * Does not animate any changes. Equivalent to re-assigning the same data source
   * to the collection view.
   */
  reloadData() {
    this.relayout({
      contentChanged: true
    });
  }

  /**
   * Returns the item with the given key.
   */
  getItem(key: Key) {
    return this._collection ? this._collection.getItem(key) : null;
  }

  /**
   * Get the collection view's layout
   */
  get layout(): Layout<T> {
    return this._layout;
  }

  /**
   * Set the collection view's layout
   */
  set layout(layout: Layout<T>) {
    this.setLayout(layout);
  }

  /**
   * Sets the collection view's layout, optionally with an animated transition
   * from the current layout to the new layout.
   * @param layout The layout to switch to
   * @param animated Whether to animate the layout change
   */
  setLayout(layout: Layout<T>, animated = false) {
    if (layout === this._layout) {
      return;
    }

    let applyLayout = () => {
      if (this._layout) {
        // @ts-ignore
        this._layout.collectionManager = null;
      }

      layout.collectionManager = this;
      this._layout = layout;
    };

    if (animated) {
      // Animated layout transitions are really simple, thanks to our transaction support.
      // We just set the layout inside a transaction action, which runs after the initial
      // layout infos for the animation are retrieved from the previous layout. Then, the
      // final layout infos are retrieved from the new layout, and animations occur.
      this._runTransaction(applyLayout);
    } else {
      applyLayout();
      this.relayout();
    }
  }

  private _getReuseType(layoutInfo: LayoutInfo, content: T | null) {
    if (layoutInfo.type === 'item' && content) {
      let type = this.delegate.getType ? this.delegate.getType(content) : 'item';
      let reuseType = type === 'item' ? 'item' : layoutInfo.type + '_' + type;
      return {type, reuseType};
    }

    return {
      type: layoutInfo.type,
      reuseType: layoutInfo.type
    };
  }

  getReusableView(layoutInfo: LayoutInfo): ReusableView<T, V> {
    let content = this._getViewContent(layoutInfo.type, layoutInfo.key);
    let {reuseType} = this._getReuseType(layoutInfo, content);

    if (!this._reusableViews[reuseType]) {
      this._reusableViews[reuseType] = [];
    }

    let reusable = this._reusableViews[reuseType];
    let view = reusable.length > 0
      ? reusable.pop()
      : new ReusableView<T, V>(this);

    view.viewType = reuseType;

    if (!this._animatedContentOffset.isOrigin()) {
      layoutInfo = layoutInfo.copy();
      layoutInfo.rect.x += this._animatedContentOffset.x;
      layoutInfo.rect.y += this._animatedContentOffset.y;
    }

    view.layoutInfo = layoutInfo;

    this._renderView(view);
    return view;
  }

  private _getViewContent(type: string, key: Key): T | null {
    // if (type === 'item') {
    return this.getItem(key);
    // }

    // if (this.delegate.getContentForExtraView) {
    //   return this.delegate.getContentForExtraView(type, key);
    // }

    // return null;
  }

  private _renderView(reusableView: ReusableView<T, V>) {
    let {type, key} = reusableView.layoutInfo;
    reusableView.content = this._getViewContent(type, key);
    reusableView.rendered = this._renderContent(type, reusableView.content);
  }

  private _renderContent(type: string, content: T) {
    let cached = this._renderedContent.get(content);
    if (cached != null) {
      return cached;
    }

    let rendered = this.delegate.renderView(type, content);
    if (content) {
      this._renderedContent.set(content, rendered);
    }
    return rendered;
  }

  /**
   * Returns an array of all currently visible views, including both
   * item views and supplementary views.
   */
  get visibleViews(): ReusableView<T, V>[] {
    return Array.from(this._visibleViews.values());
  }

  /**
   * Gets the visible item view for the given key. Returns null if
   * the view is not currently visible.
   */
  getItemView(key: Key): ReusableView<T, V> | null {
    return this.getView('item', key);
  }

  /**
   * Gets the visible view for the given type and key. Returns null if
   * the view is not currently visible.
   *
   * @param type The view type. `'item'` for an item view.
   * @param key The key of the view to retrieve
  */
  getView(type: string, key: Key): ReusableView<T, V> | null {
    try {
      let k = this._getViewKey(type, key);
      return this._visibleViews.get(k) || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Returns an array of visible views matching the given type.
   * @param type The view type to find. `'item'` for item views.
   */
  getViewsOfType(type: string): ReusableView<T, V>[] {
    return this.visibleViews.filter(v => v.layoutInfo && v.layoutInfo.type === type);
  }

  /**
   * Reloads the content of the supplementary view matching the given parameters.
   * This method does not work with item views. You should emit a "reloadItem" or
   * "reloadSection" event from your data source instead.
   *
   * @param type The view type. `'item'` for an item view.
   * @param key The key of the view to reload.
   */
  reloadSupplementaryView(type: string, key: Key) {
    if (type === 'item') {
      throw new Error('Do not reload item views with this method. ' +
        'Emit a "reloadItem" or "reloadSection" event from your data source instead.');
    }

    // TODO
    // let content = this._getViewContent(type, key);

    this._runTransaction(() => {
      let view = this.getView(type, key);
      if (!view) {
        return;
      }

      // view.setContent(content);
    }, false);
  }

  /**
   * Reloads the content of all visible supplementary views of the given type.
   * @param type The view type to reload. `'item'` for an item view.
   */
  reloadSupplementaryViewsOfType(type: string) {
    for (let view of this.getViewsOfType(type)) {
      if (view.layoutInfo) {
        this.reloadSupplementaryView(type, view.layoutInfo.key);
      }
    }
  }

  /**
   * Returns the key for the given view. Returns null
   * if the view is not currently visible.
   */
  keyForView(view: ReusableView<T, V>): Key | null {
    if (view && view.layoutInfo && view.layoutInfo.type === 'item') {
      return view.layoutInfo.key;
    }

    return null;
  }

  /**
   * Returns the key for the item view currently at the given point.
   */
  keyAtPoint(point: Point): Key | null {
    let rect = new Rect(point.x, point.y, 1, 1);
    let layoutInfos = this.layout.getVisibleLayoutInfos(rect);

    let layoutInfo = layoutInfos.filter(l => l.type === 'item')[0];
    if (!layoutInfo) {
      return null;
    }

    return layoutInfo.key;
  }

  /**
   * Triggers a layout invalidation, and updates the visible subviews.
   */
  relayout(context: InvalidationContext<T, V> = {}) {
    // Ignore relayouts while animating the scroll position
    if (this._scrollAnimation) {
      return;
    }

    // If we already scheduled a relayout, extend the invalidation
    // context so we coalesce multiple relayouts in the same frame.
    if (this._invalidationContext) {
      Object.assign(this._invalidationContext, context);
      return;
    }

    this._invalidationContext = context;
    this._relayoutRaf = requestAnimationFrame(() => {
      this._relayoutRaf = null;
      this.relayoutNow();
    });
  }

  /**
   * Performs a relayout immediately. Prefer {@link relayout} over this method
   * where possible, since it coalesces multiple layout passes in the same tick.
   */
  relayoutNow(context: InvalidationContext<T, V> = this._invalidationContext || {}) {
    // Cancel the scheduled relayout, since we're doing it now.
    if (this._relayoutRaf) {
      cancelAnimationFrame(this._relayoutRaf);
      this._relayoutRaf = null;
    }

    // Reset the invalidation context
    this._invalidationContext = null;

    // Do nothing if we don't have a layout or content, or we are
    // in the middle of an animated scroll transition.
    if (!this.layout || !this._collection || this._scrollAnimation) {
      return;
    }

    let scrollAnchor = this._getScrollAnchor();

    // Enable transitions if this is an animated relayout
    if (context.animated) {
      this._enableTransitions();
    }

    // Trigger the beforeLayout hook, if provided
    if (typeof context.beforeLayout === 'function') {
      context.beforeLayout();
    }

    // Validate the layout
    this.layout.validate(context);
    this._setContentSize(this.layout.getContentSize());

    // Trigger the afterLayout hook, if provided
    if (typeof context.afterLayout === 'function') {
      context.afterLayout();
    }

    // Adjust scroll position based on scroll anchor, and constrain.
    // If the content changed, scroll to the top.
    let visibleRect = this.getVisibleRect();
    let restoredScrollAnchor = this._restoreScrollAnchor(scrollAnchor, context);
    let contentOffsetX = context.contentChanged ? 0 : restoredScrollAnchor.x;
    let contentOffsetY = context.contentChanged ? 0 : restoredScrollAnchor.y;
    contentOffsetX = Math.max(0, Math.min(this.contentSize.width - visibleRect.width, contentOffsetX));
    contentOffsetY = Math.max(0, Math.min(this.contentSize.height - visibleRect.height, contentOffsetY));

    if (contentOffsetX !== visibleRect.x || contentOffsetY !== visibleRect.y) {
      // If this is an animated relayout, we do not immediately scroll because it would be jittery.
      // Save the difference between the current and new content offsets, and apply it to the
      // individual content items instead. At the end of the animation, we'll reset and set the
      // scroll offset for real. This ensures jitter-free animation since we don't need to sync
      // the scroll animation and the content animation.
      if (context.animated || !this._animatedContentOffset.isOrigin()) {
        this._animatedContentOffset.x += visibleRect.x - contentOffsetX;
        this._animatedContentOffset.y += visibleRect.y - contentOffsetY;
        this.updateSubviews(context.contentChanged);
      } else {
        this._setContentOffset(new Point(contentOffsetX, contentOffsetY));
      }
    } else {
      this.updateSubviews(context.contentChanged);
    }

    // Apply layout infos, unless this is coming from an animated transaction
    if (!(context.transaction && context.animated)) {
      this._applyLayoutInfos();
    }

    // Wait for animations, and apply the afterAnimation hook, if provided
    if (context.animated) {
      let done = () => {
        this._disableTransitions();

        // Reset scroll position after animations (see above comment).
        if (!this._animatedContentOffset.isOrigin()) {
          // Get the content offset to scroll to, taking _animatedContentOffset into account.
          let {x, y} = this.getVisibleRect();
          this._resetAnimatedContentOffset();
          this._setContentOffset(new Point(x, y));
        } else {
          // Make sure items are rendered in correct DOM order for accessibility
          this.correctItemOrder();
        }

        if (typeof context.afterAnimation === 'function') {
          context.afterAnimation();
        }
      };

      setTimeout(done, this.transitionDuration);
      return;
    } else if (typeof context.afterAnimation === 'function') {
      context.afterAnimation();
    }

    // Make sure items are rendered in correct DOM order for accessibility
    this.correctItemOrder();
  }

  /**
   * Corrects DOM order of visible views to match item order of collection
   */
  private correctItemOrder() {
    // if (this._scrolling) {
    //   return;
    // }

    // TODO
    // let current = Array.from(this.children) as ReusableView[];
    // let keys = this._getKeyArray();

    // // no need to reparent if visibleViews order matches sortedVisibleViews order
    // if (sortedVisibleViews.every((view, index) => view === current[index])) {
    //   return;
    // }

    // for (let view of sortedVisibleViews) {
    //   this.removeChild(view);
    //   this.addChild(view);
    // }

    // // Flush updates if not in a transaction, otherwise that will happen at the end.
    // if (!this._transaction) {
    //   this.flushUpdates();
    // }
  }

  private _enableTransitions() {
    this.delegate.beginAnimations();
  }

  private _disableTransitions() {
    this.delegate.endAnimations();
  }

  private _getScrollAnchor(): ScrollAnchor | null {
    if (!this.anchorScrollPosition) {
      return null;
    }

    let visibleRect = this.getVisibleRect();

    // Ask the delegate to provide a scroll anchor, if possible
    if (this.delegate.getScrollAnchor) {
      let key = this.delegate.getScrollAnchor(visibleRect);
      if (key) {
        let layoutInfo = this.layout.getLayoutInfo('item', key);
        let corner = layoutInfo.rect.getCornerInRect(visibleRect);
        if (corner) {
          let key = this._getViewKey(layoutInfo.type, layoutInfo.key);
          let offset = layoutInfo.rect[corner].y - visibleRect.y;
          return {key, layoutInfo, corner, offset};
        }
      }
    }

    // No need to anchor the scroll position if it is at the top
    if (visibleRect.y === 0 && !this.anchorScrollPositionAtTop) {
      return null;
    }

    // Find a view with a visible corner that has the smallest distance to the top of the collection view
    let cornerAnchor: ScrollAnchor | null = null;

    for (let [key, view] of this._visibleViews) {
      let layoutInfo = view.layoutInfo;
      if (layoutInfo && layoutInfo.rect.area > 0) {
        let corner = layoutInfo.rect.getCornerInRect(visibleRect);

        if (corner) {
          let offset = layoutInfo.rect[corner].y - visibleRect.y;
          if (!cornerAnchor || (offset < cornerAnchor.offset)) {
            cornerAnchor = {key, layoutInfo, corner, offset};
          }
        }
      }
    }

    return cornerAnchor;
  }

  private _restoreScrollAnchor(scrollAnchor: ScrollAnchor | null, context: InvalidationContext<T, V>) {
    let contentOffset = this.getVisibleRect();

    if (scrollAnchor) {
      let finalAnchor = context.transaction
        ? context.transaction.finalMap.get(scrollAnchor.key)
        : this.layout.getLayoutInfo(scrollAnchor.layoutInfo.type, scrollAnchor.layoutInfo.key);

      if (finalAnchor) {
        let adjustment = (finalAnchor.rect[scrollAnchor.corner].y - contentOffset.y) - scrollAnchor.offset;
        contentOffset.y += adjustment;
      }
    }

    return contentOffset;
  }

  getVisibleRect(): Rect {
    let v = this.visibleRect;
    let x = v.x - this._animatedContentOffset.x;
    let y = v.y - this._animatedContentOffset.y;
    return new Rect(x, y, v.width, v.height);
  }

  getVisibleLayoutInfos() {
    let rect = this.shouldOverscan ? this._overscanManager.getOverscannedRect() : this.getVisibleRect();
    return this._getLayoutInfoMap(rect);
  }

  private _getViewKey(type: string, key: Key) {
    return type + ':' + key;
  }

  private _getLayoutInfoMap(rect: Rect, copy = false) {
    let layoutInfos = this.layout.getVisibleLayoutInfos(rect);
    let map = new Map;

    for (let layoutInfo of layoutInfos) {
      if (copy) {
        layoutInfo = layoutInfo.copy();
      }

      let key = this._getViewKey(layoutInfo.type, layoutInfo.key);
      map.set(key, layoutInfo);
    }

    return map;
  }

  updateSubviews(forceUpdate = false) {
    if (!this._collection) {
      return;
    }

    let visibleLayoutInfos = this.getVisibleLayoutInfos();
    let currentlyVisible = this._visibleViews;
    let toAdd, toRemove, toUpdate;

    // If this is a force update, remove and re-add all views.
    // Otherwise, find and update the diff.
    if (forceUpdate) {
      toAdd = visibleLayoutInfos;
      toRemove = currentlyVisible;
      toUpdate = new Set();
    } else {
      ({toAdd, toRemove, toUpdate} = difference(currentlyVisible, visibleLayoutInfos));

      for (let key of toUpdate) {
        let view = currentlyVisible.get(key);
        if (!view || !view.layoutInfo) {
          continue;
        }

        let item = this.getItem(visibleLayoutInfos.get(key).key);
        if (view.content === item) {
          toUpdate.delete(key);
        } else {
          // If the view type changes, delete and recreate the view instead of updating
          let {reuseType} = this._getReuseType(view.layoutInfo, item);
          if (view.viewType !== reuseType) {
            toUpdate.delete(key);
            toAdd.add(key);
            toRemove.add(key);
          }
        }
      }

      // We are done if the sets are equal
      if (toAdd.size === 0 && toRemove.size === 0 && toUpdate.size === 0) {
        if (this._transaction) {
          this._applyLayoutInfos();
        }

        return;
      }
    }

    // Track views that should be removed. They are not removed from
    // the DOM immediately, since we may reuse and need to re-insert
    // them back into the DOM anyway.
    let removed = new Set<ReusableView<T, V>>();

    for (let key of toRemove.keys()) {
      let view = this._visibleViews.get(key);
      if (view) {
        removed.add(view);
        this._visibleViews.delete(key);

        // If we are in the middle of a transaction, wait until the end
        // of the animations to remove the views from the DOM. Also means
        // we can't reuse those views immediately.
        if (this._transaction) {
          this._transaction.toRemove.set(key, view);
        } else {
          this.reuseView(view);
        }
      }
    }

    for (let key of toAdd.keys()) {
      let layoutInfo = visibleLayoutInfos.get(key);
      let view: ReusableView<T, V> | void;

      // If we're in a transaction, and a layout change happens
      // during the animations such that a view that was going
      // to be removed is now not, we don't create a new view
      // since the old one is still in the DOM, marked as toRemove.
      if (this._transaction) {
        // if transaction, get initial layout attributes for the animation
        if (this._transaction.initialLayoutInfo.has(key)) {
          layoutInfo = this._transaction.initialLayoutInfo.get(key);
        }

        view = this._transaction.toRemove.get(key);
        if (view) {
          this._transaction.toRemove.delete(key);
          this._applyLayoutInfo(view, layoutInfo);
        }
      }

      if (!view) {
        // Create or reuse a view for this row
        view = this.getReusableView(layoutInfo);

        // Add the view to the DOM if needed
        if (!removed.has(view)) {
          this._children.add(view);
        }
      }

      this._visibleViews.set(key, view);
      removed.delete(view);
    }

    for (let key of toUpdate) {
      let view = currentlyVisible.get(key) as ReusableView<T, V>;
      this._renderedContent.delete(key);
      this._renderView(view);
    }

    // Remove the remaining rows to delete from the DOM
    if (!this._transaction) {
      this.removeViews(removed);
    }

    this._flushVisibleViews();
    if (this._transaction) {
      requestAnimationFrame(() => {
        // If we're in a transaction, apply animations to visible views
        // and "to be removed" views, which animate off screen.
        if (this._transaction) {
          requestAnimationFrame(() => this._applyLayoutInfos());
        }
      });
    }
  }

  afterRender() {
    if (this.shouldOverscan) {
      this._overscanManager.collectMetrics();
    }
  }

  private _flushVisibleViews() {
    // CollectionManager deals with a flattened set of LayoutInfos, but they can represent heirarchy
    // by referencing a parentKey. Just before rendering the visible views, we rebuild this heirarchy
    // by creating a mapping of views by parent key and recursively calling the delegate's renderWrapper
    // method to build the final tree.
    let viewsByParentKey = new Map([[null, []]]);
    for (let view of this._children) {
      if (!viewsByParentKey.has(view.layoutInfo.parentKey)) {
        viewsByParentKey.set(view.layoutInfo.parentKey, []);
      }

      viewsByParentKey.get(view.layoutInfo.parentKey).push(view);
      if (!viewsByParentKey.has(view.layoutInfo.key)) {
        viewsByParentKey.set(view.layoutInfo.key, []);
      }
    }

    let buildTree = (parent: ReusableView<T, V>, views: ReusableView<T, V>[]): W[] => views.map(view => {
      let children = viewsByParentKey.get(view.layoutInfo.key);
      return this.delegate.renderWrapper(
          parent,
          view,
          children,
          (childViews) => buildTree(view, childViews)
        );
    });

    let children = buildTree(null, viewsByParentKey.get(null));
    this.delegate.setVisibleViews(children);
  }

  private _applyLayoutInfo(view: ReusableView<T, V>, layoutInfo: LayoutInfo) {
    if (view.layoutInfo === layoutInfo) {
      return false;
    }

    view.layoutInfo = layoutInfo;
    this._renderView(view);
    return true;
  }

  private _applyLayoutInfos() {
    let updated = false;

    // Apply layout infos to visible views
    for (let [key, view] of this._visibleViews) {
      if (this._transaction && this._transaction.initialLayoutInfo.get(key) === view.layoutInfo) {
        // view.forceStyleUpdate();
      }

      let cur = view.layoutInfo;
      if (cur) {
        let layoutInfo = this.layout.getLayoutInfo(cur.type, cur.key);
        if (this._applyLayoutInfo(view, layoutInfo)) {
          updated = true;
        }
      }
    }

    // Apply final layout infos for views that will be removed
    if (this._transaction) {
      for (let view of this._transaction.toRemove.values()) {
        let cur = view.layoutInfo;
        let layoutInfo = this.layout.getLayoutInfo(cur.type, cur.key);
        if (this._applyLayoutInfo(view, layoutInfo)) {
          updated = true;
        }
      }

      for (let view of this._transaction.removed.values()) {
        let cur = view.layoutInfo;
        let k = this._getViewKey(cur.type, cur.key);
        let layoutInfo = this._transaction.finalLayoutInfo.get(k) || cur;
        layoutInfo = this.layout.getFinalLayoutInfo(layoutInfo.copy());
        if (this._applyLayoutInfo(view, layoutInfo)) {
          updated = true;
        }
      }
    }

    if (updated) {
      this._flushVisibleViews();
    }
  }

  reuseView(view: ReusableView<T, V>) {
    view.prepareForReuse();
    this._reusableViews[view.viewType].push(view);
  }

  removeViews(toRemove: Set<ReusableView<T, V>>) {
    for (let view of toRemove) {
      this._children.delete(view);
    }
  }

  updateItemSize(key: Key, size: Size) {
    // TODO: we should be able to invalidate a single index path
    // @ts-ignore
    if (!this.layout.updateItemSize) {
      return;
    }

    // If the scroll position is currently animating, add the update
    // to a queue to be processed after the animation is complete.
    if (this._scrollAnimation) {
      this._sizeUpdateQueue.set(key, size);
      return;
    }

    // @ts-ignore
    let changed = this.layout.updateItemSize(key, size);
    if (changed) {
      this.relayout();
    }
  }

  // scrollEnded() {
  //   super.scrollEnded();
  //   this.correctItemOrder();
  // }

  private _resetAnimatedContentOffset() {
    // Reset the animated content offset of subviews. See comment in relayoutNow for details.
    if (!this._animatedContentOffset.isOrigin()) {
      this._animatedContentOffset = new Point(0, 0);
      this._applyLayoutInfos();
    }
  }

  /**
   * Scrolls the item with the given key into view, optionally with an animation.
   * @param key The key of the item to scroll into view
   * @param duration The duration of the scroll animation
   */
  scrollToItem(key: Key, duration: number = 300) {
    if (!key) {
      return;
    }

    let layoutInfo = this.layout.getLayoutInfo('item', key);
    if (!layoutInfo) {
      return;
    }

    let offsetX = layoutInfo.rect.x;
    let offsetY = layoutInfo.rect.y;
    let x = this.visibleRect.x;
    let y = this.visibleRect.y;
    let maxX = x + this.visibleRect.width;
    let maxY = y + this.visibleRect.height;

    if (offsetX <= x || maxX === 0) {
      x = offsetX;
    } else if (offsetX + layoutInfo.rect.width > maxX) {
      x += offsetX + layoutInfo.rect.width - maxX;
    }
    if (offsetY <= y || maxY === 0) {
      y = offsetY;
    } else if (offsetY + layoutInfo.rect.height > maxY) {
      y += offsetY + layoutInfo.rect.height - maxY;
    }

    return this.scrollTo(new Point(x, y), duration);
  }

  /**
   * Performs an animated scroll to the given offset.
   * @param offset - The offset to scroll to
   * @param duration The duration of the animation
   * @return a promise that resolves when the animation is complete
   */
  scrollTo(offset: Point, duration: number = 300): Promise<void> {
    // Cancel the current scroll animation
    if (this._scrollAnimation) {
      this._scrollAnimation.cancel();
      this._scrollAnimation = null;
    }

    // Set the content offset synchronously if the duration is zero
    if (duration <= 0 || this.visibleRect.pointEquals(offset)) {
      this._setContentOffset(offset);
      return Promise.resolve();
    }

    this._scrollAnimation = tween(this.visibleRect, offset, duration, easeOut, offset => {this._setContentOffset(offset);});
    this._scrollAnimation.then(() => {
      this._scrollAnimation = null;

      // Process view size updates that occurred during the animation.
      // Only views that are still visible will be actually updated.
      for (let [key, size] of this._sizeUpdateQueue) {
        this.updateItemSize(key, size);
      }

      this._sizeUpdateQueue.clear();
      this.relayout();
      this._processTransactionQueue();
    });

    return this._scrollAnimation;
  }

  private _runTransaction(action: () => void, animated?: boolean) {
    this._startTransaction();
    if (this._nextTransaction) {
      this._nextTransaction.actions.push(action);
    }
    this._endTransaction(animated);
  }

  private _startTransaction() {
    if (!this._nextTransaction) {
      this._nextTransaction = new Transaction;
    }

    this._nextTransaction.level++;
  }

  private _endTransaction(animated?: boolean) {
    if (!this._nextTransaction) {
      return false;
    }

    // Save whether the transaction should be animated.
    if (animated != null) {
      this._nextTransaction.animated = animated;
    }

    // If we haven't reached level 0, we are still in a
    // nested transaction. Wait for the parent to end.
    if (--this._nextTransaction.level > 0) {
      return false;
    }

    // Do nothing for empty transactions
    if (this._nextTransaction.actions.length === 0) {
      this._nextTransaction = null;
      return false;
    }

    // Default animations to true
    if (this._nextTransaction.animated == null) {
      this._nextTransaction.animated = true;
    }

    // Enqueue the transaction
    this._transactionQueue.push(this._nextTransaction);
    this._nextTransaction = null;

    this._processTransactionQueue();
    return true;
  }

  private _processTransactionQueue() {
    // If the current transaction is animating, wait until the end
    // to process the next transaction.
    if (this._transaction || this._scrollAnimation) {
      return;
    }

    let next = this._transactionQueue.shift();
    if (next) {
      this._performTransaction(next);
    }
  }

  private _getContentRect(): Rect {
    return new Rect(0, 0, this.contentSize.width, this.contentSize.height);
  }

  private _performTransaction(transaction: Transaction<T, V>) {
    this._transaction = transaction;

    this.relayoutNow({
      transaction: transaction,
      animated: transaction.animated,

      beforeLayout: () => {
        // Get the initial layout infos for all views before the updates
        // so we can figure out which views to add and remove.
        transaction.initialMap = this._getLayoutInfoMap(this._getContentRect(), true);

        // Apply the actions that occurred during this transaction
        for (let action of transaction.actions) {
          action();
        }
      },

      afterLayout: () => {
        // Get the final layout infos after the updates
        transaction.finalMap = this._getLayoutInfoMap(this._getContentRect());
        this._setupTransactionAnimations(transaction);

        if (!transaction.animated) {
          this._transaction = null;
        }
      },

      afterAnimation: () => {
        // Remove and reuse views when animations are done
        if (transaction.toRemove.size > 0 || transaction.removed.size > 0) {
          for (let view of concatIterators(transaction.toRemove.values(), transaction.removed.values())) {
            this._children.delete(view);
            this.reuseView(view);
          }

          this._flushVisibleViews();
        }

        this._transaction = null;
        this._processTransactionQueue();
      }
    });
  }

  private _setupTransactionAnimations(transaction: Transaction<T, V>) {
    let {initialMap, finalMap} = transaction;

    // Store initial and final layout infos for animations
    for (let [key, layoutInfo] of initialMap) {
      if (finalMap.has(key)) {
        // Store the initial layout info for use during animations.
        transaction.initialLayoutInfo.set(key, layoutInfo);
      } else {
        // This view was removed. Store the layout info for use
        // in Layout#getFinalLayoutInfo during animations.
        let k = this._getViewKey(layoutInfo.type, layoutInfo.key);
        transaction.finalLayoutInfo.set(k, layoutInfo);
      }
    }

    // Get initial layout infos for views that were added
    for (let [key, layoutInfo] of finalMap) {
      if (!initialMap.has(key)) {
        let initialLayoutInfo = this.layout.getInitialLayoutInfo(layoutInfo.copy());
        transaction.initialLayoutInfo.set(key, initialLayoutInfo);
      }
    }

    // Figure out which views were removed.
    for (let [key, view] of this._visibleViews) {
      if (!finalMap.has(key)) {
        transaction.removed.set(key, view);
        this._visibleViews.delete(key);

        // In case something weird happened, where we have a view but no
        // initial layout info, use the one attached to the view.
        if (view.layoutInfo) {
          let k = this._getViewKey(view.layoutInfo.type, view.layoutInfo.key);
          if (!transaction.finalLayoutInfo.has(k)) {
            transaction.finalLayoutInfo.set(k, view.layoutInfo);
          }
        }
      }
    }
  }
}
