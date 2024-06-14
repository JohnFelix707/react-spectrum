/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  SliderThumb,
  SliderTrack
} from 'react-aria-components';
import {SliderBase, SliderBaseProps, thumb, thumbContainer, thumbHitArea, upperTrack, filledTrack, track} from './Slider';
import {FocusableRef, RangeValue} from '@react-types/shared';
import {useRef, forwardRef, useContext} from 'react';
import {useFocusableRef} from '@react-spectrum/utils';
import {useLocale} from '@react-aria/i18n';
import {FormContext, useFormProps} from './Form';
import {pressScale} from './pressScale';

export interface RangeSliderProps extends Omit<SliderBaseProps<RangeValue<number>>, 'children'> {
  /**
   * The name of the start input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  startName?: string,
  /**
   * The name of the end input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  endName?: string
}

function RangeSlider(props: RangeSliderProps, ref: FocusableRef<HTMLDivElement>) {
  let formContext = useContext(FormContext);
  props = useFormProps(props);
  let {
    labelPosition = 'top', 
    size = 'M',
    isEmphasized,
    trackStyle = 'thin',
    thumbStyle = 'default'
  } = props; 
  let lowerThumbRef = useRef(null);
  let upperThumbRef = useRef(null);
  let inputRef = useRef(null); // TODO: need to pass inputRef to SliderThumb when we release the next version of RAC 1.3.0
  let domRef = useFocusableRef(ref, inputRef);

  let {direction} = useLocale();
  let cssDirection = direction === 'rtl' ? 'right' : 'left';

  return (
    <SliderBase
      {...props}
      value={props.value ? [props.value.start, props.value.end] : undefined}
      defaultValue={props.defaultValue ? [props.defaultValue.start, props.defaultValue.end] : [props.minValue ?? 0, props.maxValue ?? 100]}
      onChange={v => props.onChange?.({start: v[0], end: v[1]})}
      onChangeEnd={v => props.onChangeEnd?.({start: v[0], end: v[1]})}
      sliderRef={domRef}>
      <SliderTrack
        className={track({size, labelPosition, isInForm: !!formContext})}>
        {({state, isDisabled}) => (
          <>
            <div className={upperTrack({isDisabled, trackStyle})} />
            <div style={{width: `${Math.abs(state.getThumbPercent(0) - state.getThumbPercent(1)) * 100}%`, [cssDirection]: `${state.getThumbPercent(0) * 100}%`}} className={filledTrack({isDisabled, isEmphasized, trackStyle})} />
            {/* TODO: translations */}
            <SliderThumb className={thumbContainer} index={0} name={props.startName} aria-label="minimum" ref={lowerThumbRef} style={(renderProps) => pressScale(lowerThumbRef, {transform: 'translate(-50%, -50%)', zIndex: state.getThumbPercent(0) === 1 ? 1 : undefined})({...renderProps, isPressed: renderProps.isDragging})}>
              {(renderProps) => (
                <div className={thumbHitArea({size})}>
                  <div
                    className={thumb({
                      ...renderProps,
                      size,
                      thumbStyle
                    })} />
                </div>
              )}
            </SliderThumb>
            <SliderThumb  className={thumbContainer} index={1} name={props.endName} aria-label="maximum" ref={upperThumbRef} style={(renderProps) => pressScale(upperThumbRef, {transform: 'translate(-50%, -50%)'})({...renderProps, isPressed: renderProps.isDragging})}>
              {(renderProps) => (
                <div className={thumbHitArea({size})}>
                  <div
                    className={thumb({
                      ...renderProps,
                      size,
                      thumbStyle
                    })} />
                </div>
              )}
            </SliderThumb>
          </>
        )}
      </SliderTrack>
    </SliderBase>
  );
}

let _RangeSlider = /*#__PURE__*/ forwardRef(RangeSlider);
export {_RangeSlider as RangeSlider};
