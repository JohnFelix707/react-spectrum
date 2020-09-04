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
import {Color, HexColorFieldState} from '@react-stately/color';
import {HTMLAttributes, LabelHTMLAttributes, RefObject} from 'react';
import {useSpinButton} from '@react-aria/spinbutton';
import {useId} from '@react-aria/utils';
import {useTextField} from '@react-aria/textfield';

interface HexColorFieldAria {
  labelProps: LabelHTMLAttributes<HTMLLabelElement>,
  inputFieldProps: HTMLAttributes<HTMLInputElement>
}

export function useHexColorField(
  props: AriaHexColorFieldProps,
  state: HexColorFieldState,
  ref: RefObject<HTMLInputElement>
): HexColorFieldAria {
  const {
    value,        // eslint-disable-line @typescript-eslint/no-unused-vars
    defaultValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    onChange,     // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherProps
  } = props;

  const {
    isDisabled,
    isReadOnly,
    isRequired,
    minValue = '#000000',
    maxValue = '#ffffff',
  } = otherProps;
  
  const {
    colorValue,
    inputValue,
    increment,
    decrement,
    incrementToMax,
    decrementToMin,
  } = state;

  const minColor = typeof minValue === 'string' ? new Color(minValue) : minValue;
  const minColorString = minColor.toString('hex').substring(1);
  const minColorNumber = parseInt(minColorString, 16);

  const maxColor = typeof maxValue === 'string' ? new Color(maxValue) : maxValue;
  const maxColorString = maxColor.toString('hex').substring(1);
  const maxColorNumber = parseInt(maxColorString, 16);

  const colorValueString = colorValue.toString('hex').substring(1);
  const colorValueNumber = parseInt(colorValueString, 16);

  const {spinButtonProps} = useSpinButton(
    {
      isDisabled,
      isReadOnly,
      isRequired,
      maxValue: maxColorNumber,
      minValue: minColorNumber,
      onIncrement: increment,
      onIncrementToMax: incrementToMax,
      onDecrement: decrement,
      onDecrementToMin: decrementToMin,
      value: colorValueNumber,
      textValue: inputValue
    }
  );

  const inputId = useId();
  let {labelProps, inputProps} = useTextField({
    ...otherProps,
    id: inputId,
    value: inputValue,
    type: 'text',
    autoComplete: 'off',
    onChange: (val) => console.log(val)
  }, ref);
  
  return {
    labelProps,
    inputFieldProps: {
      ...inputProps,
      onKeyDown: spinButtonProps.onKeyDown,
      onFocus: spinButtonProps.onFocus,
      onBlur: spinButtonProps.onBlur
    }
  };
}
