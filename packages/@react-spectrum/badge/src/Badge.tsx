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

import {classNames, SlotProvider, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import React, {forwardRef} from 'react';
import {SpectrumBadgeProps} from '@react-types/badge';
import styles from '@adobe/spectrum-css-temp/components/badge/vars.css';
import {Text} from '@react-spectrum/text';
import {useProviderProps} from '@react-spectrum/provider';


function Badge(props: SpectrumBadgeProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    isDisabled,
    variant,
    ...otherProps
  } = useProviderProps(props);
  let domRef = useDOMRef(ref);
  let {styleProps} = useStyleProps(otherProps);
  let isTextOnly = React.Children.toArray(props.children).every(c => !React.isValidElement(c));

  return (
    <span
      {...filterDOMProps(otherProps)}
      {...styleProps}
      role="presentation"
      className={classNames(
        styles,
        'spectrum-Badge',
        {
          [`spectrum-Badge--${variant}`]: !isDisabled && variant,
          'is-disabled': isDisabled
        },
        styleProps.className
      )}
      ref={domRef}>
      <SlotProvider
        slots={{
          icon: {
            size: 'S',
            UNSAFE_className: classNames(styles, 'spectrum-Badge-icon')
          },
          text: {
            UNSAFE_className: classNames(styles, 'spectrum-Badge-label')
          }
        }}>

        {
          typeof children === 'string' || isTextOnly
            ? <Text>{children}</Text>
            : children
        }
      </SlotProvider>
    </span>
  );
}

/**
 * Status lights are used to color code categories and labels commonly found in data visualization.
 * When status lights have a semantic meaning, they should use semantic variant colors.
 */
let _Badge = forwardRef(Badge);
export {_Badge as Badge};
