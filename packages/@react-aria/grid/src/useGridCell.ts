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

import {getFocusableTreeWalker} from '@react-aria/focus';
import {GridNode, GridState} from '@react-stately/grid';
import {HTMLAttributes, RefObject} from 'react';
import {isFocusVisible, usePress} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';
import {useSelectableItem} from '@react-aria/selection';

interface GridCellProps {
  node: GridNode<unknown>,
  ref: RefObject<HTMLElement>,
  isVirtualized?: boolean
}

interface GridCellAria {
  gridCellProps: HTMLAttributes<HTMLElement>
}

export function useGridCell<T>(props: GridCellProps, state: GridState<T>): GridCellAria {
  let {
    node,
    ref,
    isVirtualized
  } = props;

  // Handles focusing the cell. If there is a focusable child,
  // it is focused, otherwise the cell itself is focused.
  let focus = () => {
    let treeWalker = getFocusableTreeWalker(ref.current);
    let focusable = treeWalker.firstChild() as HTMLElement;
    if (focusable) {
      focusable.focus();
    } else {
      ref.current.focus();
    }
  };

  let {itemProps} = useSelectableItem({
    selectionManager: state.selectionManager,
    itemKey: node.key,
    itemRef: ref,
    isVirtualized,
    focus
  });

  // TODO: move into useSelectableItem?
  let {pressProps} = usePress(itemProps);
  let interactions = mergeProps(itemProps, pressProps);

  // Grid cells can have focusable elements inside them. In this case, focus should
  // be marshalled to that element rather than focusing the cell itself.
  let onFocus = (e) => {
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
      focus();
    });
  };

  let gridCellProps: HTMLAttributes<HTMLElement> = mergeProps(interactions, {
    role: 'gridcell',
    onFocus
  });

  if (isVirtualized) {
    gridCellProps['aria-colindex'] = node.index + 1; // aria-colindex is 1-based
  }

  return {
    gridCellProps
  };
}
