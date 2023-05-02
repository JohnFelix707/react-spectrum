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
import {AriaButtonProps, mergeProps, useButton, useFocusRing, useHover} from 'react-aria';
import {ContextValue, RenderProps, SlotProps, useContextProps, useRenderProps} from './utils';
import {filterDOMProps} from '@react-aria/utils';
import React, {createContext, ForwardedRef, forwardRef} from 'react';

export interface ButtonRenderProps {
  /**
   * Whether the button is currently hovered with a mouse.
   * @selector [data-hovered]
   */
  isHovered: boolean,
  /**
   * Whether the button is currently in a pressed state.
   * @selector [data-pressed]
   */
  isPressed: boolean,
  /**
   * Whether the button is focused, either via a mouse or keyboard.
   * @selector :focus
   */
  isFocused: boolean,
  /**
   * Whether the button is keyboard focused.
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean,
  /**
   * Whether the button is disabled.
   * @selector :disabled
   */
  isDisabled: boolean
}

export interface ButtonProps extends Omit<AriaButtonProps, 'children' | 'href' | 'target' | 'rel' | 'elementType'>, SlotProps, RenderProps<ButtonRenderProps> {
  /** 
   * The <form> element to associate the button with.
   * The value of this attribute must be the id of a <form> in the same document.
   */
  form?: string | undefined,
  /** 
   * The URL that processes the information submitted by the button.
   * Overrides the action attribute of the button's form owner.
   */
  formAction?: string | undefined,
  /** Indicates how to encode the form data that is submitted. */
  formEncType?: string | undefined,
  /** Indicates the HTTP method used to submit the form. */
  formMethod?: string | undefined,
  /** Indicates that the form is not to be validated when it is submitted. */
  formNoValidate?: boolean | undefined,
  /** Overrides the target attribute of the button's form owner. */
  formTarget?: string | undefined,
  /** Submitted as a pair with the button's value as part of the form data. */
  name?: string | undefined,
  /** The value associated with the button's name when it's submitted with the form data. */
  value?: string | undefined
}

interface ButtonContextValue extends ButtonProps {
  isPressed?: boolean
}

const additionalButtonHTMLAttributes = new Set(['form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'name', 'value']);

export const ButtonContext = createContext<ContextValue<ButtonContextValue, HTMLButtonElement>>({});

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  [props, ref] = useContextProps(props, ref, ButtonContext);
  let ctx = props as ButtonContextValue;
  let {buttonProps, isPressed} = useButton(props, ref);
  let {focusProps, isFocused, isFocusVisible} = useFocusRing(props);
  let {hoverProps, isHovered} = useHover(props);
  let renderProps = useRenderProps({
    ...props,
    values: {isHovered, isPressed, isFocused, isFocusVisible, isDisabled: props.isDisabled || false},
    defaultClassName: 'react-aria-Button'
  });

  return (
    <button
      {...filterDOMProps(props, {propNames: additionalButtonHTMLAttributes})}
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      {...renderProps}
      ref={ref}
      slot={props.slot}
      data-pressed={ctx.isPressed || isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focus-visible={isFocusVisible || undefined} />
  );
}

/**
 * A button allows a user to perform an action, with mouse, touch, and keyboard interactions.
 */
const _Button = forwardRef(Button);
export {_Button as Button};
