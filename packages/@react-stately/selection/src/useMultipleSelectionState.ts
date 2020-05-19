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

import {MultipleSelection, SelectionMode} from '@react-types/shared';
import {MultipleSelectionState} from './types';
import {Selection} from './Selection';
import {useControlledState} from '@react-stately/utils';
import {useMemo, useRef, useState} from 'react';

/**
 * Manages state for multiple selection and focus in a collection.
 */
export function useMultipleSelectionState(props: MultipleSelection): MultipleSelectionState {
  let {
    selectionMode = 'multiple' as SelectionMode,
    disallowEmptySelection
  } = props;

  // We want synchronous updates to `isFocused` and `focusedKey` after their setters are called.
  // But we also need to trigger a react re-render. So, we have both a ref (sync) and state (async).
  let isFocusedRef = useRef(false);
  let [, setFocused] = useState(false);
  let focusedKeyRef = useRef(null);
  let [, setFocusedKey] = useState(null);
  let selectedKeysProp = useMemo(() => props.selectedKeys ? new Selection(props.selectedKeys) : undefined, [props.selectedKeys]);
  let defaultSelectedKeys = useMemo(() => props.defaultSelectedKeys ? new Selection(props.defaultSelectedKeys) : new Selection(), [props.defaultSelectedKeys]);
  let [selectedKeys, setSelectedKeys] = useControlledState(
    selectedKeysProp,
    defaultSelectedKeys,
    props.onSelectionChange
  );

  return {
    selectionMode,
    disallowEmptySelection,
    get isFocused() {
      return isFocusedRef.current;
    },
    setFocused(f) {
      isFocusedRef.current = f;
      setFocused(f);
    },
    get focusedKey() {
      return focusedKeyRef.current;
    },
    setFocusedKey(k) {
      focusedKeyRef.current = k;
      setFocusedKey(k);
    },
    selectedKeys,
    setSelectedKeys
  };
}
