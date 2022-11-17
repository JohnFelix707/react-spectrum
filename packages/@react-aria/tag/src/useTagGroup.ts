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

import {DOMAttributes, DOMProps} from '@react-types/shared';
import {filterDOMProps, mergeProps} from '@react-aria/utils';
import {ReactNode, useState} from 'react';
import {useFocusWithin} from '@react-aria/interactions';

export interface AriaTagGroupProps extends DOMProps {
  children: ReactNode,
  isReadOnly?: boolean, // removes close button
  validationState?: 'valid' | 'invalid'
}

export interface TagGroupAria {
  tagGroupProps: DOMAttributes
}

export function useTagGroup(props: AriaTagGroupProps): TagGroupAria {
  let [isFocusWithin, setFocusWithin] = useState(false);
  let {focusWithinProps} = useFocusWithin({
    onFocusWithinChange: setFocusWithin
  });
  let domProps = filterDOMProps(props);
  return {
    tagGroupProps: mergeProps(domProps, {
      'aria-atomic': false,
      'aria-relevant': 'additions',
      'aria-live': isFocusWithin ? 'polite' : 'off',
      ...focusWithinProps
    } as DOMAttributes)
  };
}
