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

import {HTMLAttributes, RefObject, useEffect} from 'react';
import {useId} from '@react-aria/utils';

interface OverlayTriggerProps {
  /** A ref to the trigger element. */
  ref: RefObject<HTMLElement | null>,

  /** Type of overlay that is opened by the trigger. */
  type: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid',

  /** Whether the overlay is currently open. */
  isOpen?: boolean,

  /** Handler that is called when the overlay should close. */
  onClose?: () => void
}

interface OverlayTriggerAria {
  /** Props for the trigger element. */
  triggerProps: HTMLAttributes<HTMLElement>,

  /** Props for the overlay container element. */
  overlayProps: HTMLAttributes<HTMLElement>
}

/**
 * Handles the behavior and accessibility for an overlay trigger, e.g. a button
 * that opens a popover, menu, or other overlay that is positioned relative to the trigger.
 */
export function useOverlayTrigger(props: OverlayTriggerProps): OverlayTriggerAria {
  let {ref, type, onClose, isOpen} = props;
  
  // When scrolling a parent scrollable region of the trigger (other than the body),
  // we hide the popover. Otherwise, its position would be incorrect.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let onScroll = (e: MouseEvent) => {
      // Ignore if scrolling an scrollable region outside the trigger's tree.
      let target = e.target as HTMLElement;
      if (!ref.current || !target.contains(ref.current)) {
        return;
      }

      if (onClose) {
        onClose();
      }
    };

    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, onClose, ref]);

  // Aria 1.1 supports multiple values for aria-haspopup other than just menus.
  // https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
  // However, we only add it for menus for now because screen readers often 
  // announce it as a menu even for other values.
  let ariaHasPopup = undefined;
  if (type === 'menu') {
    ariaHasPopup = true;
  } else if (type === 'listbox') {
    ariaHasPopup = 'listbox';
  }

  let overlayId = useId();
  return {
    triggerProps: {
      'aria-haspopup': ariaHasPopup,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? overlayId : null
    },
    overlayProps: {
      id: overlayId
    }
  };
}
