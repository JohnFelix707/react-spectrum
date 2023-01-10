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

import {ActionButton} from '@react-spectrum/button';
import {AriaTagGroupProps, TagKeyboardDelegate, useTagGroup} from '@react-aria/tag';
import {classNames, SlotProvider, useDOMRef, useStyleProps} from '@react-spectrum/utils';
import {DOMRef, StyleProps} from '@react-types/shared';
import {FocusScope} from '@react-aria/focus';
import {ListCollection} from '@react-stately/list';
import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import styles from '@adobe/spectrum-css-temp/components/tags/vars.css';
import {Tag} from './Tag';
import {useLayoutEffect, useResizeObserver, useValueEffect} from '@react-aria/utils';
import {useLocale} from '@react-aria/i18n';
import {useProviderProps} from '@react-spectrum/provider';
import {useTagGroupState} from '@react-stately/tag';

export interface SpectrumTagGroupProps<T> extends AriaTagGroupProps<T>, StyleProps {
  /**
   * Provide one or more ActionButtons to be rendered next to the tag group.
   */
  actions?: ReactNode
}

function TagGroup<T extends object>(props: SpectrumTagGroupProps<T>, ref: DOMRef<HTMLDivElement>) {
  props = useProviderProps(props);
  let {
    allowsRemoving,
    onRemove,
    maxRows,
    children,
    actions,
    ...otherProps
  } = props;
  let domRef = useDOMRef(ref);
  let {styleProps} = useStyleProps(otherProps);
  let {direction} = useLocale();
  let [isCollapsed, setIsCollapsed] = useState(maxRows != null);
  let state = useTagGroupState(props);
  let [tagState, setTagState] = useValueEffect({visibleTagCount: state.collection.size, showCollapseButton: false});
  let keyboardDelegate = useMemo(() => (
    isCollapsed
      ? new TagKeyboardDelegate(new ListCollection([...state.collection].slice(0, tagState.visibleTagCount)), direction)
      : new TagKeyboardDelegate(new ListCollection([...state.collection]), direction)
  ), [direction, isCollapsed, state.collection, tagState.visibleTagCount]) as TagKeyboardDelegate<T>;
  let {tagGroupProps} = useTagGroup({...props, keyboardDelegate}, state, domRef);

  let updateVisibleTagCount = useCallback(() => {
    if (maxRows > 0) {
      let computeVisibleTagCount = () => {
        // Refs can be null at runtime.
        let currDomRef: HTMLDivElement | null = domRef.current;
        if (!currDomRef) {
          return;
        }

        let tags = [...currDomRef.children];
        let button = currDomRef.parentElement.querySelector('button');
        let currY = -Infinity;
        let rowCount = 0;
        let index = 0;
        let tagWidths = [];
        // Count rows and show tags until we hit the maxRows.
        for (let tag of tags) {
          let {width, y} = tag.getBoundingClientRect();

          if (y !== currY) {
            currY = y;
            rowCount++;
          }

          if (rowCount > maxRows) {
            break;
          }
          tagWidths.push(width);
          index++;
        }

        // Remove tags until there is space for the collapse button on the last row.
        let buttonWidth = button.getBoundingClientRect().width;
        let end = direction === 'ltr' ? 'right' : 'left';
        let containerEnd = currDomRef.getBoundingClientRect()[end];
        let lastTagEnd = tags[index - 1]?.getBoundingClientRect()[end];
        let availableWidth = containerEnd - lastTagEnd;
        for (let tagWidth of tagWidths.reverse()) {
          if (availableWidth >= buttonWidth || index <= 1 || index >= state.collection.size) {
            break;
          }
          availableWidth += tagWidth;
          index--;
        }
        return {visibleTagCount: index, showCollapseButton: index < state.collection.size};
      };
    
      setTagState(function *() {
        // Update to show all items.
        yield {visibleTagCount: state.collection.size, showCollapseButton: true};

        // Measure, and update to show the items until maxRows is reached.
        yield computeVisibleTagCount();
      });
    }
  }, [direction, domRef, state.collection.size, maxRows, setTagState]);

  useResizeObserver({ref: domRef, onResize: updateVisibleTagCount});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(updateVisibleTagCount, [children]);

  let visibleTags = [...state.collection];
  if (maxRows != null && isCollapsed) {
    visibleTags = visibleTags.slice(0, tagState.visibleTagCount);
  }

  let handlePressCollapse = () => {
    // Prevents button from losing focus if focusedKey got collapsed.
    state.selectionManager.setFocusedKey(null);
    setIsCollapsed(prevCollapsed => !prevCollapsed);
  };

  return (
    <FocusScope>
      <div
        {...styleProps}
        className={classNames(styles, 'spectrum-Tags-container', styleProps.className)}>
        <div
          {...tagGroupProps}
          className={classNames(styles, 'spectrum-Tags')}
          role={state.collection.size ? 'grid' : null}
          ref={domRef}>
          {visibleTags.map(item => (
            <Tag
              {...item.props}
              key={item.key}
              item={item}
              state={state}
              allowsRemoving={allowsRemoving}
              onRemove={onRemove}>
              {item.rendered}
            </Tag>
          ))}
        </div>
        {tagState.showCollapseButton &&
          <ActionButton
            isQuiet
            onPress={handlePressCollapse}
            UNSAFE_className={classNames(styles, 'spectrum-Tags-actionButton')}>
            {isCollapsed ? `Show all (${state.collection.size})` : 'Show less '}
          </ActionButton>
        }
        {actions && 
          <SlotProvider
            slots={{
              actionButton: {
                isQuiet: true
              }
            }}>
            {actions}
          </SlotProvider>
        }
      </div>
    </FocusScope>
  );
}

/** Tags allow users to categorize content. They can represent keywords or people, and are grouped to describe an item or a search request. */
const _TagGroup = React.forwardRef(TagGroup) as <T>(props: SpectrumTagGroupProps<T> & {ref?: DOMRef<HTMLDivElement>}) => ReactElement;
export {_TagGroup as TagGroup};
