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

import {Axis, Placement, PlacementAxis, SizeAxis} from '@react-types/overlays';
import getCss from 'dom-helpers/style';
import getOffset from 'dom-helpers/query/offset';
import getPosition from 'dom-helpers/query/position';
import getScrollLeft from 'dom-helpers/query/scrollLeft';
import getScrollTop from 'dom-helpers/query/scrollTop';
import ownerDocument from 'dom-helpers/ownerDocument';

interface Position {
  top?: number,
  left?: number,
  bottom?: number,
  right?: number
}

interface Dimensions {
  width: number,
  height: number,
  top: number,
  left: number,
  scroll: Position
}

interface ParsedPlacement {
  placement: PlacementAxis,
  crossPlacement: PlacementAxis,
  axis: Axis,
  crossAxis: Axis,
  size: SizeAxis,
  crossSize: SizeAxis
}

interface Offset {
  top: number,
  left: number,
  width: number,
  height: number
}

interface PositionOpts {
  placement: Placement,
  targetNode: HTMLElement,
  overlayNode: HTMLElement,
  scrollNode: HTMLElement,
  padding: number,
  shouldFlip: boolean,
  boundaryElement: HTMLElement,
  offset: number,
  crossOffset: number
}

export interface PositionResult {
  position?: Position,
  arrowOffsetLeft?: number,
  arrowOffsetTop?: number,
  maxHeight?: number,
  placement: PlacementAxis
}

const AXIS = {
  top: 'top',
  bottom: 'top',
  left: 'left',
  right: 'left'
};

const FLIPPED_DIRECTION = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};

const CROSS_AXIS = {
  top: 'left',
  left: 'top'
};

const AXIS_SIZE = {
  top: 'height',
  left: 'width'
};

const PARSED_PLACEMENT_CACHE = {};

function getContainerDimensions(containerNode: Element): Dimensions {
  let width = 0, height = 0, top = 0, left = 0;
  let scroll: Position = {};

  if (containerNode.tagName === 'BODY') {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;

    scroll.top =
      getScrollTop(ownerDocument(containerNode).documentElement) ||
      getScrollTop(containerNode);
    scroll.left =
      getScrollLeft(ownerDocument(containerNode).documentElement) ||
      getScrollLeft(containerNode);
  } else {
    ({width, height, top, left} = getOffset(containerNode));
    scroll.top = getScrollTop(containerNode);
    scroll.left = getScrollLeft(containerNode);
  }

  return {width, height, scroll, top, left};
}

function getScroll(node: HTMLElement): Offset {
  return {
    top: node.scrollTop,
    left: node.scrollLeft,
    width: node.scrollWidth,
    height: node.scrollHeight
  };
}

function getDelta(
  axis: Axis,
  offset: number,
  size: number,
  containerDimensions: Dimensions,
  padding: number
) {
  let containerScroll = containerDimensions.scroll[axis];
  let containerHeight = containerDimensions[AXIS_SIZE[axis]];

  let startEdgeOffset = offset - padding - containerScroll;
  let endEdgeOffset = offset + padding - containerScroll + size;

  if (startEdgeOffset < 0) {
    return -startEdgeOffset;
  } else if (endEdgeOffset > containerHeight) {
    return Math.max(containerHeight - endEdgeOffset, -startEdgeOffset);
  } else {
    return 0;
  }
}

function getMargins(node: HTMLElement): Position {
  let style = window.getComputedStyle(node);
  return {
    top: parseInt(style.marginTop, 10) || 0,
    bottom: parseInt(style.marginBottom, 10) || 0,
    left: parseInt(style.marginLeft, 10) || 0,
    right: parseInt(style.marginRight, 10) || 0
  };
}

function parsePlacement(input: Placement): ParsedPlacement {
  if (PARSED_PLACEMENT_CACHE[input]) {
    return PARSED_PLACEMENT_CACHE[input];
  }

  let [placement, crossPlacement] = input.split(' ');
  let axis: Axis = AXIS[placement] || 'right';
  let crossAxis: Axis = CROSS_AXIS[axis];

  if (!AXIS[crossPlacement]) {
    crossPlacement = 'center';
  }

  let size = AXIS_SIZE[axis];
  let crossSize = AXIS_SIZE[crossAxis];
  PARSED_PLACEMENT_CACHE[input] = {placement, crossPlacement, axis, crossAxis, size, crossSize};
  return PARSED_PLACEMENT_CACHE[input];
}

function computePosition(
  childOffset: Offset,
  boundaryDimensions: Dimensions,
  overlaySize: Offset,
  placementInfo: ParsedPlacement,
  offset: number,
  crossOffset: number
) {
  let {placement, crossPlacement, axis, crossAxis, size, crossSize} = placementInfo;
  let position: Position = {};

  position[crossAxis] = childOffset[crossAxis] + crossOffset;
  if (crossPlacement === 'center') {
    position[crossAxis] += (childOffset[crossSize] - overlaySize[crossSize]) / 2;
  } else if (crossPlacement !== crossAxis) {
    position[crossAxis] += (childOffset[crossSize] - overlaySize[crossSize]);
  }

  // Ensure overlay sticks to target(ignore for overlays smaller than target)
  if (childOffset[crossSize] < overlaySize[crossSize]) {
    let positionForPositiveSideOverflow = Math.min(position[crossAxis], childOffset[crossAxis]);
    position[crossAxis] = Math.max(positionForPositiveSideOverflow, childOffset[crossAxis] - overlaySize[crossSize] + childOffset[crossSize]);
  }

  // Floor these so the position isn't placed on a partial pixel, only whole pixels. Shouldn't matter if it was floored or ceiled, so chose one.
  if (placement === axis) {
    position[FLIPPED_DIRECTION[axis]] = Math.floor(boundaryDimensions[size] - childOffset[axis] + offset);
  } else {
    position[axis] = Math.floor(childOffset[axis] + childOffset[size] + offset);
  }

  return position;
}

function getMaxHeight(
  position: Position,
  boundaryDimensions: Dimensions,
  containerOffsetWithBoundary: Offset,
  childOffset: Offset,
  margins: Position,
  padding: number
) {
  return position.top != null
    ? Math.max(0, boundaryDimensions.height + boundaryDimensions.top + boundaryDimensions.scroll.top + containerOffsetWithBoundary.top - position.top - margins.top - margins.bottom - padding)
    : Math.max(0, childOffset.top - boundaryDimensions.top - boundaryDimensions.scroll.top - containerOffsetWithBoundary.top - margins.top - margins.bottom - padding);
}

function getAvailableSpace(
  boundaryDimensions: Dimensions,
  containerOffsetWithBoundary: Offset,
  childOffset: Offset,
  margins: Position,
  padding: number,
  placementInfo: ParsedPlacement
) {
  let {placement, axis, size} = placementInfo;
  if (placement === axis) {
    return Math.max(0, childOffset[axis] - boundaryDimensions[axis] - boundaryDimensions.scroll[axis] + containerOffsetWithBoundary[axis] - margins[axis] - margins[FLIPPED_DIRECTION[axis]] - padding);
  }

  return Math.max(0, boundaryDimensions[size] + boundaryDimensions[axis] + boundaryDimensions.scroll[axis] - containerOffsetWithBoundary[axis] - childOffset[axis] - childOffset[size] - margins[axis] - margins[FLIPPED_DIRECTION[axis]] - padding);
}

export function calculatePositionInternal(
  placementInput: Placement,
  childOffset: Offset,
  overlaySize: Offset,
  scrollSize: Offset,
  margins: Position,
  padding: number,
  flip: boolean,
  boundaryDimensions: Dimensions,
  containerOffsetWithBoundary: Offset,
  offset: number,
  crossOffset: number
): PositionResult {
  let placementInfo = parsePlacement(placementInput);
  let {size, crossAxis, crossSize, placement, crossPlacement} = placementInfo;
  let position = computePosition(childOffset, boundaryDimensions, overlaySize, placementInfo, offset, crossOffset);
  let normalizedOffset = offset;
  let space = getAvailableSpace(
    boundaryDimensions,
    containerOffsetWithBoundary,
    childOffset,
    margins,
    padding + offset,
    placementInfo
  );

  // Check if the scroll size of the overlay is greater than the available space to determine if we need to flip
  if (flip && scrollSize[size] > space) {
    let flippedPlacementInfo = parsePlacement(`${FLIPPED_DIRECTION[placement]} ${crossPlacement}` as Placement);
    let flippedPosition = computePosition(childOffset, boundaryDimensions, overlaySize, flippedPlacementInfo, -1 * offset, crossOffset);
    let flippedSpace = getAvailableSpace(
      boundaryDimensions,
      containerOffsetWithBoundary,
      childOffset,
      margins,
      padding + offset,
      flippedPlacementInfo
    );

    // If the available space for the flipped position is greater than the original available space, flip.
    if (flippedSpace > space) {
      placementInfo = flippedPlacementInfo;
      position = flippedPosition;
      normalizedOffset = -1 * offset;
    }
  }

  let delta = getDelta(crossAxis, position[crossAxis], overlaySize[crossSize], boundaryDimensions, padding);
  position[crossAxis] += delta;

  let maxHeight = getMaxHeight(
    position,
    boundaryDimensions,
    containerOffsetWithBoundary,
    childOffset,
    margins,
    padding
  );

  overlaySize.height = Math.min(overlaySize.height, maxHeight);

  position = computePosition(childOffset, boundaryDimensions, overlaySize, placementInfo, normalizedOffset, crossOffset);
  delta = getDelta(crossAxis, position[crossAxis], overlaySize[crossSize], boundaryDimensions, padding);
  position[crossAxis] += delta;

  let arrowPosition: Position = {};
  arrowPosition[crossAxis] = childOffset[crossSize] > overlaySize[crossSize] ? null : (childOffset[crossAxis] - position[crossAxis] + childOffset[crossSize] / 2);

  return {
    position,
    maxHeight: maxHeight,
    arrowOffsetLeft: arrowPosition.left,
    arrowOffsetTop: arrowPosition.top,
    placement: placementInfo.placement
  };
}

export function calculatePosition(opts: PositionOpts): PositionResult {
  let {
    placement,
    targetNode,
    overlayNode,
    scrollNode,
    padding,
    shouldFlip,
    boundaryElement,
    offset,
    crossOffset
  } = opts;

  let container = overlayNode.offsetParent || document.body;
  let isBodyContainer = container.tagName === 'BODY';
  let childOffset: Offset = isBodyContainer ? getOffset(targetNode) : getPosition(targetNode, container);

  if (!isBodyContainer) {
    childOffset.top += parseInt(getCss(targetNode, 'marginTop'), 10) || 0;
    childOffset.left += parseInt(getCss(targetNode, 'marginLeft'), 10) || 0;
  }

  let overlaySize: Offset = getOffset(overlayNode);
  let margins = getMargins(overlayNode);
  overlaySize.width += margins.left + margins.right;
  overlaySize.height += margins.top + margins.bottom;

  let scrollSize = getScroll(scrollNode);
  let boundaryDimensions = getContainerDimensions(boundaryElement);
  let containerOffsetWithBoundary: Offset = boundaryElement.tagName === 'BODY' ? getOffset(container) : getPosition(container, boundaryElement);

  return calculatePositionInternal(
    placement,
    childOffset,
    overlaySize,
    scrollSize,
    margins,
    padding,
    shouldFlip,
    boundaryDimensions,
    containerOffsetWithBoundary,
    offset,
    crossOffset
  );
}
