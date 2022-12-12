/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ColumnSize} from '@react-types/table';
import {GridNode} from '@react-types/grid';
import {Key, useCallback, useMemo, useState} from 'react';
import {TableColumnLayout} from '@react-stately/layout';
import {TableState} from './useTableState';

export interface TableColumnResizeStateProps<T> {
  /**
   * Current width of the table or table viewport that the columns
   * should be calculated against.
   **/
  tableWidth: number,
  /** A function that is called to find the default width for a given column. */
  getDefaultWidth: (node: GridNode<T>) => ColumnSize,
  /** A function that is called to find the default minWidth for a given column. */
  getDefaultMinWidth: (node: GridNode<T>) => ColumnSize,
  /** Callback that is invoked during the entirety of the resize event. */
  onColumnResize?: (widths: Map<Key, ColumnSize>) => void,
  /** Callback that is invoked when the resize event is started. */
  onColumnResizeStart?: (key: Key) => void,
  /** Callback that is invoked when the resize event is ended. */
  onColumnResizeEnd?: (key: Key) => void
}
export interface TableColumnResizeState {
  /** Trigger a resize and recalculation. */
  onColumnResize: (key: Key, width: number) => void,
  /** Callback for when onColumnResize has started. */
  onColumnResizeStart: (key: Key) => void,
  /** Callback for when onColumnResize has ended. */
  onColumnResizeEnd: (key: Key) => void,
  /** Gets the current width for the specified column. */
  getColumnWidth: (key: Key) => number,
  /** Gets the current minWidth for the specified column. */
  getColumnMinWidth: (key: Key) => number,
  /** Gets the current maxWidth for the specified column. */
  getColumnMaxWidth: (key: Key) => number,
  /** Currently calculated widths for all columns. */
  widths: Map<Key, number>
}


export function useTableColumnResizeState<T>(props: TableColumnResizeStateProps<T>, state: TableState<T>): TableColumnResizeState {
  let {
    getDefaultWidth,
    getDefaultMinWidth,
    onColumnResizeStart: propsOnColumnResizeStart,
    onColumnResizeEnd: propsOnColumnResizeEnd
  } = props;

  let columnLayout = useMemo(
    () => new TableColumnLayout({
      getDefaultWidth,
      getDefaultMinWidth
    }),
    [getDefaultWidth, getDefaultMinWidth]
  );

  let tableWidth = props.tableWidth ?? 0;
  let [controlledColumns, uncontrolledColumns] = useMemo(() =>
      columnLayout.splitColumnsIntoControlledAndUncontrolled(state.collection.columns)
  , [state.collection.columns, columnLayout]);

  // uncontrolled column widths
  let [uncontrolledWidths, setUncontrolledWidths] = useState(() =>
    columnLayout.getInitialUncontrolledWidths(uncontrolledColumns)
  );
  // combine columns back into one map that maintains same order as the columns
  let cWidths = useMemo(() =>
      columnLayout.recombineColumns(state.collection.columns, uncontrolledWidths, uncontrolledColumns, controlledColumns)
  , [state.collection.columns, uncontrolledWidths, uncontrolledColumns, controlledColumns, columnLayout]);

  let onColumnResizeStart = useCallback((key: Key) => {
    columnLayout.setResizingColumn(key);
    propsOnColumnResizeStart?.(key);
  }, [columnLayout, propsOnColumnResizeStart]);

  let onColumnResize = useCallback((key: Key, width: number): Map<Key, ColumnSize> => {
    let newControlled = new Map(Array.from(controlledColumns).map(([key, entry]) => [key, entry.props.width]));
    let newSizes = columnLayout.resizeColumnWidth(tableWidth, state.collection, newControlled, uncontrolledWidths, key, width);

    let map = new Map(Array.from(uncontrolledColumns).map(([key]) => [key, newSizes.get(key)]));
    map.set(key, width);
    setUncontrolledWidths(map);

    return newSizes;
  }, [controlledColumns, uncontrolledColumns, setUncontrolledWidths, tableWidth, columnLayout, state.collection, uncontrolledWidths]);

  let onColumnResizeEnd = useCallback((key: Key) => {
    columnLayout.setResizingColumn(null);
    propsOnColumnResizeEnd?.(key);
  }, [columnLayout, propsOnColumnResizeEnd]);

  let getColumnWidth = useCallback((key: Key) =>
    columnLayout.getColumnWidth(key)
  , [columnLayout]);

  let getColumnMinWidth = useCallback((key: Key) =>
    columnLayout.getColumnMinWidth(key)
  , [columnLayout]);

  let getColumnMaxWidth = useCallback((key: Key) =>
    columnLayout.getColumnMaxWidth(key)
  , [columnLayout]);

  let columnWidths = useMemo(() =>
      columnLayout.buildColumnWidths(tableWidth, state.collection, cWidths)
  , [tableWidth, state.collection, cWidths, columnLayout]);

  return useMemo(() => ({
    resizingColumn: columnLayout.resizingColumn,
    onColumnResize,
    onColumnResizeStart,
    onColumnResizeEnd,
    getColumnWidth,
    getColumnMinWidth,
    getColumnMaxWidth,
    widths: columnWidths
  }), [
    columnLayout.resizingColumn,
    onColumnResize,
    onColumnResizeStart,
    onColumnResizeEnd,
    getColumnWidth,
    getColumnMinWidth,
    getColumnMaxWidth,
    columnWidths
  ]);
}
