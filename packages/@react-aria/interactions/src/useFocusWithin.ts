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

// Portions of the code in this file are based on code from react.
// Original licensing for the following can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions

import {HTMLAttributes, FocusEvent as ReactFocusEvent, useRef} from 'react';

interface FocusWithinProps {
  /** Whether the focus within events should be disabled. */
  isDisabled?: boolean,
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: ReactFocusEvent) => void,
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: ReactFocusEvent) => void,
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void
}

interface FocusWithinResult {
  /** Props to spread onto the target element. */
  focusWithinProps: HTMLAttributes<HTMLElement>
}

/**
 * Handles focus events for the target and its descendants.
 */
export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  let state = useRef({
    isFocusWithin: false
  }).current;

  let onBlurWithin = useRef<FocusWithinProps['onBlurWithin']>(null);
  if (props.isDisabled) {
    return {focusWithinProps: {}};
  }

  let onFocus = (e: ReactFocusEvent) => {
    if (!state.isFocusWithin) {
      if (props.onFocusWithin) {
        props.onFocusWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(true);
      }

      state.isFocusWithin = true;

      // Use native events to handle the onBlur. React does not fire onBlur when an element is disabled.
      // https://github.com/facebook/react/issues/9142
      let SyntheticEvent: any = e.constructor;
      let observer: MutationObserver;
      let onBlur = (e: FocusEvent) => {
        // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
        // when moving focus inside the element. Only trigger if the currentTarget doesn't
        // include the relatedTarget (where focus is moving).
        if (state.isFocusWithin && !(e.currentTarget as Element).contains(e.relatedTarget as Element)) {
          state.isFocusWithin = false;

          // For backwards compatibility, construct a React synthetic event.
          let event: ReactFocusEvent = new SyntheticEvent('onBlur', 'blur', null, e, e.target);
          event.currentTarget = e.currentTarget as Element;

          onBlurWithin.current?.(event);

          if (event.isPropagationStopped()) {
            e.stopPropagation();
          }

          e.currentTarget.removeEventListener('focusout', onBlur);
        }

        if (observer) {
          observer.disconnect();
          observer = null;
        }
      };

      e.currentTarget.addEventListener('focusout', onBlur);

      // If this is a <button> or <input>, use a MutationObserver to watch for the disabled attribute.
      // This is necessary because Firefox does not fire blur/focusout in this case. We dispatch these events ourselves instead.
      // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) {
        let target = e.target;
        observer = new MutationObserver(() => {
          if (state.isFocusWithin && target.disabled) {
            observer.disconnect();
            target.dispatchEvent(new FocusEvent('blur'));
            target.dispatchEvent(new FocusEvent('focusout', {bubbles: true}));
          }
        });

        observer.observe(e.target, {attributes: true, attributeFilter: ['disabled']});
      }
    }
  };

  if (props.onBlurWithin || props.onFocusWithinChange) {
    onBlurWithin.current = (e: ReactFocusEvent) => {
      if (props.onBlurWithin) {
        props.onBlurWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(false);
      }
    };
  } else {
    onBlurWithin.current = null;
  }

  return {
    focusWithinProps: {
      onFocus
    }
  };
}
