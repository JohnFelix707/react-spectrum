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

import {Collection, Node} from '@react-types/shared';
import {Key} from 'react';

export interface GridCollection<T> extends Collection<Node<T>> {
  columnCount: number,
  rows: GridNode<T>[]
}

export interface GridRow<T> {
  key?: Key,
  type: string,
  childNodes: Iterable<Node<T>>
}

export interface GridNode<T> extends Node<T> {
  column?: GridNode<T>,
  colspan?: number
}
