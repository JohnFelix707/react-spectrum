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

import {AriaLabelingProps} from '@react-types/shared';
import {ContextValue, Provider, RenderProps, SlotProps, useContextProps, useRenderProps, useSlot} from './utils';
import {DropOptions, mergeProps, useClipboard, useDrop, useFocusRing, useHover, useId, VisuallyHidden} from 'react-aria';
import {FileTriggerContext} from './FileTrigger';
import {filterDOMProps} from '@react-aria/utils';
import React, {createContext, ForwardedRef, forwardRef} from 'react';
import {TextContext} from './Text';
import {useLabels} from '@react-aria/utils';

export interface DropZoneRenderProps {
  /**
   * Whether the dropzone is currently hovered with a mouse.
   * @selector [data-hovered]
   */
  isHovered: boolean,
  /**
   * Whether the dropzone is focused, either via a mouse or keyboard.
   * @selector :focus
   */
  isFocused: boolean,
  /**
   * Whether the dropzone is keyboard focused.
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean,
  /**
   * Whether the dropzone is the drop target.
   * @selector [data-drop-target]
   */
  isDropTarget: boolean
}
// note: possibly add isDisabled prop in the future
export interface DropZoneProps extends Omit<DropOptions, 'getDropOperationForPoint' | 'onInsert' | 'onRootDrop' | 'onItemDrop' | 'onReorder'>, RenderProps<DropZoneRenderProps>, SlotProps, AriaLabelingProps {}

export const DropZoneContext = createContext<ContextValue<DropZoneProps, HTMLDivElement>>(null);

function DropZone(props: DropZoneProps, ref: ForwardedRef<HTMLDivElement>) {
  [props, ref] = useContextProps(props, ref, DropZoneContext);
  let {dropProps, isDropTarget} = useDrop({...props, ref});
  let {hoverProps, isHovered} = useHover({});
  let {focusProps, isFocused, isFocusVisible} = useFocusRing();
  let [fileTriggerRef, hasFileTrigger] = useSlot(); 

  let textId = useId();
  let labelProps = useLabels({'aria-labelledby': textId});

  let {clipboardProps} = useClipboard({
    onPaste: (items) => props.onDrop?.({  
      type: 'drop',
      items,
      x: 0,
      y: 0,
      dropOperation: 'copy'
    })
  });

  let renderProps = useRenderProps({ 
    ...props,
    values: {isHovered, isFocused, isFocusVisible, isDropTarget},
    defaultClassName: 'react-aria-DropZone'
  });
  let DOMProps = filterDOMProps(props);
  delete DOMProps.id;

  // passed to the FileTrigger component
  let onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    } else if (props.onDrop) {
      props.onDrop({
        type: 'drop',
        dropOperation: 'copy',
        x: 0,
        y: 0,
        items: [...e.target.files].map((file) =>
          ({
            kind: 'file', 
            type: file.type, 
            name: file.name,
            getFile: () => Promise.resolve(file),
            getText: () => file.text()
          })
        )
      }
      );
    }
  };
  
  return (
    <Provider
      values={[
        [FileTriggerContext, {ref: fileTriggerRef, onChange: onInputChange}],
        [TextContext, {id: textId, slot: 'heading'}]
      ]}>
      <div
        {...mergeProps(dropProps, hoverProps, DOMProps, clipboardProps)} 
        {...renderProps}
        ref={ref}
        slot={props.slot}
        tabIndex={-1}
        data-hovered={isHovered || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-drop-target={isDropTarget || undefined} >
        {!hasFileTrigger &&
          <VisuallyHidden>
            <button
              {...mergeProps(focusProps, clipboardProps, labelProps)} />   
          </VisuallyHidden>}
        {renderProps.children}
      </div>
    </Provider>
  );
}

/**
 * A drop zone is an area into which an object can be dragged and dropped.
 */
const _DropZone = forwardRef(DropZone);
export {_DropZone as DropZone};
