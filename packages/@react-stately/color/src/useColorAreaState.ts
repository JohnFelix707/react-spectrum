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

import {clamp, snapValueToStep} from '@react-aria/utils';
import {Color, ColorAreaProps, ColorChannel} from '@react-types/color';
import {normalizeColor, parseColor} from './Color';
import {useControlledState} from '@react-stately/utils';
import {useMemo, useRef, useState} from 'react';

export interface ColorAreaState {
  /** The current color value displayed by the color area. */
  readonly value: Color,
  /** Sets the current color value. If a string is passed, it will be parsed to a Color. */
  setValue(value: string | Color): void,

  /** The current value of the horizontal axis channel displayed by the color area. */
  xValue: number,
  /** Sets the value for the horizontal axis channel displayed by the color area, and triggers `onChange`. */
  setXValue(value: number): void,

  /** The current value of the vertical axis channel displayed by the color area. */
  yValue: number,
  /** Sets the value for the vertical axis channel displayed by the color area, and triggers `onChange`. */
  setYValue(value: number): void,

  /** Sets the x and y channels of the current color value based on a percentage of the width and height of the color area, and triggers `onChange`. */
  setColorFromPoint(x: number, y: number): void,
  /** Returns the coordinates of the thumb relative to the upper left corner of the color area as a percentage. */
  getThumbPosition(): {x: number, y: number},

  /** Increments the value of the horizontal axis channel by the channel step or page amount. */
  incrementX(stepSize?: number): void,
  /** Decrements the value of the horizontal axis channel by the channel step or page amount. */
  decrementX(stepSize?: number): void,

  /** Increments the value of the vertical axis channel by the channel step or page amount. */
  incrementY(stepSize?: number): void,
  /** Decrements the value of the vertical axis channel by the channel step or page amount. */
  decrementY(stepSize?: number): void,

  /** Whether the color area is currently being dragged. */
  readonly isDragging: boolean,
  /** Sets whether the color area is being dragged. */
  setDragging(value: boolean): void,

  /** Returns the xChannel, yChannel and zChannel names based on the color value. */
  channels: {xChannel: ColorChannel, yChannel: ColorChannel, zChannel: ColorChannel},
  xChannelStep: number,
  yChannelStep: number,
  xChannelPageStep: number,
  yChannelPageStep: number,

  /** Returns the color that should be displayed in the color area thumb instead of `value`. */
  getDisplayColor(): Color
}

const DEFAULT_COLOR = parseColor('#ffffff');
let difference = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a].filter(x => !b.has(x)));

/**
 * Provides state management for a color area component.
 * Color area allows users to adjust two channels of an HSL, HSB or RGB color value against a two-dimensional gradient background.
 */
export function useColorAreaState(props: ColorAreaProps): ColorAreaState {
  let {value, defaultValue, xChannel, yChannel, onChange, onChangeEnd, xChannelStep, yChannelStep} = props;

  if (!value && !defaultValue) {
    defaultValue = DEFAULT_COLOR;
  }

  let [color, setColor] = useControlledState(value && normalizeColor(value), defaultValue && normalizeColor(defaultValue), onChange);
  let valueRef = useRef(color);
  valueRef.current = color;

  let channels = useMemo(() => {
    let xCh = xChannel;
    let yCh = yChannel;
    // determine the color space from the color value
    let colorSpace = valueRef.current.getColorSpace();

    if (colorSpace === 'rgb') {
      if (!xChannel) {
        switch (yChannel) {
          case 'red':
          case 'green':
            xCh = 'blue';
            break;
          case 'blue':
            xCh = 'red';
            break;
          default:
            xCh = 'blue';
            yCh = 'green';
        }
      } else if (!yChannel) {
        switch (xChannel) {
          case 'red':
            yCh = 'green';
            break;
          case 'blue':
            yCh = 'red';
            break;
          default:
            xCh = 'blue';
            yCh = 'green';
        }
      }
    } else if (!xChannel) {
      switch (yChannel) {
        case 'hue':
          xCh = colorSpace === 'hsb' ? 'brightness' : 'lightness';
          break;
        case 'brightness':
        case 'lightness':
          xCh = 'saturation';
          break;
        default:
          xCh = 'saturation';
          yCh = colorSpace === 'hsb' ? 'brightness' : 'lightness';
          break;
      }
    } else if (!yChannel) {
      switch (xChannel) {
        case 'hue':
          yCh = colorSpace === 'hsb' ? 'brightness' : 'lightness';
          break;
        case 'brightness':
        case 'lightness':
          yCh = 'saturation';
          break;
        default:
          xCh = 'saturation';
          yCh = colorSpace === 'hsb' ? 'brightness' : 'lightness';
          break;
      }
    }

    let xyChannels: Set<ColorChannel> = new Set([xChannel, yChannel]);
    let zChannel = difference(valueRef.current.getColorChannels(), xyChannels).values().next().value as ColorChannel;

    return {xChannel: xCh, yChannel: yCh, zChannel};
  }, [xChannel, yChannel]);

  let xChannelRange = color.getChannelRange(channels.xChannel);
  let yChannelRange = color.getChannelRange(channels.yChannel);
  let {minValue: minValueX, maxValue: maxValueX, step: stepX, pageSize: pageSizeX} = xChannelRange;
  let {minValue: minValueY, maxValue: maxValueY, step: stepY, pageSize: pageSizeY} = yChannelRange;

  if (isNaN(xChannelStep)) {
    xChannelStep = stepX;
  }

  if (isNaN(yChannelStep)) {
    yChannelStep = stepY;
  }

  let xChannelPageStep = Math.max(pageSizeX, xChannelStep);
  let yChannelPageStep = Math.max(pageSizeY, yChannelStep);

  let [isDragging, setDragging] = useState(false);
  let isDraggingRef = useRef(false).current;

  let xValue = color.getChannelValue(channels.xChannel);
  let yValue = color.getChannelValue(channels.yChannel);
  let setXValue = (v: number) => {
    if (v === xValue) {
      return;
    }
    valueRef.current = color.withChannelValue(channels.xChannel, v);
    setColor(valueRef.current);
  };
  let setYValue = (v: number) => {
    if (v === yValue) {
      return;
    }
    valueRef.current = color.withChannelValue(channels.yChannel, v);
    setColor(valueRef.current);
  };

  return {
    channels,
    xChannelStep,
    yChannelStep,
    xChannelPageStep,
    yChannelPageStep,
    value: color,
    setValue(value) {
      let c = normalizeColor(value);
      valueRef.current = c;
      setColor(c);
    },
    xValue,
    setXValue,
    yValue,
    setYValue,
    setColorFromPoint(x: number, y: number) {
      let newXValue = minValueX + clamp(x, 0, 1) * (maxValueX - minValueX);
      let newYValue = minValueY + (1 - clamp(y, 0, 1)) * (maxValueY - minValueY);
      let newColor:Color;
      if (newXValue !== xValue) {
        // Round new value to multiple of step, clamp value between min and max
        newXValue = snapValueToStep(newXValue, minValueX, maxValueX, xChannelStep);
        newColor = color.withChannelValue(channels.xChannel, newXValue);
      }
      if (newYValue !== yValue) {
        // Round new value to multiple of step, clamp value between min and max
        newYValue = snapValueToStep(newYValue, minValueY, maxValueY, yChannelStep);
        newColor = (newColor || color).withChannelValue(channels.yChannel, newYValue);
      }
      if (newColor) {
        setColor(newColor);
      }
    },
    getThumbPosition() {
      let x = (xValue - minValueX) / (maxValueX - minValueX);
      let y = 1 - (yValue - minValueY) / (maxValueY - minValueY);
      return {x, y};
    },
    incrementX(stepSize) {
      setXValue(snapValueToStep(xValue + stepSize, minValueX, maxValueX, stepSize));
    },
    incrementY(stepSize) {
      setYValue(snapValueToStep(yValue + stepSize, minValueY, maxValueY, stepSize));
    },
    decrementX(stepSize) {
      setXValue(snapValueToStep(xValue - stepSize, minValueX, maxValueX, stepSize));
    },
    decrementY(stepSize) {
      setYValue(snapValueToStep(yValue - stepSize, minValueY, maxValueY, stepSize));
    },
    setDragging(isDragging) {
      let wasDragging = isDraggingRef;
      isDraggingRef = isDragging;

      if (onChangeEnd && !isDragging && wasDragging) {
        onChangeEnd(valueRef.current);
      }

      setDragging(isDragging);
    },
    isDragging,
    getDisplayColor() {
      return color.withChannelValue('alpha', 1);
    }
  };
}
