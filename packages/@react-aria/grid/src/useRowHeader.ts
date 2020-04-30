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

import {getCellId} from './utils';
import {GridState} from '@react-stately/grid';
import {HTMLAttributes, Key, RefObject} from 'react';
import {useGridCell} from './useGridCell';

interface RowHeaderProps {
  ref: RefObject<HTMLElement>,
  key: Key,
  isVirtualized?: boolean
}

interface RowHeaderAria {
  rowHeaderProps: HTMLAttributes<HTMLElement>
}

export function useRowHeader<T>(props: RowHeaderProps, state: GridState<T>): RowHeaderAria {
  let {gridCellProps} = useGridCell(props, state);

  let item = state.collection.getItem(props.key);
  let columnKey = state.collection.columns[item.index].key;
  return {
    rowHeaderProps: {
      ...gridCellProps,
      role: 'rowheader',
      id: getCellId(state, item.parentKey, columnKey)
    }
  };
}
