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
import {AriaBreadcrumbsProps, mergeProps, useBreadcrumbs, useFocusRing, useHover} from 'react-aria';
import {CollectionProps, useCollection} from './Collection';
import {ContextValue, forwardRefType, Provider, RenderProps, SlotProps, useContextProps, useRenderProps} from './utils';
import {filterDOMProps} from '@react-aria/utils';
import {HeadingContext} from './Heading';
import {LinkContext} from './Link';
import {Node} from 'react-stately';
import React, {createContext, ForwardedRef, forwardRef, HTMLAttributes} from 'react';

export interface BreadcrumbsRenderProps {
  /**
   * Whether the breadcrumbs are currently hovered with a mouse.
   * @selector [data-hovered]
   */
  isHovered: boolean,
  /**
   * Whether the breadcrumbs are disabled.
   * @selector :disabled
   */
  isDisabled: boolean
}

export interface BreadcrumbsProps<T> extends Omit<CollectionProps<T>, 'disabledKeys' | 'children'>, Omit<AriaBreadcrumbsProps, 'children'>, SlotProps, RenderProps<BreadcrumbsRenderProps> {
  /** Whether the breadcrumbs are disabled. */
  isDisabled?: boolean
}

export const BreadcrumbsContext = createContext<ContextValue<BreadcrumbsProps<any>, HTMLElement>>(null);

function Breadcrumbs<T extends object>(props: BreadcrumbsProps<T>, ref: ForwardedRef<HTMLElement>) {
  [props, ref] = useContextProps(props, ref, BreadcrumbsContext);
  let {navProps} = useBreadcrumbs(props);
  let {portal, collection} = useCollection(props as CollectionProps<T>);
  let {hoverProps, isHovered} = useHover(props);
  let renderProps = useRenderProps({
    ...props,
    values: {isHovered, isDisabled: props.isDisabled || false},
    defaultClassName: 'react-aria-Breadcrumbs'
  });

  return (
    <nav
      ref={ref}
      {...filterDOMProps(props)}
      {...navProps}
      {...hoverProps}
      {...renderProps}
      slot={props.slot}>
      {/* TODO: cannot style this element directly */}
      <ol>
        {[...collection].map((node, i) => (
          <BreadcrumbItem
            key={node.key}
            node={node}
            isCurrent={i === collection.size - 1}
            isDisabled={props.isDisabled} />
        ))}
      </ol>
      {portal}
    </nav>
  );
}

/**
 * Breadcrumbs display a heirarchy of links to the current page or resource in an application.
 */
const _Breadcrumbs = /*#__PURE__*/ (forwardRef as forwardRefType)(Breadcrumbs);
export {_Breadcrumbs as Breadcrumbs};

interface BreadcrumbItemProps {
  node: Node<object>,
  isCurrent: boolean,
  isDisabled?: boolean
}

function BreadcrumbItem({node, isCurrent, isDisabled}: BreadcrumbItemProps) {
  // Recreating useBreadcrumbItem because we want to use composition instead of having the link builtin.
  let headingProps: HTMLAttributes<HTMLHeadingElement> | null = isCurrent ? {'aria-current': 'page'} : null;
  let linkProps = {
    'aria-current': isCurrent ? 'page' : null,
    isDisabled: isDisabled || isCurrent
  };
  let {focusProps, isFocused, isFocusVisible} = useFocusRing(node.props);
  let {hoverProps, isHovered} = useHover(node.props);
  let renderProps = useRenderProps({
    ...node.props,
    values: {isHovered, isFocused, isFocusVisible, isCurrent, isDisabled},
    defaultClassName: 'react-aria-Item'
  });

  return (
    <li
      {...filterDOMProps(node.props)}
      {...mergeProps(focusProps, hoverProps)}
      {...renderProps}>
      <Provider
        values={[
          [LinkContext, linkProps],
          [HeadingContext, headingProps]
        ]}>
        {node.rendered}
      </Provider>
    </li>
  );
}
