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

import {AriaMenuProps} from '@react-types/menu';
import {DOMAttributes, KeyboardDelegate, KeyboardEvents} from '@react-types/shared';
import {filterDOMProps, mergeProps} from '@react-aria/utils';
import {Key, RefObject} from 'react';
import {TreeState} from '@react-stately/tree';
import {useKeyboard} from '@react-aria/interactions';
import {useSelectableList} from '@react-aria/selection';

export interface MenuAria {
  /** Props for the menu element. */
  menuProps: DOMAttributes
}

export interface AriaMenuOptions<T> extends Omit<AriaMenuProps<T>, 'children'>, KeyboardEvents {
  /** Whether the menu uses virtual scrolling. */
  isVirtualized?: boolean,

  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate
}

interface MenuData {
  onClose?: () => void,
  onAction?: (key: Key) => void
}

export const menuData = new WeakMap<TreeState<unknown>, MenuData>();

/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 * @param props - Props for the menu.
 * @param state - State for the menu, as returned by `useListState`.
 */
export function useMenu<T>(props: AriaMenuOptions<T>, state: TreeState<T>, ref: RefObject<HTMLElement>): MenuAria {
  let {
    shouldFocusWrap = true,
    onKeyDown,
    onKeyUp,
    ...otherProps
  } = props;

  if (!props['aria-label'] && !props['aria-labelledby']) {
    console.warn('An aria-label or aria-labelledby prop is required for accessibility.');
  }

  let domProps = filterDOMProps(props, {labelable: true});
  let {listProps} = useSelectableList({
    ...otherProps,
    ref,
    selectionManager: state.selectionManager,
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    shouldFocusWrap,
    linkBehavior: 'override'
  });

  menuData.set(state, {
    onClose: props.onClose,
    onAction: props.onAction
  });

  let {keyboardProps} = useKeyboard({
    onKeyDown(e) {
      // TODO: Let Tab propagate so FocusScope handle it. Revisit if we decide to close all menus
      // Also let Escape propagate so useOverlay handles closing the Menu overlay
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.continuePropagation();
      }

      onKeyDown && onKeyDown(e);
    },
    onKeyUp(e) {
      // Need to continue keyup propagation so MenuTrigger button's press state is properly reset, otherwise it gets stuck in pressed state
      e.continuePropagation();
      onKeyUp && onKeyUp(e);
    }
  });

  return {
    menuProps: mergeProps(domProps, keyboardProps, {
      role: 'menu',
      // TODO: we no longer update treestate's expandedKeys so we can't do the below anymore. This affects Safari VO specifically, the VO cursor doesn't move into the newly opened
      // submenu/dialog without it. Decide how bad this behavior is and if we wanna add a different prop (level or hasOpenSubmenu) and/or pass the submenutrigger state to control this instead
      // of using expanded keys
      // this forces AT to move their cursors into any open sub dialogs, the sub dialogs contain hidden close buttons in order to come back to this level of the menu
      // 'aria-hidden': state.expandedKeys.size > 0 ? true : undefined,
      ...listProps,
      onKeyDown: (e) => {
        // don't clear the menu selected keys if the user is presses escape since escape closes the menu
        if (e.key !== 'Escape') {
          listProps.onKeyDown(e);
        }
      }
    })
  };
}
