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

import {AriaLabelingProps, DOMProps, StyleProps} from '@react-types/shared';
import {OverlayTriggerProps, PositionProps} from '@react-types/overlays';
import {ReactElement, ReactNode} from 'react';

export interface TooltipTriggerProps {
  /**
   * Whether the tooltip should be disabled, independent from the trigger.
   */
  isDisabled?: boolean,

  /**
   * By default, opens for both focus and hover. Can be made to open only for focus.
   */
  trigger?: 'focus'
}

export interface TooltipTriggerStateProps extends OverlayTriggerProps {
  /**
   * The delay time for the tooltip to show up. [See guidelines](https://spectrum.adobe.com/page/tooltip/#Immediate-or-delayed-appearance).
   * @default 1500
   */
  delay?: number
}

export interface SpectrumTooltipTriggerProps extends TooltipTriggerProps, TooltipTriggerStateProps, PositionProps {
  children: [ReactElement, ReactElement]
}

export interface TooltipProps {
  isOpen?: boolean
}

export interface AriaTooltipProps extends TooltipProps, DOMProps, AriaLabelingProps {}

export interface SpectrumTooltipProps extends AriaTooltipProps, StyleProps {
  /**
   * The [visual style](https://spectrum.adobe.com/page/tooltip/#Semantic-variants) of the Tooltip.
   */
  variant?: 'neutral' | 'positive' | 'negative' | 'info',

  /**
   * The placement of the element with respect to its anchor element.
   * @default 'top'
   */
  placement?: 'start' | 'end' | 'right' | 'left' | 'top' | 'bottom',

  /**
   * Whether the element is rendered.
   */
  showIcon?: boolean,

  children: ReactNode
}
