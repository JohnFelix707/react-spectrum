/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Expandable} from '@react-types/shared';
import {TableCollection as ITableCollection} from '@react-types/table';
import {Key, useCallback, useMemo} from 'react';
import {MultipleSelectionStateProps} from '@react-stately/selection';
import {TableStateProps} from './useTableState';
import {TreeGridCollection} from './TreeGridCollection';
import {useCollection} from '@react-stately/collections';
import {useControlledState} from '@react-stately/utils';

export interface TreeGridState<T> {
  // TODO: I believe treeble collection will essentially mirror TableCollection, just with different structure and internals
  /** A collection of rows and columns in the table. */
  collection: ITableCollection<T>,
  /** A set of keys for items that are expanded. */
  expandedKeys: 'all' | Set<Key>,
  /** Toggles the expanded state for a row by its key. */
  toggleKey(key: Key): void
}
// TODO what to accept? needs the context stuff and expanded keys + onexpandedchange. I've also pared down the props to the minimum required
export interface TreeGridStateProps<T> extends Expandable, Pick<MultipleSelectionStateProps, 'selectionMode'>, Pick<TableStateProps<T>, 'showSelectionCheckboxes' | 'showDragButtons' | 'children' | 'collection'> {
}

// TODO: add description. Right now this is meant to be run in tandem with useTableState but maybe we could make it more standalone for
// aria?
export function useTreeGridState<T extends object>(props: TreeGridStateProps<T>): TreeGridState<T> {
  let [expandedKeys, setExpandedKeys] = useControlledState(
    props.expandedKeys ? convertExpanded(props.expandedKeys) : undefined,
    props.defaultExpandedKeys ? convertExpanded(props.defaultExpandedKeys) : new Set(),
    props.onExpandedChange
  );
  let {selectionMode = 'none', showSelectionCheckboxes, showDragButtons} = props;

  // TODO: add expandedKeys to context here? Don't really need it since the collection components don't need expandedKeys
  // info in the context I think.
  let context = useMemo(() => ({
    showSelectionCheckboxes: showSelectionCheckboxes && selectionMode !== 'none',
    showDragButtons: showDragButtons,
    selectionMode,
    columns: []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [props.children, showSelectionCheckboxes, selectionMode, showDragButtons]);

  // TODO: since we are providing a collection to useTableState, TreeGridCollection will have to do everything TableCollection + GridCollection does since
  // useTableState's useCollection call will just use the collection directly and not call the builder + factory. This means we will need to rebuild
  // the collection if expandedKeys changes or if the context changes (context copied from useTableState)
  let collection = useCollection<T, ITableCollection<T>>(
    props,
    useCallback((nodes) => new TreeGridCollection(nodes, {...context, expandedKeys}), [context, expandedKeys]),
    context
  );

  // TODO: support 'all'? Will we have a interaction to expand all
  // TODO: memo
  let onToggle = (key: Key) => {
    setExpandedKeys(toggleKey(expandedKeys, key, collection));
  };

  // Note: this state should be merged with the state returned from useTableState
  return {
    collection,
    expandedKeys,
    toggleKey: onToggle
  };
}

// TODO: copied from useTreeState, perhaps make this accept multiple keys?
function toggleKey<T>(currentExpandedKeys: 'all' | Set<Key>, key: Key, collection: ITableCollection<T>): Set<Key> {
  let updatedExpandedKeys: Set<Key>;
  if (currentExpandedKeys === 'all') {
    updatedExpandedKeys = new Set(collection.rows.filter(row => row.props.hasChildItems || row.props.children.length > collection.columnCount).map(row => row.key));
    updatedExpandedKeys.delete(key);
  } else {
    updatedExpandedKeys = new Set(currentExpandedKeys);
    if (updatedExpandedKeys.has(key)) {
      updatedExpandedKeys.delete(key);
    } else {
      updatedExpandedKeys.add(key);
    }
  }

  return updatedExpandedKeys;
}

// TODO: based off convertedSelected
function convertExpanded(expanded: 'all' | Iterable<Key>): 'all' | Set<Key> {
  if (!expanded) {
    return new Set<Key>();
  }

  return expanded === 'all'
    ? 'all'
    : new Set(expanded);
}
