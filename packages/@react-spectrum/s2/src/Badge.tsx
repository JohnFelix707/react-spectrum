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

import {AriaLabelingProps, DOMProps, DOMRef} from '@react-types/shared';
import {centerBaseline} from './CenterBaseline';
import {centerPadding, getAllowedOverrides, StyleProps} from './style-utils' with {type: 'macro'};
import {filterDOMProps} from '@react-aria/utils';
import {fontRelative, style} from '../style/spectrum-theme' with {type: 'macro'};
import {IconContext} from './Icon';
import {Provider} from 'react-aria-components';
import React, {forwardRef, ReactNode} from 'react';
import {Text, TextContext} from './Content';
import {useDOMRef} from '@react-spectrum/utils';

export interface BadgeStyleProps {
  /**
   * The size of the badge.
   * 
   * @default 'S'
   */
  size?: 'S' | 'M' | 'L' | 'XL',
  /**
   * The variant changes the background color of the badge. When badge has a semantic meaning, they should use the variant for semantic colors.
   * 
   * @default 'neutral'
   */
  variant: 'accent' | 'informative' | 'neutral' | 'positive' | 'notice' | 'negative' | 'gray' | 'red' | 'orange' | 'yellow' | 'charteuse' | 'celery' | 'green' | 'seafoam' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'fuchsia' | 'magenta' | 'pink' | 'turquoise' | 'brown' | 'cinnamon' | 'silver'
}

export interface BadgeProps extends DOMProps, AriaLabelingProps, StyleProps, BadgeStyleProps{
  /**
   * The content to display in the badge.
   */
  children: ReactNode
}

const badge = style<BadgeStyleProps>({
  display: 'flex',
  font: 'control',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'control',
  minHeight: 'control',
  paddingX: {
    default: 'edge-to-text',
    ':has([slot=icon]:only-child)': 0
  },
  '--labelPadding': {
    type: 'paddingTop',
    value: centerPadding()
  },
  aspectRatio: {
    ':has([slot=icon]:only-child)': 'square'
  },
  '--iconMargin': {
    type: 'marginTop',
    value: {
      default: fontRelative(-2),
      ':has([slot=icon]:only-child)': 0
    }
  },
  columnGap: 'text-to-visual',
  color: {
    default: 'white',
    variant: {
      notice: 'black',
      orange: 'black',
      yellow: 'black',
      charteuse: 'black',
      celery: 'black'
    }
  },
  backgroundColor: {
    variant: {
      accent: 'accent',
      informative: 'informative',
      neutral: 'neutral-subdued',
      positive: 'positive',
      notice: 'notice',
      negative: 'negative',
      gray: 'gray',
      red: 'red',
      orange: 'orange',
      yellow: 'yellow',
      charteuse: 'chartreuse',
      celery: 'celery',
      green: 'green',
      seafoam: 'seafoam',
      cyan: 'cyan',
      blue: 'blue',
      indigo: 'indigo',
      purple: 'purple',
      fuchsia: 'fuchsia',
      magenta: 'magenta',
      pink: 'pink',
      turquoise: 'turquoise',
      brown: 'brown',
      cinnamon: 'cinnamon',
      silver: 'silver'
    }
  },
  '--iconPrimary': {
    type: 'fill',
    value: 'currentColor'
  }
}, getAllowedOverrides());

function Badge(props: BadgeProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    variant = 'neutral',
    size = 'S',
    ...otherProps
  } = props; // useProviderProps(props) in v3
  let domRef = useDOMRef(ref);
  let isTextOnly = React.Children.toArray(props.children).every(c => !React.isValidElement(c));

  return (
    <Provider
      values={[
        [TextContext, {className: style({paddingY: '--labelPadding', order: 1})}],
        [IconContext, {
          render: centerBaseline({slot: 'icon', className: style({order: 0})}),
          styles: style({size: fontRelative(20), marginStart: '--iconMargin', flexShrink: 0})
        }]
      ]}>
      <span
        {...filterDOMProps(otherProps)}
        role="presentation"
        className={(props.UNSAFE_className || '') + badge({variant, size}, props.styles)}
        ref={domRef}>
        {
          typeof children === 'string' || isTextOnly
            ? <Text>{children}</Text>
            : children
        }
      </span>
    </Provider>
  );
}

/**
 * Badges are used for showing a small amount of color-categorized metadata, ideal for getting a user's attention.
 */
let _Badge = forwardRef(Badge);
export {_Badge as Badge};
