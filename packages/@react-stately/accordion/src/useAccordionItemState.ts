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

import {useCallback} from 'react';
import {useControlledState} from '@react-stately/utils';

// TODO: move this to @react-types/accordion?
export interface AccordionItemProps {
  /** Whether the accordion item's panel is open (controlled). */
  isOpen?: boolean,
  /** Whether the accordion item's panel is open by default (uncontrolled). */
  defaultOpen?: boolean,
  /** Handler that is called when the accordion item's panel open state changes. */
  onOpenChange?: (isOpen: boolean) => void
}


export interface AccordionItemState {
  /** Whether the accordion item's panel is currently open. */
  readonly isOpen: boolean,
  /** Sets whether the accordion item's panel is open. */
  setOpen(isOpen: boolean): void,
  /** Opens the accordion item's panel. */
  open(): void,
  /** Closes the accordion item's panel. */
  close(): void,
  /** Toggles the accordion item's panel visibility. */
  toggle(): void
}

/**
 * Manages state for an accordion item. Tracks whether the accordion panel is open, and provides
 * methods to toggle this state.
 */
export function useAccordionItemState(props: AccordionItemProps): AccordionItemState  {
  let [isOpen, setOpen] = useControlledState(props.isOpen, props.defaultOpen || false, props.onOpenChange);

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [setOpen, isOpen]);

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  };
}
