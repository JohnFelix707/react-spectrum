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

import {DOMAttributes, FocusableElement, RefObject} from '@react-types/shared';
import {focusSafely, getFocusableTreeWalker} from '@react-aria/focus';
import {getCellId, gridMap} from './utils';
import {getScrollParent, mergeProps, scrollIntoViewport} from '@react-aria/utils';
import {GridCollection, GridNode} from '@react-types/grid';
import {GridState} from '@react-stately/grid';
import {isFocusVisible} from '@react-aria/interactions';
import {KeyboardEvent as ReactKeyboardEvent, useRef} from 'react';
import {useLocale} from '@react-aria/i18n';
import {useSelectableItem} from '@react-aria/selection';

export interface GridCellProps {
  /** An object representing the grid cell. Contains all the relevant information that makes up the grid cell. */
  node: GridNode<unknown>,
  /** Whether the grid cell is contained in a virtual scroller. */
  isVirtualized?: boolean,
  /** Whether the cell or its first focusable child element should be focused when the grid cell is focused. */
  focusMode?: 'child' | 'cell',
  /** Whether the cell is editable. */
  isEditable?: boolean,
  /** Whether the cell is read-only. */
  isReadOnly?: boolean,
  /**
   * Whether keyboard navigation to focusable elements within the grid cell is
   * via the left/right arrow keys or the tab key.
   * @default 'arrow'
   */
  keyboardNavigationBehavior?: 'arrow' | 'tab',
  /** Whether selection should occur on press up instead of press down. */
  shouldSelectOnPressUp?: boolean,
  /**
   * Handler that is called when a user performs an action on the cell.
   * Please use onCellAction at the collection level instead.
   * @deprecated
   **/
  onAction?: () => void
}

export interface GridCellAria {
  /** Props for the grid cell element. */
  gridCellProps: DOMAttributes,
  /** Whether the cell is currently in a pressed state. */
  isPressed: boolean,
  /** Whether the cell content is being edited. */
  isEditing: boolean,
  /** Whether the cell is read only. */
  isReadOnly: boolean
}

const NAVIGATION_KEYS = new Set(['Home', 'End', 'PageUp', 'PageDown', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']);

/**
 * Provides the behavior and accessibility implementation for a cell in a grid.
 * @param props - Props for the cell.
 * @param state - State of the parent grid, as returned by `useGridState`.
 */
export function useGridCell<T, C extends GridCollection<T>>(props: GridCellProps, state: GridState<T, C>, ref: RefObject<FocusableElement | null>): GridCellAria {
  let {
    node,
    focusMode,
    isVirtualized,
    isEditable = false,
    shouldSelectOnPressUp,
    onAction
  } = props;

  let {direction} = useLocale();
  let {id, keyboardDelegate, keyboardNavigationBehavior, actions: {onCellAction}} = gridMap.get(state);

  let isEditing = state.editingKey === node.key;
  let isReadOnly = state.isReadOnly || props.isReadOnly;

  focusMode ??= isEditable || keyboardNavigationBehavior === 'tab' ? 'cell' : 'child';

  // We need to track the key of the item at the time it was last focused so that we force
  // focus to go to the item when the DOM node is reused for a different item in a virtualizer.
  let keyWhenFocused = useRef(null);

  // Handles focusing the cell. If there is a focusable child,
  // it is focused, otherwise the cell itself is focused.
  let focus = () => {
    let treeWalker = getFocusableTreeWalker(ref.current);
    if (focusMode === 'child') {
      // If focus is already on a focusable child within the cell, early return so we don't shift focus
      if (ref.current.contains(document.activeElement) && ref.current !== document.activeElement) {
        return;
      }

      let focusable = state.selectionManager.childFocusStrategy === 'last'
        ? last(treeWalker)
        : treeWalker.firstChild() as FocusableElement;
      if (focusable) {
        focusSafely(focusable);
        return;
      }
    }

    if (
      (keyWhenFocused.current != null && node.key !== keyWhenFocused.current) ||
      !ref.current.contains(document.activeElement)
    ) {
      focusSafely(ref.current);
    }
  };

  let {itemProps, isPressed} = useSelectableItem({
    selectionManager: state.selectionManager,
    key: node.key,
    ref,
    isVirtualized,
    focus,
    shouldSelectOnPressUp,
    onAction: onCellAction ? () => onCellAction(node.key) : onAction,
    isDisabled: state.collection.size === 0
  });

  let onKeyDown = (e: ReactKeyboardEvent) => {
    if (!e.currentTarget.contains(e.target as Element) || (!isEditing && state.isKeyboardNavigationDisabled)) {
      return;
    }

    let walker = getFocusableTreeWalker(ref.current);
    walker.currentNode = document.activeElement;

    let isFocused = ref.current === document.activeElement;
    let isNavigation = NAVIGATION_KEYS.has(e.key) || (e.altKey && e.key === 'Tab');

    if (keyboardNavigationBehavior === 'tab' && isNavigation && !isFocused) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    switch (e.key) {
      case 'ArrowLeft': {
        if (keyboardNavigationBehavior === 'tab') {
          break;
        };

        // Find the next focusable element within the cell.
        let focusable = direction === 'rtl'
          ? walker.nextNode() as FocusableElement
          : walker.previousNode() as FocusableElement;

        let isCellFocusable = focusable === ref.current;

        // Don't focus the cell itself if focusMode is "child"
        if (focusMode === 'child' && isCellFocusable) {
          focusable = null;
        }

        e.preventDefault();
        e.stopPropagation();
        if ((focusable || isEditing) && !(isEditable && document.activeElement === ref.current)) {
          let [, end] = wrap(walker);

          focusSafely(isCellFocusable && isEditing ? end : focusable);
          scrollIntoViewport(isCellFocusable && isEditing ? end : focusable, {containingElement: getScrollParent(ref.current)});
        } else {
          // If there is no next focusable child, then move to the next cell to the left of this one.
          // This will be handled by useSelectableCollection. However, if there is no cell to the left
          // of this one, only one column, and the grid doesn't focus rows, then the next key will be the
          // same as this one. In that case we need to handle focusing either the cell or the first/last
          // child, depending on the focus mode.
          let prev = keyboardDelegate.getKeyLeftOf(node.key);
          if (prev !== node.key) {
            // We prevent the capturing event from reaching children of the cell, e.g. pickers.
            // We want arrow keys to navigate to the next cell instead. We need to re-dispatch
            // the event from a higher parent so it still bubbles and gets handled by useSelectableCollection.
            ref.current.parentElement.dispatchEvent(
              new KeyboardEvent(e.nativeEvent.type, e.nativeEvent)
            );
            break;
          }

          if (focusMode === 'cell' && direction === 'rtl') {
            focusSafely(ref.current);
            scrollIntoViewport(ref.current, {containingElement: getScrollParent(ref.current)});
          } else {
            walker.currentNode = ref.current;
            focusable = direction === 'rtl'
              ? walker.firstChild() as FocusableElement
              : last(walker);
            if (focusable) {
              focusSafely(focusable);
              scrollIntoViewport(focusable, {containingElement: getScrollParent(ref.current)});
            }
          }
        }
        break;
      }
      case 'ArrowRight': {
        if (keyboardNavigationBehavior === 'tab') {
          break;
        };

        let focusable = direction === 'rtl'
          ? walker.previousNode() as FocusableElement
          : walker.nextNode() as FocusableElement;

        if (focusMode === 'child' && focusable === ref.current) {
          focusable = null;
        }

        e.preventDefault();
        e.stopPropagation();
        if ((focusable || isEditing) && !(isEditable && document.activeElement === ref.current)) {
          let [start] = wrap(walker);

          focusSafely(focusable ?? start);
          scrollIntoViewport(focusable ?? start, {containingElement: getScrollParent(ref.current)});
        } else {
          let next = keyboardDelegate.getKeyRightOf(node.key);
          if (next !== node.key) {
            // We prevent the capturing event from reaching children of the cell, e.g. pickers.
            // We want arrow keys to navigate to the next cell instead. We need to re-dispatch
            // the event from a higher parent so it still bubbles and gets handled by useSelectableCollection.
            ref.current.parentElement.dispatchEvent(
              new KeyboardEvent(e.nativeEvent.type, e.nativeEvent)
            );
            break;
          }

          if (focusMode === 'cell' && direction === 'ltr') {
            focusSafely(ref.current);
            scrollIntoViewport(ref.current, {containingElement: getScrollParent(ref.current)});
          } else {
            walker.currentNode = ref.current;
            focusable = direction === 'rtl'
              ? last(walker)
              : walker.firstChild() as FocusableElement;
            if (focusable) {
              focusSafely(focusable);
              scrollIntoViewport(focusable, {containingElement: getScrollParent(ref.current)});
            }
          }
        }
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        if (keyboardNavigationBehavior === 'tab') {
          break;
        };

        // Prevent this event from reaching cell children, e.g. menu buttons. We want arrow keys to navigate
        // to the cell above/below instead. We need to re-dispatch the event from a higher parent so it still
        // bubbles and gets handled by useSelectableCollection.
        if (keyboardNavigationBehavior === 'arrow' && !e.altKey && ref.current.contains(e.target as Element)) {
          e.stopPropagation();
          e.preventDefault();

          if (isEditing) {
            ref.current.dispatchEvent(
              new KeyboardEvent(e.nativeEvent.type, {...e.nativeEvent, key: e.key === 'ArrowUp' ? 'ArrowLeft' : 'ArrowRight'})
            );
          } else {
            ref.current.parentElement.dispatchEvent(
              new KeyboardEvent(e.nativeEvent.type, e.nativeEvent)
            );
          }
        }
        break;
      }
      case 'F2':
      case 'Enter': {
        if (isEditable) {
          let focusable = walker.nextNode() as FocusableElement;

          if (focusable && document.activeElement === ref.current) {
            state.setEditingKey(node.key);
            focusSafely(focusable);
          }
        }

        if (isEditable && state.editingKey && (isSingleLineTextInput(document.activeElement) || e.key === 'F2')) {
          state.setEditingKey(null);
          focusSafely(ref.current);
        }
        break;
      }
      case 'Escape': {
        if (state.editingKey || keyboardNavigationBehavior === 'tab') {
          state.setEditingKey(null);
          focusSafely(ref.current);
        }
        break;
      }
      case 'Tab': {
        if (keyboardNavigationBehavior === 'tab') {
          // If there is another focusable element within this item, stop propagation so the tab key
          // is handled by the browser and not by useSelectableCollection (which would take us out of the list).
          let walker = getFocusableTreeWalker(ref.current, {tabbable: true});
          walker.currentNode = document.activeElement;
          let next = e.shiftKey ? walker.previousNode() : walker.nextNode();

          if (next || isEditing) {
            e.stopPropagation();

            if (isEditable && document.activeElement === ref.current) {
              state.setEditingKey(node.key); // Do we want this?
            }

            let [start, end] = wrap(walker);

            if (isEditing && !e.shiftKey && document.activeElement === end) {
              e.preventDefault();
              focusSafely(start);
            }

            if (isEditing && e.shiftKey && document.activeElement === start) {
              e.preventDefault();
              focusSafely(end);
            }
          }
        }
        break;
      }
      default: {
        if (document.activeElement === ref.current && /^[a-zA-Z0-9]$/.test(e.key)) {
          let focusable = first(walker);

          if (focusable) {
            state.setEditingKey(node.key);
            focusSafely(focusable);
          }
        }
        break;
      }
    }
  };

  let onBlur = (e) => {
    if (!ref.current.contains(e.relatedTarget)) {
      state.setEditingKey(null);
    }
  };

  // Grid cells can have focusable elements inside them. In this case, focus should
  // be marshalled to that element rather than focusing the cell itself.
  let onFocus = (e) => {
    keyWhenFocused.current = node.key;
    if (e.target !== ref.current) {
      // useSelectableItem only handles setting the focused key when
      // the focused element is the gridcell itself. We also want to
      // set the focused key when a child element receives focus.
      // If focus is currently visible (e.g. the user is navigating with the keyboard),
      // then skip this. We want to restore focus to the previously focused row/cell
      // in that case since the table should act like a single tab stop.
      if (!isFocusVisible()) {
        state.selectionManager.setFocusedKey(node.key);
      }
      return;
    }

    // If the cell itself is focused, wait a frame so that focus finishes propagatating
    // up to the tree, and move focus to a focusable child if possible.
    requestAnimationFrame(() => {
      if (e.relatedTarget && keyboardNavigationBehavior === 'tab') {
        let ariaRole = e.relatedTarget.getAttribute('role');
        let comparedPosition = ref.current.compareDocumentPosition(e.relatedTarget);
  
        let isFocusWithin = Boolean(comparedPosition & Node.DOCUMENT_POSITION_CONTAINED_BY);
        let isShiftTab = isFocusVisible() && Boolean(comparedPosition & Node.DOCUMENT_POSITION_FOLLOWING);
        let isSibling = ariaRole === 'gridcell' || ariaRole === 'rowheader' && e.relatedTarget.id.startsWith(id);
  
        if (isShiftTab && !isFocusWithin && !isSibling) {
          let walker = getFocusableTreeWalker(ref.current);
          walker.currentNode = ref.current;
  
          let focusable = last(walker);
          
          if (focusable) {
            focusSafely(focusable);
          }
        }
      }
    });
  };

  let gridCellProps: DOMAttributes = mergeProps(itemProps, {
    role: 'gridcell',
    onKeyDownCapture: keyboardNavigationBehavior === 'tab' ?  undefined : onKeyDown,
    onKeyDown: keyboardNavigationBehavior === 'tab' ? onKeyDown : undefined,
    onBlur,
    onFocus,
    'aria-readonly': (isEditable && isReadOnly) || undefined,
    id: getCellId(state, node.parentKey, node.key)
  });

  if (isVirtualized) {
    gridCellProps['aria-colindex'] = (node.colIndex ?? node.index) + 1; // aria-colindex is 1-based
  }

  // When pressing with a pointer and cell selection is not enabled, usePress will be applied to the
  // row rather than the cell. However, when the row is draggable, usePress cannot preventDefault
  // on pointer down, so the browser will try to focus the cell which has a tabIndex applied.
  // To avoid this, remove the tabIndex from the cell briefly on pointer down.
  if (shouldSelectOnPressUp && gridCellProps.tabIndex != null && gridCellProps.onPointerDown == null) {
    gridCellProps.onPointerDown = (e) => {
      let el = e.currentTarget;
      let tabindex = el.getAttribute('tabindex');
      el.removeAttribute('tabindex');
      requestAnimationFrame(() => {
        el.setAttribute('tabindex', tabindex);
      });
    };
  }

  return {
    gridCellProps,
    isPressed,
    isEditing,
    isReadOnly
  };
}

function first(walker: TreeWalker) {
  let first = walker.nextNode() as FocusableElement;
  let next = first;

  while (next !== null && !isSingleLineTextInput(next)) {
    next = walker.nextNode() as FocusableElement;
  }
  return next;
}

function last(walker: TreeWalker) {
  let next: FocusableElement;
  let last: FocusableElement;
  do {
    last = walker.lastChild() as FocusableElement;
    if (last) {
      next = last;
    }
  } while (last);
  return next;
}

function wrap(walker: TreeWalker) {
  walker.currentNode = walker.root;
  let start = walker.firstChild() as FocusableElement;
  walker.currentNode = walker.root;
  let end = last(walker);
  return [start, end];
}

function isSingleLineTextInput(element: Element) {
  return element.tagName === 'INPUT' && element.getAttribute('type') === 'text';
}
