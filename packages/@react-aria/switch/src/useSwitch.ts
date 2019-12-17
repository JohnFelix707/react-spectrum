import {InputHTMLAttributes} from 'react';
import {SwitchProps} from '@react-types/switch';
import {ToggleState} from '@react-stately/toggle';
import {useToggle} from '@react-aria/toggle';

export interface SwitchAria {
  inputProps: InputHTMLAttributes<HTMLInputElement>
}

export function useSwitch(props: SwitchProps, state: ToggleState): SwitchAria {
  let {inputProps} = useToggle(props, state);
  let {isSelected} = state;

  return {
    inputProps: {
      ...inputProps,
      role: 'switch',
      checked: isSelected,
      'aria-checked': isSelected
    }
  };
}
