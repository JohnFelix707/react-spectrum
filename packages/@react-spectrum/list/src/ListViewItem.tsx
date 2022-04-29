/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import {Checkbox} from '@react-spectrum/checkbox';
import ChevronLeftMedium from '@spectrum-icons/ui/ChevronLeftMedium';
import ChevronRightMedium from '@spectrum-icons/ui/ChevronRightMedium';
import {classNames, ClearSlots, SlotProvider} from '@react-spectrum/utils';
import {Content} from '@react-spectrum/view';
import type {DraggableItemResult} from '@react-aria/dnd';
import {FocusRing, useFocusRing} from '@react-aria/focus';
import {Grid} from '@react-spectrum/layout';
import ListGripper from '@spectrum-icons/ui/ListGripper';
import listStyles from './listview.css';
import {ListViewContext} from './ListView';
import {mergeProps} from '@react-aria/utils';
import React, {useContext, useRef} from 'react';
import {useButton} from '@react-aria/button';
import {useGridCell, useGridSelectionCheckbox} from '@react-aria/grid';
import {useHover, usePress} from '@react-aria/interactions';
import {useLocale} from '@react-aria/i18n';
import {useVisuallyHidden} from '@react-aria/visually-hidden';

export function ListViewItem(props) {
  let {
    item,
    isEmphasized,
    dragHooks,
    hasActions
  } = props;
  let {state, dragState, isListDraggable, layout} = useContext(ListViewContext);
  let {direction} = useLocale();
  let rowRef = useRef<HTMLDivElement>();
  let {
    isFocusVisible: isFocusVisibleWithin,
    focusProps: focusWithinProps
  } = useFocusRing({within: true});
  let {isFocusVisible, focusProps} = useFocusRing();
  let allowsInteraction = state.selectionManager.selectionMode !== 'none' || hasActions;
  let isDisabled = !allowsInteraction || state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);
  let isDraggable = dragState?.isDraggable(item.key) && !isDisabled;
  let {hoverProps, isHovered} = useHover({isDisabled});
  let {pressProps, isPressed} = usePress({isDisabled});


  // TODO: Make useListItem hook that returns row and cell props. It will contain stuff ripped out of useGridCell
  // Will need to keep a isVirtualized option but no need for focusMode. Keep drag stuff out of it for now.
  // Don't need the usePress and useHover stuff since that is for visual styles
  // Will need to bring in the rowProps from below and the inline applied grid cell props for the hook to return

  // We only make use of useGridCell here to allow for keyboard navigation to the focusable children of the row.
  // The actual grid cell of the ListView is intert since we don't want to ever focus it to decrease screenreader
  // verbosity, so we pretend the row node is the cell for interaction purposes. useGridRow is never used since
  // it would conflict with useGridCell if applied to the same node.
  let {gridCellProps: rowProps} = useGridCell({
    node: item,
    focusMode: 'cell',
    isVirtualized: true,
    shouldSelectOnPressUp: isListDraggable
  }, state, rowRef);
  delete rowProps['aria-colindex'];

  rowProps = {
    ...rowProps,
    role: 'row',
    'aria-label': item.textValue,
    'aria-selected': state.selectionManager.selectionMode !== 'none' ? isSelected : undefined,
    'aria-rowindex': item.index + 1
  };

  let gridCellProps = {
    role: 'gridcell',
    'aria-colindex': 1
  };


  // TODO make a useListItemCheckbox hook to mirror table checkbox hook. Will need to access the id of the row for aria-labelledby
  let {checkboxProps} = useGridSelectionCheckbox({...props, key: item.key}, state);






  let draggableItem: DraggableItemResult;
  if (isListDraggable) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    draggableItem = dragHooks.useDraggableItem({key: item.key}, dragState);
  }

  let dragButtonRef = React.useRef();
  let {buttonProps} = useButton({
    ...draggableItem?.dragButtonProps,
    elementType: 'div'
  }, dragButtonRef);

  let chevron = null;
  if (item.props.hasChildItems) {
    chevron = direction === 'ltr'
      ? (
        <ChevronRightMedium
          aria-hidden="true"
          UNSAFE_className={listStyles['react-spectrum-ListViewItem-parentIndicator']} />
      )
      : (
        <ChevronLeftMedium
          aria-hidden="true"
          UNSAFE_className={listStyles['react-spectrum-ListViewItem-parentIndicator']} />
      );
  }

  let showCheckbox = state.selectionManager.selectionMode !== 'none' && state.selectionManager.selectionBehavior === 'toggle';
  let showDragHandle = isDraggable && isFocusVisibleWithin;
  let {visuallyHiddenProps} = useVisuallyHidden();

  const mergedProps = mergeProps(
    rowProps,
    pressProps,
    isDraggable && draggableItem?.dragProps,
    hoverProps,
    focusWithinProps,
    focusProps
  );

  let isFirstRow = item.prevKey == null;
  let isLastRow = item.nextKey == null;
  // Figure out if the ListView content is equal or greater in height to the container. If so, we'll need to round the bottom
  // border corners of the last row when selected and we can get rid of the bottom border if it isn't selected to avoid border overlap
  // with bottom border
  let isFlushWithContainerBottom = false;
  if (isLastRow) {
    if (layout.getContentSize()?.height >= layout.virtualizer?.getVisibleRect().height) {
      isFlushWithContainerBottom = true;
    }
  }

  return (
    <div
      {...mergedProps}
      className={
        classNames(
          listStyles,
          'react-spectrum-ListView-row',
          {
            'focus-ring': isFocusVisible
          }
        )
      }
      ref={rowRef}>
      <div
        // TODO: refactor the css here now that we are focusing the row?
        className={
          classNames(
            listStyles,
            'react-spectrum-ListViewItem',
            {
              'is-active': isPressed,
              'is-focused': isFocusVisibleWithin,
              'focus-ring': isFocusVisible,
              'is-hovered': isHovered,
              'is-selected': isSelected,
              'is-next-selected': state.selectionManager.isSelected(item.nextKey),
              'react-spectrum-ListViewItem--highlightSelection': state.selectionManager.selectionBehavior === 'replace' && (isSelected || state.selectionManager.isSelected(item.nextKey)),
              'react-spectrum-ListViewItem--draggable': isDraggable,
              'react-spectrum-ListViewItem--firstRow': isFirstRow,
              'react-spectrum-ListViewItem--lastRow': isLastRow,
              'react-spectrum-ListViewItem--isFlushBottom': isFlushWithContainerBottom
            }
          )
        }
        {...gridCellProps}>
        <Grid UNSAFE_className={listStyles['react-spectrum-ListViewItem-grid']}>
          {isListDraggable &&
            <div className={listStyles['react-spectrum-ListViewItem-draghandle-container']}>
              {isDraggable &&
                <FocusRing focusRingClass={classNames(listStyles, 'focus-ring')}>
                  <div
                    {...buttonProps as React.HTMLAttributes<HTMLElement>}
                    className={
                      classNames(
                        listStyles,
                        'react-spectrum-ListViewItem-draghandle-button'
                      )
                    }
                    style={!showDragHandle ? {...visuallyHiddenProps.style} : {}}
                    ref={dragButtonRef}
                    draggable="true">
                    <ListGripper />
                  </div>
                </FocusRing>
              }
            </div>
          }
          {showCheckbox &&
            <Checkbox
              UNSAFE_className={listStyles['react-spectrum-ListViewItem-checkbox']}
              {...checkboxProps}
              isEmphasized={isEmphasized} />
          }
          <SlotProvider
            slots={{
              content: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-content']},
              text: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-content']},
              description: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-description']},
              icon: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-icon'], size: 'M'},
              image: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-image']},
              link: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-content'], isQuiet: true},
              actionButton: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-actions'], isQuiet: true},
              actionGroup: {
                UNSAFE_className: listStyles['react-spectrum-ListViewItem-actions'],
                isQuiet: true,
                density: 'compact'
              },
              actionMenu: {UNSAFE_className: listStyles['react-spectrum-ListViewItem-actionmenu'], isQuiet: true}
            }}>
            {typeof item.rendered === 'string' ? <Content>{item.rendered}</Content> : item.rendered}
            <ClearSlots>
              {chevron}
            </ClearSlots>
          </SlotProvider>
        </Grid>
      </div>
    </div>
  );
}
