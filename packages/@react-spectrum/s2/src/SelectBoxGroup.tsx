/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import {CheckboxGroup, CheckboxGroupProps, GridListProps, Label, Provider, RadioGroup, RadioGroupProps, SelectionMode} from 'react-aria-components';
import {IconContext} from './Icon';
import {Orientation} from 'react-aria';
import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {style}  from '../style' with {type: 'macro'};
import {TextContext} from './Content';
import {UnsafeStyles} from './style-utils' with {type: 'macro'};
import {ValueBase} from '@react-types/shared';

/**
 * Ensures the return value is a string.
 * @param { string[]} value Possible options for selection.
 * @returns { string }
 */
function unwrapValue(value: string[]): string {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export interface SelectBoxGroupProps<T> extends Omit<GridListProps<T>, 'layout' | 'keyboardNavigationBehavior' | 'selectionBehavior' | 'onSelectionChange' | 'className' | 'style'>, UnsafeStyles, ValueBase<string[]> {
  children?: ReactNode,
  label?: ReactNode,
  isDisabled?: boolean,
  isRequired?: boolean,
  onChange?: (value: string[]) => void,
  orientation?: Orientation,
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL'
}

export type SelectorGroupProps = (CheckboxGroupProps | Omit<RadioGroupProps, 'defaultValue' | 'value'>) & { defaultValue?: string[], selectionMode: SelectionMode, value?: string[] };

export const SelectBoxContext = React.createContext<SelectBoxGroupProps<any>>({
  size: 'M',
  orientation: 'vertical'
});

export function useSelectBoxGroupProvider() {
  return useContext(SelectBoxContext);
}

const SelectorGroup = forwardRef(function SelectorGroupComponent(
  {
    children,
    className,
    defaultValue,
    isDisabled,
    isRequired,
    onChange,
    selectionMode,
    value
  }: SelectorGroupProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const props = {
    isRequired,
    isDisabled,
    className,
    children,
    onChange,
    ref
  };

  return selectionMode === 'single' ? (
    <RadioGroup {...props as RadioGroupProps} value={value && unwrapValue(value)} defaultValue={defaultValue && unwrapValue(defaultValue)} />
  ) : (
    <CheckboxGroup {...props as CheckboxGroupProps} />
  );
});

function SelectBoxGroup<T extends object>(
  props: SelectBoxGroupProps<T>,
  ref: ForwardedRef<HTMLDivElement>
): React.ReactElement {
  const {
    children,
    defaultValue,
    isDisabled = false,
    isRequired = false,
    label,
    onChange,
    orientation = 'vertical',
    selectionMode = 'multiple',
    size = 'M',
    value: valueProp
  } = props;

  const [value, setValue] = useState<string[] | undefined>(defaultValue || valueProp);

  useEffect(() => {
    if (value !== undefined && onChange) {
      onChange(value);
    }
  }, [onChange, value]);

  const selectBoxContextValue = useMemo(
    () => ({
      orientation,
      selectionMode,
      selectedValue: value,
      size: size,
      value
    }),
    [orientation, selectionMode, size, value]
  );

  // When one box grows, the rest should grow, too.
  // setting autoRows to 1fr so that different rows split the space evenly
  return (
    <SelectorGroup
      className=""
      defaultValue={defaultValue}
      onChange={setValue}
      isRequired={isRequired}
      isDisabled={isDisabled}
      ref={ref}
      selectionMode={selectionMode}
      value={value}>
      <Provider
        values={[
          [IconContext, {}],
          [
            TextContext,
            {
              slots: {
                description: {},
                label: {}
              }
            }
          ]
        ]}>
        <span>
          <Label slot="label">{label}</Label>
        </span>
        <div
          className={style({
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(3, auto)',
            justifyContent: 'start'
          })}>
          <SelectBoxContext.Provider value={selectBoxContextValue}>
            {children}
          </SelectBoxContext.Provider>
        </div>
      </Provider>
    </SelectorGroup>
  );
}

const _SelectBoxGroup = forwardRef(SelectBoxGroup);
export {_SelectBoxGroup as SelectBoxGroup};
