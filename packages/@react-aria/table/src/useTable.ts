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

import {announce} from '@react-aria/live-announcer';
import {GridAria, GridProps, useGrid} from '@react-aria/grid';
import {gridIds} from './utils';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {Key, RefObject, useMemo} from 'react';
import {Layout} from '@react-stately/virtualizer';
import {mergeDescriptions, mergeProps, useDescription, useId, useUpdateEffect} from '@react-aria/utils';
import {Node} from '@react-types/shared';
import {TableKeyboardDelegate} from './TableKeyboardDelegate';
import {TableState} from '@react-stately/table';
import {useCollator, useLocale} from '@react-aria/i18n';
import {useInteractionModality} from '@react-aria/interactions';
import {useMessageFormatter} from '@react-aria/i18n';

interface TableProps<T> extends GridProps {
  /** The layout object for the table. Computes what content is visible and how to position and style them. */
  layout?: Layout<Node<T>>,
  /** Handler that is called when a user performs an action on a row. */
  onAction?: (key: Key) => void
}

/**
 * Provides the behavior and accessibility implementation for a table component.
 * A table displays data in rows and columns and enables a user to navigate its contents via directional navigation keys,
 * and optionally supports row selection and sorting.
 * @param props - Props for the table.
 * @param state - State for the table, as returned by `useTableState`.
 * @param ref - The ref attached to the table element.
 */
export function useTable<T>(props: TableProps<T>, state: TableState<T>, ref: RefObject<HTMLElement>): GridAria {
  let {
    keyboardDelegate,
    isVirtualized,
    layout
  } = props;

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  // When virtualized, the layout object will be passed in as a prop and override this.
  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let {direction} = useLocale();
  let delegate = useMemo(() => keyboardDelegate || new TableKeyboardDelegate({
    collection: state.collection,
    disabledKeys: state.disabledKeys,
    ref,
    direction,
    collator,
    layout
  }), [keyboardDelegate, state.collection, state.disabledKeys, ref, direction, collator, layout]);

  let id = useId();
  gridIds.set(state, id);

  let {gridProps} = useGrid({
    ...props,
    id,
    keyboardDelegate: delegate,
    getRowText(key): string {
      let added = state.collection.getItem(key);
      if (!added) {
        return '';
      }

      // If the row has a textValue, use that.
      if (added.textValue != null) {
        return added.textValue;
      }

      // Otherwise combine the text of each of the row header columns.
      let rowHeaderColumnKeys = state.collection.rowHeaderColumnKeys;
      if (rowHeaderColumnKeys) {
        let text = [];
        for (let cell of added.childNodes) {
          let column = state.collection.columns[cell.index];
          if (rowHeaderColumnKeys.has(column.key) && cell.textValue) {
            text.push(cell.textValue);
          }

          if (text.length === rowHeaderColumnKeys.size) {
            break;
          }
        }

        return text.join(' ');
      }

      return '';
    }
  }, state, ref);

  // Override to include header rows
  if (isVirtualized) {
    gridProps['aria-rowcount'] = state.collection.size + state.collection.headerRows.length;
  }

  let {column, direction: sortDirection} = state.sortDescriptor || {};
  let formatMessage = useMessageFormatter(intlMessages);
  let sortDescription = useMemo(() => {
    let columnName = state.collection.columns.find(c => c.key === column)?.textValue;
    return sortDirection && column ? formatMessage(`${sortDirection}Sort`, {columnName}) : undefined;
  }, [sortDirection, column, state.collection.columns]);


  // do we have something that might be better suited for this? issue is that useInteractionModality
  // doesn't return quite enough information
  // if is on touch start is in the window put the message?
  // grab from dnd?
  // navigator touch points?
  let modality = useInteractionModality();
  let shouldLongPress = (modality === 'pointer' || modality === 'virtual') && 'ontouchstart' in window;

  let interactionDescription = useMemo(() => {
    let selectionMode = state.selectionManager.selectionMode;
    let selectionBehavior = state.selectionManager.selectionBehavior;
    // if we're in replace but can select multiple, then when using touch it's long press to enter selection mode
    // if we can't tell what mode we're in, then we're probably in voice over, in which case we need the description to be set
    // before the user interacts so they know they can enter selection mode before they actually have to interact
    let message = undefined;
    if (shouldLongPress) {
      message = formatMessage('longPressToSelect');
    }
    return selectionBehavior === 'replace' && selectionMode !== 'none' && props.onAction ? message : undefined;
  }, [state.selectionManager.selectionMode, state.selectionManager.selectionBehavior, formatMessage, shouldLongPress]);

  let sortDescriptionProps = useDescription(sortDescription);
  let longPressDescriptionProps = useDescription(interactionDescription);
  // todo: should mergeprops append describedby's?
  let descriptionProps = mergeDescriptions(sortDescriptionProps, longPressDescriptionProps);

  // Only announce after initial render, tabbing to the table will tell you the initial sort info already
  useUpdateEffect(() => {
    announce(sortDescription, 'assertive', 500);
  }, [sortDescription]);

  return {
    gridProps: mergeProps(gridProps, descriptionProps)
  };
}
