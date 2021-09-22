/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Autocomplete} from '../';
import {Meta, Story} from '@storybook/react';
import React from 'react';
import {SpectrumAutocompleteProps} from '@react-types/autocomplete';

const meta: Meta<SpectrumAutocompleteProps> = {
  title: 'Autocomplete',
  component: Autocomplete
};

export default meta;

const Template = (): Story<SpectrumAutocompleteProps> => (args) => (
  <Autocomplete {...args}>This is a React Spectrum Autocomplete</Autocomplete>
);

export const Default = Template().bind({});
Default.args = {};
