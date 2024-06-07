/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  TextArea as AriaTextArea,
  composeRenderProps,
  TextAreaContext,
  useSlottedContext,
  InputContext
} from 'react-aria-components';
import {FieldErrorIcon, FieldGroup, FieldLabel, HelpText, Input} from './Field';
import {StyleProps, centerPadding, field, getAllowedOverrides} from './style-utils' with {type: 'macro'};
import {style} from '../style/spectrum-theme' with {type: 'macro'};
import {SpectrumLabelableProps, HelpTextProps} from '@react-types/shared';
import {useContext, Ref, forwardRef, useRef, useImperativeHandle, ReactNode} from 'react';
import {FormContext, useFormProps} from './Form';
import {TextFieldRef} from '@react-types/textfield';
import {createFocusableRef} from '@react-spectrum/utils';
import {StyleString} from '../style/types';
import {mergeRefs} from '@react-aria/utils';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'children' | 'className' | 'style'>, StyleProps, Omit<SpectrumLabelableProps, 'contextualHelp'>, HelpTextProps {
  /**
   * The size of the text field.
   *
   * @default 'M'
   */
  size?: 'S' | 'M' | 'L' | 'XL'
}

function TextField(props: TextFieldProps, ref: Ref<TextFieldRef>) {
  return (
    <_TextFieldBase
      {...props}
      ref={ref}>
      <Input />
    </_TextFieldBase>
  );
}

/**
 * TextFields are text inputs that allow users to input custom text entries
 * with a keyboard. Various decorations can be displayed around the field to
 * communicate the entry requirements.
 */
let _TextField = forwardRef(TextField);
export {_TextField as TextField};

export interface TextAreaProps extends Omit<TextFieldProps, 'type' | 'pattern'> {}

function TextArea(props: TextAreaProps, ref: Ref<TextFieldRef>) {
  return (
    <_TextFieldBase
      {...props}
      ref={ref}
      fieldGroupCss={style({
        alignItems: 'baseline',
        height: 'auto'
      })}>
      <TextAreaInput />
    </_TextFieldBase>
  );
}

/**
 * TextAreas are multiline text inputs, useful for cases where users have
 * a sizable amount of text to enter. They allow for all customizations that
 * are available to text fields.
 */
let _TextArea = forwardRef(TextArea);
export {_TextArea as TextArea};

function TextFieldBase(props: TextFieldProps & {children: ReactNode, fieldGroupCss?: StyleString}, ref: Ref<TextFieldRef>) {
  let inputRef = useRef<HTMLInputElement>(null);
  let domRef = useRef<HTMLDivElement>(null);
  let formContext = useContext(FormContext);
  props = useFormProps(props);
  let {
    label,
    description,
    errorMessage,
    necessityIndicator,
    labelPosition = 'top',
    labelAlign = 'start',
    fieldGroupCss,
    UNSAFE_style,
    UNSAFE_className = '',
    ...textFieldProps
  } = props;

  // Expose imperative interface for ref
  useImperativeHandle(ref, () => ({
    ...createFocusableRef(domRef, inputRef),
    select() {
      if (inputRef.current) {
        inputRef.current.select();
      }
    },
    getInputElement() {
      return inputRef.current;
    }
  }));

  return (
    <AriaTextField
      {...textFieldProps}
      ref={domRef}
      style={UNSAFE_style}
      className={UNSAFE_className + style(field(), getAllowedOverrides())({
        size: props.size,
        labelPosition,
        isInForm: !!formContext
      }, props.styles)}>
      {composeRenderProps(props.children, (children, {isDisabled, isInvalid}) => (<>
        <FieldLabel
          isDisabled={isDisabled}
          isRequired={props.isRequired}
          size={props.size}
          labelPosition={labelPosition}
          labelAlign={labelAlign}
          necessityIndicator={necessityIndicator}>
          {label}
        </FieldLabel>
        {/* TODO: set GroupContext in RAC TextField */}
        <FieldGroup role="presentation" isDisabled={isDisabled} isInvalid={isInvalid} size={props.size} styles={fieldGroupCss}>
          <InputContext.Consumer>
            {ctx => (
              <InputContext.Provider value={{...ctx, ref: mergeRefs((ctx as any)?.ref, inputRef)}}>
                {children}
              </InputContext.Provider>
            )}
          </InputContext.Consumer>
          {isInvalid && <FieldErrorIcon isDisabled={isDisabled} />}
        </FieldGroup>
        <HelpText
          size={props.size}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          description={description}>
          {errorMessage}
        </HelpText>
      </>))}
    </AriaTextField>
  );
}

let _TextFieldBase = forwardRef(TextFieldBase);

function TextAreaInput() {
  // Force re-render when value changes so we update the height.
  useSlottedContext(TextAreaContext) ?? {};
  let onHeightChange = (input: HTMLTextAreaElement) => {
    // TODO: only do this if an explicit height is not given?
    if (input) {
      let prevAlignment = input.style.alignSelf;
      let prevOverflow = input.style.overflow;
      // Firefox scroll position is lost when overflow: 'hidden' is applied so we skip applying it.
      // The measure/applied height is also incorrect/reset if we turn on and off
      // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
      let isFirefox = 'MozAppearance' in input.style;
      if (!isFirefox) {
        input.style.overflow = 'hidden';
      }
      input.style.alignSelf = 'start';
      input.style.height = 'auto';
      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
    }
  };

  return (
    <AriaTextArea
      ref={onHeightChange}
      // Workaround for baseline alignment bug in Safari.
      // https://bugs.webkit.org/show_bug.cgi?id=142968
      placeholder=" "
      className={style({
        paddingX: 0,
        paddingY: centerPadding(),
        minHeight: 'control',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        color: '[inherit]',
        fontFamily: '[inherit]',
        fontSize: '[inherit]',
        lineHeight: 'ui',
        flexGrow: 1,
        minWidth: 0,
        outlineStyle: 'none',
        borderStyle: 'none',
        resize: 'none',
        overflowX: 'hidden'
      })} />
  );
}
