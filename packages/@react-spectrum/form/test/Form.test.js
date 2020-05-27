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

import {Form} from '../';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {render} from '@testing-library/react';
import scaleMedium from '@adobe/spectrum-css-temp/vars/spectrum-medium-unique.css';
import {TextField} from '@react-spectrum/textfield';
import themeLight from '@adobe/spectrum-css-temp/vars/spectrum-light-unique.css';

let theme = {
  light: themeLight,
  medium: scaleMedium
};

describe('Form', function () {
  it('should render a form', () => {
    let {getByRole} = render(
      <Provider theme={theme}>
        <Form aria-label="Home" />
      </Provider>
    );

    let form = getByRole('form');
    expect(form).toBeTruthy();
  });

  it('should render children inside the form', () => {
    let {getByRole} = render(
      <Provider theme={theme}>
        <Form aria-label="Home">
          <button>Test</button>
        </Form>
      </Provider>
    );

    let button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should attach a optional user provided ref to the form', () => {
    let ref = React.createRef();
    let {getByRole} = render(
      <Provider theme={theme}>
        <Form aria-label="Home" ref={ref} />
      </Provider>
    );

    let form = getByRole('form');
    expect(form).toBe(ref.current.UNSAFE_getDOMNode());
  });

  it('should context props should be overridden by child', () => {
    let testId = 'tfid4';
    let tree = render(
      <Provider theme={theme}>
        <Form necessityIndicator={undefined}>
          <TextField label="A text field" necessityIndicator="label" data-testid={testId} />
        </Form>
      </Provider>
    );

    let input = tree.getByTestId(testId);
    let labelId = input.getAttribute('aria-labelledby');
    expect(labelId).toBeDefined();
    let label = document.getElementById(labelId);
    expect(label).toHaveTextContent('A text field ​(optional)');
  });
});
