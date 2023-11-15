/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import ChevronRightMedium from '@spectrum-icons/ui/ChevronRightMedium';
import {classNames} from '@react-spectrum/utils';
import {FocusRing} from '@react-aria/focus';
import intlMessages from '../intl';
import {mergeProps} from '@react-aria/utils';
import {Node} from '@react-types/shared';
import React, {useContext, useRef} from 'react';
import {StepListContext} from './StepListContext';
import styles from '@adobe/spectrum-css-temp/components/steplist/vars.css';
import {useHover} from '@react-aria/interactions';
import {useLocale, useLocalizedStringFormatter, useNumberFormatter} from '@react-aria/i18n';
import {useStepListItem} from '@react-aria/steplist';
import {VisuallyHidden} from '@react-aria/visually-hidden';

interface SpectrumStepListItemProps<T> {
  item: Node<T>,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isReadOnly?: boolean
}

export function StepListItem<T>(props: SpectrumStepListItemProps<T>) {
  let {
    isDisabled,
    item
  } = props;
  let {key} = item;

  let ref = useRef();
  let {direction} = useLocale();
  let state = useContext(StepListContext);
  const isSelected = state.selectedKey === key;
  const isCompleted = state.isCompleted(key);
  const isItemDisabled = isDisabled || state.disabledKeys.has(key);
  let {stepProps, stepStateProps} = useStepListItem({...props, key}, state, ref);

  let {hoverProps, isHovered} = useHover({...props, isDisabled: isItemDisabled || isSelected || props.isReadOnly});


  let stepStateText = '';
  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  const numberFormatter = useNumberFormatter();

  if (isSelected) {
    stepStateText = stringFormatter.format('current');
  } else if (isCompleted) {
    stepStateText = stringFormatter.format('completed');
  } else {
    stepStateText = stringFormatter.format('notCompleted');
  }

  return (
    <li
      className={
        classNames(
          styles,
          'spectrum-Steplist-item'
        )
      }>
      <FocusRing within focusRingClass={classNames(styles, 'focus-ring')}>
        <a
          aria-labelledby={`step-marker-${key} step-label-${key}`}
          ref={ref}
          {...mergeProps(hoverProps, stepProps)}
          className={classNames(
            styles,
            'spectrum-Steplist-link',
            {
              'is-selected': isSelected && !isItemDisabled,
              'is-disabled': isItemDisabled,
              'is-hovered': isHovered,
              'is-completed': isCompleted,
              'is-selectable': state.isSelectable(key) && !isSelected
            }
          )}>
          <VisuallyHidden {...stepStateProps}>{stepStateText}</VisuallyHidden>
          <span id={`step-label-${key}`} aria-hidden="true" className={classNames(styles, 'spectrum-Steplist-label')}>
            {item.rendered}
          </span>
          <div
            className={classNames(
              styles,
              'spectrum-Steplist-segment', {
                'is-completed': isCompleted
              })} >
            <svg className={classNames(styles, 'spectrum-Steplist-segmentLine')} xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 2 8" preserveAspectRatio="none">
              <line x1="1" y1="0" x2="1" y2="8" vectorEffect="non-scaling-stroke" />
            </svg>
            <ChevronRightMedium
              UNSAFE_className={classNames(styles, 'spectrum-Steplist-chevron', {
                'is-reversed': direction === 'rtl'
              })} />
          </div>
          <span id={`step-marker-${key}`} aria-hidden="true" className={classNames(styles, 'spectrum-Steplist-marker')}>{numberFormatter.format((item.index || 0) + 1)}</span>
        </a>
      </FocusRing>
    </li>
  );
}
