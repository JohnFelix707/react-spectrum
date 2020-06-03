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

import {AriaRadioGroupProps} from '@react-types/radio';
import {filterDOMProps, mergeProps} from '@react-aria/utils';
import {getFocusableTreeWalker} from '@react-aria/focus';
import {HTMLAttributes} from 'react';
import {RadioGroupState} from '@react-stately/radio';
import {useFocusWithin} from '@react-aria/interactions';
import {useLabel} from '@react-aria/label';
import {useLocale} from '@react-aria/i18n';

interface RadioGroupAria {
  /** Props for the radio group wrapper element. */
  radioGroupProps: HTMLAttributes<HTMLElement>,
  /** Props for the radio group's visible label (if any). */
  labelProps: HTMLAttributes<HTMLElement>
}

/**
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 * @param props - props for the radio group
 * @param state - state for the radio group, as returned by `useRadioGroupState`
 */
export function useRadioGroup(props: AriaRadioGroupProps, state: RadioGroupState): RadioGroupAria {
  let {
    validationState,
    isReadOnly,
    isRequired,
    isDisabled,
    orientation = 'vertical'
  } = props;
  let {direction} = useLocale();

  let {labelProps, fieldProps} = useLabel({
    ...props,
    // Radio group is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: 'span'
  });

  let domProps = filterDOMProps(props, {labelable: true});

  // When the radio group loses focus, reset the focusable radio to null if
  // there is no selection. This allows tabbing into the group from either
  // direction to go to the first or last radio.
  let {focusWithinProps} = useFocusWithin({
    onBlurWithin() {
      if (!state.selectedValue) {
        state.setFocusableRadio(null);
      }
    }
  });

  let onKeyDown = (e) => {
    let walker = getFocusableTreeWalker(e.currentTarget, {from: e.target});
    let nextDir;
    switch (e.key) {
      case 'ArrowRight':
        if (direction === 'rtl' && orientation !== 'vertical') {
          nextDir = 'prev';
        } else {
          nextDir = 'next';
        }
        break;
      case 'ArrowLeft':
        if (direction === 'rtl' && orientation !== 'vertical') {
          nextDir = 'next';
        } else {
          nextDir = 'prev';
        }
        break;
      case 'ArrowDown':
        nextDir = 'next';
        break;
      case 'ArrowUp':
        nextDir = 'prev';
        break;
      default:
        return;
    }
    e.preventDefault();
    let nextElem;
    if (nextDir === 'next') {
      nextElem = walker.nextNode();
      if (!nextElem) {
        walker.currentNode = e.currentTarget;
        nextElem = walker.firstChild();
      }
    } else {
      nextElem = walker.previousNode();
      if (!nextElem) {
        walker.currentNode = e.currentTarget;
        nextElem = walker.lastChild();
      }
    }
    if (nextElem) {
      nextElem.click();
    }
  };

  return {
    radioGroupProps: mergeProps(domProps, {
      // https://www.w3.org/TR/wai-aria-1.2/#radiogroup
      role: 'radiogroup',
      onKeyDown,
      'aria-invalid': validationState === 'invalid' || undefined,
      'aria-errormessage': props['aria-errormessage'],
      'aria-readonly': isReadOnly || undefined,
      'aria-required': isRequired || undefined,
      'aria-disabled': isDisabled || undefined,
      'aria-orientation': orientation,
      ...fieldProps,
      ...focusWithinProps
    }),
    labelProps
  };
}
