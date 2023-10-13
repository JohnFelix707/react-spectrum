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

import {classNames, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef} from '@react-types/shared';
import React, {RefObject} from 'react';
import {SpectrumStepListProps} from '@react-types/steplist';
import {StepListContext} from './StepListContext';
import {StepListItem} from './StepListItem';
import styles from '@adobe/spectrum-css-temp/components/steplist/vars.css';
import {useProviderProps} from '@react-spectrum/provider';
import {useStepList} from '@react-aria/steplist';
import {useStepListState} from '@react-stately/steplist';

function StepList<T extends object>(props: SpectrumStepListProps<T>, ref: DOMRef) {
  const {size = 'M', orientation} = props;
  props = useProviderProps(props);
  let {styleProps} = useStyleProps(props);
  let domRef = useDOMRef(ref) as RefObject<HTMLOListElement>;

  let state = useStepListState(props);
  let {listProps} = useStepList(props, state, domRef);

  const {isDisabled, isEmphasized, isReadOnly} = props;
  const stepListItems = [...state.collection].map((item) => (
    <li
      key={item.key}
      className={
        classNames(
          styles,
          'spectrum-Steplist-item'
        )
      }>
      <StepListItem
        key={item.key}
        isDisabled={isDisabled}
        isEmphasized={isEmphasized}
        isReadOnly={isReadOnly}
        item={item} />
    </li>)
  );
  return (
    <ol
      {...listProps}
      {...styleProps}
      ref={domRef}
      className={classNames(styles, 'spectrum-Steplist', styleProps.className, {
        'spectrum-Steplist--interactive': !isReadOnly,
        'spectrum-Steplist--small': size === 'S',
        'spectrum-Steplist--medium': size === 'M',
        'spectrum-Steplist--large': size === 'L',
        'spectrum-Steplist--xlarge': size === 'XL',
        'spectrum-Steplist--vertical': orientation === 'vertical'
      })}>
      <StepListContext.Provider value={state}>
        {stepListItems}
      </StepListContext.Provider>
    </ol>
  );
}

const _StepList = React.forwardRef(StepList);
export {_StepList as StepList};
