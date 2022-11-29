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

import {ChangeEvent, Key, RefObject, useCallback, useRef} from 'react';
import {DOMAttributes, MoveEndEvent, MoveMoveEvent} from '@react-types/shared';
import {focusSafely} from '@react-aria/focus';
import {focusWithoutScrolling, mergeProps, useId} from '@react-aria/utils';
import {getColumnHeaderId} from './utils';
import {GridNode} from '@react-types/grid';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {TableState} from '@react-stately/table';
import {useKeyboard, useMove, usePress} from '@react-aria/interactions';
import {useLocale, useLocalizedStringFormatter} from '@react-aria/i18n';
import {TableLayout} from '@react-stately/layout';

export interface TableColumnResizeAria {
  inputProps: DOMAttributes,
  resizerProps: DOMAttributes
}

export interface AriaTableColumnResizeProps<T> {
  column: GridNode<T>,
  label: string,
  triggerRef: RefObject<HTMLDivElement>,
  isDisabled?: boolean,
  onMove: (e: MoveMoveEvent) => void,
  onMoveEnd: (e: MoveEndEvent) => void,
  onResizeStart: (key: Key) => void,
  onResize: (widths: Map<Key, number | string>) => void,
  onResizeEnd: (key: Key) => void
}

export interface TableLayoutState<T> {
  getColumnWidth: (key: Key) => number,
  getColumnMinWidth: (key: Key) => number,
  getColumnMaxWidth: (key: Key) => number,
  setResizingColumn: (key: Key | null) => void,
  resizingColumn: Key,
  onColumnResizeStart: (key: Key) => void,
  onColumnResize: (column: GridNode<T>, width: number) => void,
  onColumnResizeEnd: (key: Key) => void
}

export function useTableColumnResize<T>(props: AriaTableColumnResizeProps<T>, state: TableState<T>, layoutState: TableLayoutState<T>, ref: RefObject<HTMLInputElement>): TableColumnResizeAria {
  let {column: item, triggerRef, isDisabled} = props;
  const stateRef = useRef<TableLayoutState<T>>(null);
  stateRef.current = layoutState;
  const stringFormatter = useLocalizedStringFormatter(intlMessages);
  let id = useId();
  let min = Math.floor(stateRef.current.getColumnMinWidth(item.key));
  let max = Math.floor(stateRef.current.getColumnMaxWidth(item.key));
  if (max === Infinity) {
    max = Number.MAX_SAFE_INTEGER;
  }
  let value = Math.floor(stateRef.current.getColumnWidth(item.key));

  let {direction} = useLocale();
  let {keyboardProps} = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        // switch focus back to the column header on anything that ends edit mode
        focusSafely(triggerRef.current);
      }
    }
  });

  const columnResizeWidthRef = useRef<number>(0);
  const {moveProps} = useMove({
    onMoveStart() {
      columnResizeWidthRef.current = stateRef.current.getColumnWidth(item.key);
      stateRef.current.onColumnResizeStart(item);
      props.onResizeStart?.(item.key);
    },
    onMove(e) {
      let {deltaX, deltaY, pointerType} = e;
      if (direction === 'rtl') {
        deltaX *= -1;
      }
      if (pointerType === 'keyboard') {
        if (deltaY !== 0 && deltaX === 0) {
          deltaX = deltaY * -1;
        }
        deltaX *= 10;
      }
      // if moving up/down only, no need to resize
      if (deltaX !== 0) {
        columnResizeWidthRef.current += deltaX;
        let sizes = stateRef.current.onColumnResize(item, columnResizeWidthRef.current);
        props.onMove?.(e, columnResizeWidthRef.current);
        props.onResize?.(sizes);
      }
    },
    onMoveEnd(e) {
      let {pointerType} = e;
      columnResizeWidthRef.current = 0;
      props.onMoveEnd?.(e);
      if (pointerType === 'mouse') {
        stateRef.current.onColumnResizeEnd(item);
        props.onResizeEnd?.(item.key);
      }
    }
  });

  let ariaProps = {
    'aria-label': props.label,
    'aria-orientation': 'horizontal' as 'horizontal',
    'aria-labelledby': `${id} ${getColumnHeaderId(state, item.key)}`,
    'aria-valuetext': stringFormatter.format('columnSize', {value}),
    min,
    max,
    value
  };

  const focusInput = useCallback(() => {
    if (ref.current) {
      focusWithoutScrolling(ref.current);
    }
  }, [ref]);

  let onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let currentWidth = stateRef.current.getColumnWidth(item.key);
    let nextValue = parseFloat(e.target.value);

    if (nextValue > currentWidth) {
      nextValue = currentWidth + 10;
    } else {
      nextValue = currentWidth - 10;
    }
    stateRef.current.onColumnResize(item, nextValue);
    props.onMove({pointerType: 'virtual'} as MoveMoveEvent);
    props.onMoveEnd({pointerType: 'virtual'} as MoveEndEvent);
  };

  let {pressProps} = usePress({
    onPressStart: (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.pointerType === 'keyboard') {
        return;
      }
      if (e.pointerType === 'virtual' && layoutState.columnLayout.resizingColumn != null) {
        stateRef.current.onColumnResizeEnd(item);
        focusSafely(triggerRef.current);
        return;
      }
      focusInput();
    },
    onPress: (e) => {
      if (e.pointerType === 'touch') {
        focusInput();
      } else if (e.pointerType !== 'virtual') {
        if (triggerRef?.current) {
          focusSafely(triggerRef.current);
        }
      }
    }
  });

  return {
    resizerProps: mergeProps(
      keyboardProps,
      moveProps,
      pressProps
    ),
    inputProps: mergeProps(
      {
        id,
        onFocus: () => {
          // useMove calls onMoveStart for every keypress, but we want resize start to only be called when we start resize mode
          // call instead during focus and blur
          stateRef.current.onColumnResizeStart(item);
          props.onResizeStart?.(item.key);
          state.setKeyboardNavigationDisabled(true);
        },
        onBlur: () => {
          stateRef.current.onColumnResizeEnd(item);
          props.onResizeEnd?.(item.key);
          state.setKeyboardNavigationDisabled(false);
        },
        onChange,
        disabled: isDisabled
      },
      ariaProps
    )
  };
}
