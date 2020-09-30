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

import {AriaHexColorFieldProps} from '@react-types/color';
import {
  HexColorFieldState,
  maxColor,
  minColor
} from '@react-stately/color';
import {
  HTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
  useEffect
} from 'react';
import {mergeProps, useId} from '@react-aria/utils';
import {useSpinButton} from '@react-aria/spinbutton';
import {useTextField} from '@react-aria/textfield';

interface HexColorFieldAria {
  labelProps: LabelHTMLAttributes<HTMLLabelElement>,
  inputFieldProps: HTMLAttributes<HTMLInputElement>
}

export function useHexColorField(
  props: Omit<AriaHexColorFieldProps, 'value' | 'defaultValue' | 'onChange'>,
  state: HexColorFieldState,
  ref: RefObject<HTMLInputElement>
): HexColorFieldAria {
  let {
    isDisabled,
    isReadOnly,
    isRequired
  } = props;
  
  let {
    colorValue,
    inputValue,
    setInputValue,
    commitInputValue,
    increment,
    decrement,
    incrementToMax,
    decrementToMin
  } = state;

  let inputId = useId();
  let {spinButtonProps} = useSpinButton(
    {
      isDisabled,
      isReadOnly,
      isRequired,
      maxValue: maxColor.toHexInt(),
      minValue: minColor.toHexInt(),
      onIncrement: increment,
      onIncrementToMax: incrementToMax,
      onDecrement: decrement,
      onDecrementToMin: decrementToMin,
      value: colorValue ? colorValue.toHexInt() : undefined,
      textValue: colorValue ? colorValue.toString('hex') : undefined
    }
  );

  // Taken from https://github.com/adobe/react-spectrum/pull/1029/
  useEffect(() => {
    let currentRef = ref.current;
    let handleInputScrollWheel = e => {
      // If the input isn't supposed to receive input, do nothing.
      // TODO: add focus
      if (isDisabled || isReadOnly || !currentRef) {
        return;
      }

      e.preventDefault();
      if (e.deltaY < 0) {
        increment();
      } else {
        decrement();
      }
    };

    if (!currentRef) { return; }
    currentRef.addEventListener(
      'wheel',
      handleInputScrollWheel,
      {passive: false}
    );
    return () => {
      currentRef.removeEventListener(
        'wheel',
        handleInputScrollWheel
      );
    };
  }, [inputId, isReadOnly, isDisabled, decrement, increment, ref]);

  let {labelProps, inputProps} = useTextField(
    mergeProps(props, {
      id: inputId,
      value: inputValue,
      type: 'text',
      autoComplete: 'off',
      onChange: setInputValue
    }), ref);

  return {
    labelProps,
    inputFieldProps: mergeProps(inputProps, spinButtonProps, {onBlur: commitInputValue})
  };
}
