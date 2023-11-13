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

import {action} from '@storybook/addon-actions';
import {AriaMenuProps, UNSTABLE_useSubmenuTrigger, useMenu, useMenuItem, useMenuSection, useMenuTrigger} from '@react-aria/menu';
import {AriaPopoverProps, DismissButton, Overlay, usePopover} from '@react-aria/overlays';
import {FocusScope} from '@react-aria/focus';
import {Item} from '@react-stately/collections';
import {MenuTriggerProps, MenuTriggerState, UNSTABLE_useSubmenuTriggerState, useMenuTriggerState} from '@react-stately/menu';
import {mergeProps, useLayoutEffect} from '@react-aria/utils';
import {OverlayTriggerState} from '@react-stately/overlays';
import React, {cloneElement, createContext, MutableRefObject, ReactElement, ReactNode, useContext, useRef, useState} from 'react';
import styles from './index.css';
import {TreeState, useTreeState} from '@react-stately/tree';
import {useButton} from '@react-aria/button';
import {useSeparator} from '@react-aria/separator';

export default {
  title: 'useSubmenuTrigger'
};

export const SubmenuExample = {
  render: () => (
    <MenuButton label="Actions" selectionMode="multiple" onAction={action('onaction')}>
      <Item key="copy">Copy</Item>
      <SubmenuTrigger>
        <Item key="Share">Share</Item>
        <Menu onAction={action('onaction submenu1')}>
          <Item key="Copy Link">Copy Link</Item>
          <SubmenuTrigger>
            <Item key="Email">Email</Item>
            <Menu onAction={action('onaction submenu2')}>
              <Item key="Attachment">Email as Attachment</Item>
              <Item key="Link">Email as Link</Item>
            </Menu>
          </SubmenuTrigger>
          <Item key="SMS">SMS</Item>
        </Menu>
      </SubmenuTrigger>
      <Item key="paste">Paste</Item>
    </MenuButton>
  ),
  name: 'submenu example'
};

interface MenuButtonProps<T> extends AriaMenuProps<T>, MenuTriggerProps {
  label?: string
}
interface RootMenuContextValue {
  rootMenuTriggerState: MenuTriggerState
}
const RootMenuContext = createContext<RootMenuContextValue>(undefined);
function useRootMenuContext() {
  return useContext(RootMenuContext);
}

function MenuButton<T extends object>(props: MenuButtonProps<T>) {
  // Create state based on the incoming props
  let state = useMenuTriggerState(props);

  // Get props for the button and menu elements
  let ref = useRef(null);
  let {menuTriggerProps, menuProps} = useMenuTrigger<T>({}, state, ref);

  return (
    <RootMenuContext.Provider value={{rootMenuTriggerState: state}}>
      <Button
        {...menuTriggerProps}
        buttonRef={ref}
        style={{height: 30, fontSize: 14}}>
        {props.label}
        <span aria-hidden="true" style={{paddingLeft: 5}}>▼</span>
      </Button>
      {state.isOpen &&
        (
          <Popover state={state} triggerRef={ref} placement="bottom start">
            <Menu
              {...props}
              {...menuProps} />
          </Popover>
        )}
    </RootMenuContext.Provider>
  );
}

function Button(props) {
  let ref = props.buttonRef;
  let {buttonProps} = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref} style={props.style}>
      {props.children}
    </button>
  );
}

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: ReactNode,
  state: OverlayTriggerState,
  container?: Element,
  disableFocusManagement?: boolean
}

function Popover({children, state, container, disableFocusManagement, ...props}: PopoverProps) {
  let popoverRef = React.useRef(null);
  let {popoverProps, underlayProps} = usePopover({
    ...props,
    popoverRef
  }, state);

  // TODO: this is the same workaround we applied to the spectrum submenu to close all menus when clicking outside, assumes only one underlay exists
  // perhaps should replace this with a way to detect clicks with the menu tree and clicks outside the tree.
  let onPointerDown = () => {
    state.close();
  };

  return (
    <Overlay disableFocusManagement={disableFocusManagement} portalContainer={container}>
      {!props.isNonModal && <div {...mergeProps(underlayProps, {onPointerDown})} style={{position: 'fixed', inset: 0}} />}
      <div
        {...popoverProps}
        ref={popoverRef}
        style={{
          ...popoverProps.style,
          background: 'lightgray',
          border: '1px solid gray'
        }}>
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
interface MenuContextValue<T> {
  menuRef: MutableRefObject<HTMLUListElement>,
  menuTreeState: TreeState<T>,
  popoverContainerRef: MutableRefObject<HTMLDivElement>
}
const MenuContext = createContext<MenuContextValue<any>>(undefined);
function useMenuContext() {
  return useContext(MenuContext);
}

interface MenuProps<T> extends AriaMenuProps<T> {
  menuRef?: MutableRefObject<HTMLUListElement>
}

function Menu<T extends object>(props: MenuProps<T>) {
  let {menuRef} = props;

  // Create menu state based on the incoming props
  let state = useTreeState(props);

  // Get props for the menu element. Use the menuRef from SubmenuTrigger if provided.
  let ref = useRef(null);
  menuRef = menuRef || ref;
  let {menuProps} = useMenu(props, state, menuRef);

  // Create a container for the menu's submenu to be portalled to. It should span the width of the page for
  // overlay flipping logic
  let popoverContainerRef = useRef(null);
  let [leftOffset, setLeftOffset] = useState({left: 0});
  useLayoutEffect(() => {
    let {left} = popoverContainerRef.current.getBoundingClientRect();
    setLeftOffset({left: -1 * left});
  }, []);

  // TODO: how best to communicate the root menu state down to Menu
  // perhaps if wrapper had the ability to accept arbitrary props I could then pass the root menu state via Menu's call of wrapper
  // same deal with how to pass menuRef and menuTreeState to the SubMenuTrigger here.
  // For now run with context, ask team later
  return (
    <MenuContext.Provider value={{menuRef, menuTreeState: state, popoverContainerRef}}>
      {/* Wrap in FocusScope so we update the active scope when a submenu opens */}
      <FocusScope>
        <ul {...menuProps} className={styles.menu} ref={menuRef}>
          {[...state.collection].map(item => {
            if (item.type === 'section') {
              return (
                <MenuSection key={item.key} section={item} state={state} />
              );
            }

            let menuItem = (
              <MenuItem
                key={item.key}
                item={item}
                state={state}
                onAction={props.onAction} />
            );

            if (item.wrapper) {
              menuItem = item.wrapper(menuItem);
            }

            return menuItem;
          })}
        </ul>
        {/* Add container to which to portal the submenu overlay */}
        <div ref={popoverContainerRef} style={{width: '100vw', position: 'absolute', top: -5, ...leftOffset}} />
      </FocusScope>
    </MenuContext.Provider>
  );
}

function MenuItem(props) {
  let {item, state, onAction, triggerRef} = props;
  let {key} = item;

  // Calculate various states of the menu item
  let isSubmenuTrigger = !!triggerRef;
  let isDisabled = state.disabledKeys.has(key);
  let isSelectable = !isSubmenuTrigger && state.selectionManager.selectionMode !== 'none';
  let isSelected = isSelectable && state.selectionManager.isSelected(key);

  // Use a default ref if the menu item isn't a submenu trigger
  let ref = useRef(null);
  triggerRef = triggerRef || ref;

  // Get props for the menu item element
  let {
    menuItemProps
  } = useMenuItem(
    {
      isSelected,
      isDisabled,
      'aria-label': item['aria-label'],
      key,
      onAction,
      ...props
    },
    state,
    triggerRef
  );

  return (
    <li {...menuItemProps} className={styles.menuitem} ref={triggerRef}>
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
      {isSubmenuTrigger && !isDisabled && <span aria-hidden="true">►</span>}
    </li>
  );
}

function MenuSection({section, state}) {
  let {itemProps, headingProps, groupProps} = useMenuSection({
    heading: section.rendered,
    'aria-label': section['aria-label']
  });

  let {separatorProps} = useSeparator({
    elementType: 'li'
  });

  // If the section is not the first, add a separator element.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <>
      {section.key !== state.collection.getFirstKey() &&
        (
          <li
            {...separatorProps}
            style={{
              borderTop: '1px solid gray',
              margin: '2px 5px'
            }} />
        )}
      <li {...itemProps}>
        {section.rendered &&
          (
            <span
              {...headingProps}
              style={{
                fontWeight: 'bold',
                fontSize: '1.1em',
                padding: '2px 5px'
              }}>
              {section.rendered}
            </span>
          )}
        <ul
          {...groupProps}
          style={{
            padding: 0,
            listStyle: 'none'
          }}>
          {[...section.childNodes].map((node) => (
            <MenuItem
              key={node.key}
              item={node}
              state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

function SubmenuTrigger(props) {
  // Grab refs and state information of the parent and root menu to allow submenu hooks
  // to process focus movement and user interactions across multiple menu levels
  let {rootMenuTriggerState} = useRootMenuContext();
  let {popoverContainerRef, menuRef: parentMenuRef, menuTreeState} = useMenuContext();
  let {
    children,
    targetKey
  } = props;

  let triggerRef = useRef<HTMLDivElement>(null);
  let menuRef = useRef<HTMLDivElement>(null);

  // Get props and state for the submenu tied to the submenu trigger
  let [menuTrigger, menu] = React.Children.toArray(children);
  let triggerNode = menuTreeState.collection.getItem(targetKey);
  let submenuTriggerState = UNSTABLE_useSubmenuTriggerState({triggerKey: targetKey}, rootMenuTriggerState);
  let {submenuTriggerProps, submenuProps, popoverProps, overlayProps} = UNSTABLE_useSubmenuTrigger({
    node: triggerNode,
    parentMenuRef,
    submenuRef: menuRef
  }, submenuTriggerState, triggerRef);

  let overlay = (
    <Popover
      {...mergeProps(popoverProps, overlayProps)}
      container={popoverContainerRef?.current}
      offset={-5}
      containerPadding={0}
      crossOffset={-5}
      state={submenuTriggerState}
      triggerRef={triggerRef}
      scrollRef={menuRef}
      placement="end top">
      {cloneElement(menu as ReactElement, {...submenuProps, menuRef})}
    </Popover>
  );

  return (
    <>
      {cloneElement(menuTrigger as ReactElement, {...submenuTriggerProps, triggerRef: triggerRef})}
      {submenuTriggerState.isOpen && overlay}
    </>
  );
}

// Allow SubmenuTrigger component to wrap Items for collection processing
SubmenuTrigger.getCollectionNode = function* (props) {
  let childArray = [];
  React.Children.forEach(props.children, child => {
    if (React.isValidElement(child)) {
      childArray.push(child);
    }
  });
  let [trigger, content] = childArray;

  yield {
    element: cloneElement(trigger, {...trigger.props, hasChildItems: true, isTrigger: true}),
    wrapper: (element) => (
      <SubmenuTrigger key={element.key} targetKey={element.key} {...props}>
        {element}
        {content}
      </SubmenuTrigger>
    )
  };
};
