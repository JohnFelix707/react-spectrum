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

import {ActionButton} from '../';
import React from 'react';
import {render} from '@testing-library/react';
import {triggerPress} from '@react-spectrum/test-utils';
import V2Button from '@react/react-spectrum/Button';

describe('ActionButton', function () {
  let onPressSpy = jest.fn();

  afterEach(() => {
    onPressSpy.mockClear();
  });

  it.each`
    Name              | Component        | props
    ${'ActionButton'} | ${ActionButton}  | ${{onPress: onPressSpy}}
    ${'V2Button'}     | ${V2Button}      | ${{variant: 'action', onClick: onPressSpy}}
  `('$Name handles defaults', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Click Me</Component>);

    let button = getByRole('button');
    triggerPress(button);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
    expect(button).not.toHaveAttribute('aria-pressed');
    expect(button).not.toHaveAttribute('aria-checked');
  });

  it.each`
    Name              | Component        | props
    ${'ActionButton'} | ${ActionButton}  | ${{}}
    ${'V2Button'}     | ${V2Button}      | ${{variant: 'action'}}
  `('$Name allows custom props to be passed through to the button', function ({Component, props}) {
    let {getByRole} = render(<Component {...props} data-foo="bar" aria-hidden>Click Me</Component>);

    let button = getByRole('button', {hidden: true});
    expect(button).toHaveAttribute('data-foo', 'bar');
    expect(button).toHaveAttribute('aria-hidden', 'true');
  });

  it.each`
    Name              | Component        | props
    ${'ActionButton'} | ${ActionButton}  | ${{onPress: onPressSpy, holdAffordance: true}}
    ${'V2Button'}     | ${V2Button}      | ${{variant: 'action', onClick: onPressSpy, holdAffordance: true}}
  `('$Name hold affordance', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Click Me</Component>);

    let button = getByRole('button');
    let holdAffordance;
    if (Component === V2Button) {
      holdAffordance = getByRole('presentation');
      expect(holdAffordance).toBeTruthy();
      expect(holdAffordance).not.toHaveAttribute('aria-hidden');
    } else {
      holdAffordance = getByRole('img', {hidden: true});
      expect(holdAffordance).toBeTruthy();
      expect(holdAffordance).toHaveAttribute('aria-hidden');
    }
    triggerPress(button);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
  });

  it.each`
    Name              | Component        | props
    ${'ActionButton'} | ${ActionButton}  | ${{onPress: onPressSpy, isSelected: true}}
  `('$Name isSelected', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Click Me</Component>);

    let button = getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).not.toHaveAttribute('aria-checked');
  });
});
