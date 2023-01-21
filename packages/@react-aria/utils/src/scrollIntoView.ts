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

import {getScrollParent} from './';

interface ScrollOpts {
  /** The scroll parent of the target element.  */
  scrollView: HTMLElement
}

interface ScrollIntoViewportOpts {
  /** The optional containing element of the target to be centered in the viewport. */
  containingElement?: Element
}

let isScrollPrevented = false;
let delayScrolling = false;
let scrollCallbacks = new Set<() => void>();

export function setScrollPrevented(value: boolean) {
  isScrollPrevented = value;
}

export function setDelayScrolling(value: boolean) {
  if (!value && delayScrolling) {
    for (let cb of scrollCallbacks) {
      cb();
    }
    scrollCallbacks.clear();
  }
  delayScrolling = value;
}

/**
 * Scrolls `opts.scrollView` so that `element` is visible.
 * Similar to `element.scrollIntoView({block: 'nearest'})` (not supported in Edge),
 * but doesn't affect parents above `opts.scrollView`.
 */
export function scrollIntoView(element: HTMLElement, opts: ScrollOpts);
/**
 * Scrolls `scrollView` so that `element` is visible.
 * Similar to `element.scrollIntoView({block: 'nearest'})` (not supported in Edge),
 * but doesn't affect parents above `scrollView`.
 * @deprecated - provide `scrollView` via opts instead.
 */
export function scrollIntoView(scrollView: HTMLElement, element: HTMLElement);
export function scrollIntoView(element: HTMLElement, opts: HTMLElement | ScrollOpts) {
  let scrollView;
  let targetElement;
  if ('scrollView' in opts) {
    scrollView = opts.scrollView;
    targetElement = element;
  } else {
    scrollView = element;
    targetElement = opts;
  }

  let offsetX = relativeOffset(scrollView, targetElement, 'left');
  let offsetY = relativeOffset(scrollView, targetElement, 'top');
  let width = targetElement.offsetWidth;
  let height = targetElement.offsetHeight;
  let x = scrollView.scrollLeft;
  let y = scrollView.scrollTop;

  // Account for top/left border offsetting the scroll top/Left
  let {borderTopWidth, borderLeftWidth} = getComputedStyle(scrollView);
  let borderAdjustedX = scrollView.scrollLeft + parseInt(borderLeftWidth, 10);
  let borderAdjustedY = scrollView.scrollTop + parseInt(borderTopWidth, 10);
  // Ignore end/bottom border via clientHeight/Width instead of offsetHeight/Width
  let maxX = borderAdjustedX + scrollView.clientWidth;
  let maxY = borderAdjustedY + scrollView.clientHeight;

  if (offsetX <= x) {
    x = offsetX - parseInt(borderLeftWidth, 10);
  } else if (offsetX + width > maxX) {
    x += offsetX + width - maxX;
  }
  if (offsetY <= borderAdjustedY) {
    y = offsetY - parseInt(borderTopWidth, 10);
  } else if (offsetY + height > maxY) {
    y += offsetY + height - maxY;
  }
  scrollView.scrollLeft = x;
  scrollView.scrollTop = y;
  debugger
}

/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */
function relativeOffset(ancestor: HTMLElement, child: HTMLElement, axis: 'left'|'top') {
  const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
  let sum = 0;
  while (child.offsetParent) {
    sum += child[prop];
    if (child.offsetParent === ancestor) {
      // Stop once we have found the ancestor we are interested in.
      break;
    } else if (child.offsetParent.contains(ancestor)) {
      // If the ancestor is not `position:relative`, then we stop at
      // _its_ offset parent, and we subtract off _its_ offset, so that
      // we end up with the proper offset from child to ancestor.
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent as HTMLElement;
  }
  return sum;
}

/**
 * Scrolls the `targetElement` so it is visible in the viewport. Accepts an optional `opts.containingElement`
 * that will be centered in the viewport prior to scrolling the targetElement into view. If scrolling is prevented on
 * the body (e.g. targetElement is in a popover), this will only scroll the scroll parents of the targetElement up to but not including the body itself.
 */
export function scrollIntoViewport(targetElement: Element, opts?: ScrollIntoViewportOpts) {
  let scrollFn = () => scrollIntoViewportHelper(targetElement, opts);
  // If scrolling should be delayed (e.g. target exists in a overlay that hasn't finished sizing/positioning itself)
  // then we want to delay scrolling the target into view
  if (delayScrolling) {
    scrollCallbacks.add(scrollFn);
  } else {
    scrollFn();
  }
}

function scrollIntoViewportHelper(targetElement: Element, opts?: ScrollIntoViewportOpts) {
  if (document.contains(targetElement)) {
      // If scrolling is not currently prevented then we aren’t in a overlay nor is a overlay open, just use element.scrollIntoView to bring the element into view
    if (!isScrollPrevented) {
      debugger
      let {left: originalLeft, top: originalTop} = targetElement.getBoundingClientRect();

      // use scrollIntoView({block: 'nearest'}) instead of .focus to check if the element is fully in view or not since .focus()
      // won't cause a scroll if the element is already focused and doesn't behave consistently when an element is partially out of view horizontally vs vertically
      targetElement?.scrollIntoView?.({block: 'nearest'});
      let {left: newLeft, top: newTop} = targetElement.getBoundingClientRect();
      // Account for sub pixel differences from rounding
      if ((Math.abs(originalLeft - newLeft) > 1) || (Math.abs(originalTop - newTop) > 1)) {
        opts?.containingElement?.scrollIntoView?.({block: 'center', inline: 'center'});
        targetElement.scrollIntoView?.({block: 'nearest'});
      }
      debugger
    } else {
      let root = document.scrollingElement || document.documentElement;
      let scrollParent = getScrollParent(targetElement);
      // If scrolling is prevented, we don't want to scroll the body since it might move the overlay partially offscreen and the user can't scroll it back into view.
      while (targetElement && scrollParent && targetElement !== root && scrollParent !== root) {
        scrollIntoView(targetElement as HTMLElement, {scrollView: scrollParent as HTMLElement});
        targetElement = scrollParent;
        scrollParent = getScrollParent(targetElement);
      }
    }
  }
}
