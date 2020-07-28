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

import {AriaButtonProps} from '@react-types/button';
import {HTMLAttributes, RefObject} from 'react';
import {MenuTriggerState} from '@react-stately/menu';
import {useId, mergeProps} from '@react-aria/utils';
import {useOverlayTrigger} from '@react-aria/overlays';
import { useLongPress } from '@react-aria/interactions/src/useLongPress';
import { MenuTriggerType } from '@react-types/menu';

interface MenuTriggerAriaProps {
  /** The type of menu that the menu trigger opens. */
  type?: 'menu' | 'listbox'
}

interface MenuTriggerAria {
  /** Props for the menu trigger element. */
  menuTriggerProps: AriaButtonProps,

  /** Props for the menu. */
  menuProps: HTMLAttributes<HTMLElement>
}

/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 * @param props - Props for the menu trigger.
 * @param state - State for the menu trigger.
 */
export function useMenuTrigger(props: MenuTriggerAriaProps, state: MenuTriggerState, ref: RefObject<HTMLElement>, trigger?: MenuTriggerType): MenuTriggerAria {
  let {
    type = 'menu' as MenuTriggerAriaProps['type']
  } = props;

  let menuTriggerId = useId();
  let {triggerProps, overlayProps} = useOverlayTrigger({type}, state, ref);
  
  const handleArrowKeyBehaviour = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        state.toggle('first');
        break;
      case 'ArrowUp':
        e.preventDefault();
        state.toggle('last');
        break;
    }
  }

  const handleLongPressAltBehaviour = (e) => {
    if (e.altKey) {
      handleArrowKeyBehaviour(e)
    }
  };
  
  let onKeyDown = (e) => {
    if ((typeof e.isDefaultPrevented === 'function' && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    if (ref && ref.current) {
      if (trigger === "longPress") {
        handleLongPressAltBehaviour(e)
      } else  {
        handleArrowKeyBehaviour(e)
      }
    }
  };

  const longPressProps = useLongPress({
    onLongPress(e) {
      // For consistency with native, open the menu on mouse/key down, but touch up.
      if (e.pointerType !== 'touch') {
        state.toggle(e.pointerType === 'keyboard' || e.pointerType === 'virtual' ? 'first' : null);
      } else {
        // If opened with a keyboard or screen reader, auto focus the first item.
        // Otherwise, the menu itself will be focused.
        state.toggle();
      }
    }
  });


  let menuTriggerProps : any = {
    ...triggerProps,
    id: menuTriggerId,
  }

  if(trigger === "longPress") {
    menuTriggerProps = {
      ...menuTriggerProps,
      ...longPressProps
    }
  } else {
    menuTriggerProps = {
      ...menuTriggerProps,
      onPressStart(e) {
        // For consistency with native, open the menu on mouse/key down, but touch up.
        if (e.pointerType !== 'touch') {
          // If opened with a keyboard or screen reader, auto focus the first item.
          // Otherwise, the menu itself will be focused.
          state.toggle(e.pointerType === 'keyboard' || e.pointerType === 'virtual' ? 'first' : null);
        }
      },
      onPress(e) {
        if (e.pointerType === 'touch') {
          state.toggle();
        }
      },
    }
}

  menuTriggerProps = mergeProps(menuTriggerProps, { onKeyDown })
  
  return {
    menuTriggerProps,
    menuProps: {
      ...overlayProps,
      'aria-labelledby': menuTriggerId
    }
  };
}
