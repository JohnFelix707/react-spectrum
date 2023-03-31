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

import {DOMAttributes, FocusableElement, PressEvent} from '@react-types/shared';
import {focusSafely} from '@react-aria/focus';
import {getItemCount} from '@react-stately/collections';
import {isFocusVisible, useHover, useKeyboard, usePress} from '@react-aria/interactions';
import {Key, RefObject, useCallback} from 'react';
import {menuData} from './useMenu';
import {MenuTriggerState} from '@react-stately/menu';
import {mergeProps, useSlotId} from '@react-aria/utils';
import {TreeState} from '@react-stately/tree';
import {useSelectableItem} from '@react-aria/selection';

export interface MenuItemAria {
  /** Props for the menu item element. */
  menuItemProps: DOMAttributes,

  /** Props for the main text element inside the menu item. */
  labelProps: DOMAttributes,

  /** Props for the description text element inside the menu item, if any. */
  descriptionProps: DOMAttributes,

  /** Props for the keyboard shortcut text element inside the item, if any. */
  keyboardShortcutProps: DOMAttributes,

  /** Whether the item is currently focused. */
  isFocused: boolean,
  /** Whether the item is currently selected. */
  isSelected: boolean,
  /** Whether the item is currently in a pressed state. */
  isPressed: boolean,
  /** Whether the item is disabled. */
  isDisabled: boolean,
  /** Whether the item is hovered. */
  isHovered: boolean
}

export interface AriaMenuItemProps {
  /**
   * Whether the menu item is disabled.
   * @deprecated - pass disabledKeys to useTreeState instead.
   */
  isDisabled?: boolean,

  /**
   * Whether the menu item is selected.
   * @deprecated - pass selectedKeys to useTreeState instead.
   */
  isSelected?: boolean,

  /** A screen reader only label for the menu item. */
  'aria-label'?: string,

  /** The unique key for the menu item. */
  key?: Key,

  /**
   * Handler that is called when the menu should close after selecting an item.
   * @deprecated - pass to the menu instead.
   */
  onClose?: () => void,

  /**
   * Whether the menu should close when the menu item is selected.
   * @default true
   */
  closeOnSelect?: boolean,

  /** Whether the menu item is contained in a virtual scrolling menu. */
  isVirtualized?: boolean,

  /**
   * Handler that is called when the user activates the item.
   * @deprecated - pass to the menu instead.
   */
  onAction?: (key: Key) => void,
  isMenuDialogTrigger?: boolean,
  triggerState?: MenuTriggerState
}

/**
 * Provides the behavior and accessibility implementation for an item in a menu.
 * See `useMenu` for more details about menus.
 * @param props - Props for the item.
 * @param state - State for the menu, as returned by `useTreeState`.
 */
export function useMenuItem<T>(props: AriaMenuItemProps, state: TreeState<T>, ref: RefObject<FocusableElement>): MenuItemAria {
  let {
    key,
    closeOnSelect,
    isVirtualized,
    isMenuDialogTrigger,
    triggerState = {} as MenuTriggerState
  } = props;

  let {openKey, setOpenKey, setOpenRef} = triggerState;

  let isDisabled = props.isDisabled ?? state.disabledKeys.has(key);
  let isSelected = props.isSelected ?? state.selectionManager.isSelected(key);

  let data = menuData.get(state);
  let onClose = props.onClose || data.onClose;
  let onActionMenuDialogTrigger = useCallback(() => {
    setOpenKey?.(key);
    setOpenRef?.(ref);
  }, [setOpenKey, setOpenRef, key, ref]);
  let onAction = isMenuDialogTrigger ? onActionMenuDialogTrigger : props.onAction || data.onAction;

  let role = 'menuitem';
  if (state.selectionManager.selectionMode === 'single') {
    role = 'menuitemradio';
  } else if (state.selectionManager.selectionMode === 'multiple') {
    role = 'menuitemcheckbox';
  }

  let labelId = useSlotId();
  let descriptionId = useSlotId();
  let keyboardId = useSlotId();

  let ariaProps = {
    'aria-disabled': isDisabled || undefined,
    role,
    'aria-label': props['aria-label'],
    'aria-labelledby': labelId,
    'aria-describedby': [descriptionId, keyboardId].filter(Boolean).join(' ') || undefined
  };

  if (state.selectionManager.selectionMode !== 'none') {
    ariaProps['aria-checked'] = isSelected;
  }

  if (isVirtualized) {
    ariaProps['aria-posinset'] = state.collection.getItem(key).index;
    ariaProps['aria-setsize'] = getItemCount(state.collection);
  }

  if (isMenuDialogTrigger) {
    ariaProps['aria-haspopup'] = 'dialog';
    ariaProps['aria-expanded'] = openKey === key ? 'true' : 'false';
  }

  let onPressStart = (e: PressEvent) => {
    if (e.pointerType === 'keyboard' && onAction) {
      onAction(key);
    }
  };

  let onPressUp = (e: PressEvent) => {
    if (e.pointerType !== 'keyboard') {
      if (onAction) {
        onAction(key);
      }

      // Pressing a menu item should close by default in single selection mode but not multiple
      // selection mode, except if overridden by the closeOnSelect prop.
      if (!isMenuDialogTrigger && onClose && (closeOnSelect ?? state.selectionManager.selectionMode !== 'multiple')) {
        onClose();
      }
    }
  };

  let {itemProps, isFocused} = useSelectableItem({
    selectionManager: state.selectionManager,
    key,
    ref,
    shouldSelectOnPressUp: true,
    allowsDifferentPressOrigin: true
  });

  let {pressProps, isPressed} = usePress({onPressStart, onPressUp, isDisabled});
  let {hoverProps, isHovered} = useHover({
    isDisabled,
    onHoverStart() {
      if (!isFocusVisible()) {
        state.selectionManager.setFocused(true);
        state.selectionManager.setFocusedKey(key);
        // focus immediately so that a focus scope opened on hover has the correct restore node
        let isFocused = key === state.selectionManager.focusedKey;
        if (isFocused && state.selectionManager.isFocused && document.activeElement !== ref.current) {
          focusSafely(ref.current);
        }
      }
    },
    onHoverChange: isHovered => {
      if (isHovered && isMenuDialogTrigger) {
        setOpenKey?.(key);
        setOpenRef?.(ref);
      }
    }
  });

  let {keyboardProps} = useKeyboard({
    onKeyDown: (e) => {
      // Ignore repeating events, which may have started on the menu trigger before moving
      // focus to the menu item. We want to wait for a second complete key press sequence.
      if (e.repeat) {
        e.continuePropagation();
        return;
      }

      switch (e.key) {
        case ' ':
          if (!isDisabled && state.selectionManager.selectionMode === 'none' && !isMenuDialogTrigger && closeOnSelect !== false && onClose) {
            onClose();
          }
          break;
        case 'Enter':
          // The Enter key should always close on select, except if overridden.
          if (!isDisabled && closeOnSelect !== false && !isMenuDialogTrigger && onClose) {
            onClose();
          }
          break;
        case 'ArrowRight':
          if (isMenuDialogTrigger) {
            setOpenKey(key);
            setOpenRef(ref);
          }
          break;
      }
      e.continuePropagation();
    }
  });

  return {
    menuItemProps: {
      ...ariaProps,
      ...mergeProps(itemProps, pressProps, hoverProps, keyboardProps)
    },
    labelProps: {
      id: labelId
    },
    descriptionProps: {
      id: descriptionId
    },
    keyboardShortcutProps: {
      id: keyboardId
    },
    isFocused,
    isSelected,
    isPressed,
    isHovered,
    isDisabled
  };
}
