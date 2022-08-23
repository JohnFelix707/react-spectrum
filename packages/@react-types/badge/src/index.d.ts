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
import {ReactNode} from 'react';

interface SpectrumBadgeProps extends DOMProps, StyleProps, AriaLabelingProps {
  /** The content to display as the label. */
  children: ReactNode,
  /** Whether the badge is disabled. */
  isDisabled?: boolean,
  /**
   * The variant changes the background color of the badge.
   * When badge has a semantic meaning, they should use the variant for semantic colors.
   */
  variant: 'neutral' | 'info' | 'positive' | 'negative' | 'indigo' | 'yellow' | 'magenta' | 'fuchsia' | 'purple' | 'seafoam'
}
