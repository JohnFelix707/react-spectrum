import {useCallback, useRef, useState} from 'react';

export function useControlledState<T>(
  value: T,
  defaultValue: T,
  onChange: (value: T, ...args: any[]) => void
): [T, (value: T | ((prevState: T) => T), ...args: any[]) => void]  {
  let [stateValue, setStateValue] = useState(value || defaultValue);
  let ref = useRef(value !== undefined);
  let wasControlled = ref.current;
  let isControlled = value !== undefined;
  // Internal state reference for useCallback
  let stateRef = useRef(stateValue);
  if (wasControlled !== isControlled) {
    console.warn(`WARN: A component changed from ${wasControlled ? 'controlled' : 'uncontrolled'} to ${isControlled ? 'controlled' : 'uncontrolled'}.`);
  }

  ref.current = isControlled;

  let setValue = useCallback((value, ...args) => {
    let onChangeCaller = (value, ...onChangeArgs) => {
      if (onChange) {
        if (stateRef.current !== value) {
          onChange(value, ...onChangeArgs);
        }
      }
      if (!isControlled) {
        stateRef.current = value;
      }
    };

    if (typeof value === 'function') {
      let updateFunction = (oldValue, ...functionArgs) => {
        let interceptedValue = value(oldValue, ...functionArgs);
        onChangeCaller(interceptedValue, ...args);
        if (!isControlled) {
          return interceptedValue;
        }
        return oldValue;
      };
      setStateValue(updateFunction);
    } else {
      if (!isControlled) {
        setStateValue(value);
      }
      onChangeCaller(value, ...args);
    }
  }, [isControlled, onChange]);

  // If a controlled component's value prop changes, we need to update stateRef
  if (isControlled) {
    stateRef.current = value;
  } else {
    value = stateValue;
  }

  return [value, setValue];
}
