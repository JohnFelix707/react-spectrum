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

import {CollectionChildren, DOMProps, Orientation, StyleProps, Node} from '@react-types/shared';
import {Key} from 'react';

export interface TabProps<T> extends DOMProps, StyleProps {
  item: Node<T>,
  isDisabled?: boolean,
  orientation?: Orientation
}

export interface TabsProps<T> extends DOMProps, StyleProps {
  orientation?: Orientation,
  isQuiet?: boolean,
  density?: 'compact',
  overflowMode?: 'dropdown' | 'scrolling',
  keyboardActivation?: 'automatic' | 'manual',
  children: CollectionChildren<TabProps<T>>,
  selectedItem?: Key,
  defaultSelectedItem?: Key,
  onSelectionChange?: (selectedItem: Key) => void,
  isEmphasized?: boolean,
  isDisabled?: boolean
}

export interface SpectrumTabsProps<T> extends TabsProps<T>, DOMProps, StyleProps {}
