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

import {Color, ColorSliderProps} from '@react-types/color';
import {normalizeColor, parseColor} from './Color';
import {SliderState, useSliderState} from '@react-stately/slider';
import {snapValueToStep, useControlledState} from '@react-stately/utils';

export interface ColorSliderState extends SliderState {
  /** The current color value represented by the color slider. */
  readonly value: Color,
  /** Sets the current color value. If a string is passed, it will be parsed to a Color. */
  setValue(value: string | Color): void,
  /** Returns the color that should be displayed in the slider instead of `value` or the optional parameter. */
  getDisplayColor(): Color
}


interface ColorSliderStateOptions extends ColorSliderProps {
  /** The locale to use for formatting the color channel value. */
  locale: string
}

/**
 * Provides state management for a color slider component.
 * Color sliders allow users to adjust an individual channel of a color value.
 */
export function useColorSliderState(props: ColorSliderStateOptions): ColorSliderState {
  let {channel, value, defaultValue, onChange, locale, ...otherProps} = props;
  if (value == null && defaultValue == null) {
    throw new Error('useColorSliderState requires a value or defaultValue');
  }

  let [color, setColor] = useControlledState(value && normalizeColor(value), defaultValue && normalizeColor(defaultValue), onChange);
  let sliderState = useSliderState({
    ...color.getChannelRange(channel),
    ...otherProps,
    // Unused except in getThumbValueLabel, which is overridden below. null to appease TypeScript.
    numberFormatter: null,
    value: [color.getChannelValue(channel)],
    onChange([v]) {
      setColor(color.withChannelValue(channel, v));
    },
    onChangeEnd([v]) {
      // onChange will have already been called with the right value, this is just to trigger onChangeEnd
      if (props.onChangeEnd) {
        props.onChangeEnd(color.withChannelValue(channel, v));
      }
    }
  });

  function incrementThumb(index: number, stepSize: number = 0) {
    let {maxValue, minValue, step} = color.getChannelRange(channel);
    let channelValue = color.getChannelValue(channel);
    stepSize = Math.max(stepSize, step);
    let snapToStep = stepSize > step && stepSize % step === 0 ? stepSize : step;
    sliderState.setThumbValue(index, channelValue + stepSize > maxValue ? maxValue : snapValueToStep(channelValue + stepSize, minValue, maxValue, snapToStep));
  }

  function decrementThumb(index: number, stepSize: number = 0) {
    let {maxValue, minValue, step} = color.getChannelRange(channel);
    let channelValue = color.getChannelValue(channel);
    stepSize = Math.max(stepSize, step);
    let snapToStep = stepSize > step && stepSize % step === 0 ? stepSize : step;
    sliderState.setThumbValue(index, channelValue - stepSize < minValue ? minValue : snapValueToStep(channelValue - stepSize, minValue, maxValue, snapToStep));
  }

  return {
    ...sliderState,
    value: color,
    setValue(value) {
      setColor(normalizeColor(value));
    },
    incrementThumb,
    decrementThumb,
    getDisplayColor() {
      switch (channel) {
        case 'hue':
          return parseColor(`hsl(${color.getChannelValue('hue')}, 100%, 50%)`);
        case 'lightness':
        case 'brightness':
        case 'saturation':
        case 'red':
        case 'green':
        case 'blue':
          return color.withChannelValue('alpha', 1);
        case 'alpha': {
          return color;
        }
        default:
          throw new Error('Unknown color channel: ' + channel);
      }
    },
    getThumbValueLabel() {
      return color.formatChannelValue(channel, locale);
    }
  };
}
