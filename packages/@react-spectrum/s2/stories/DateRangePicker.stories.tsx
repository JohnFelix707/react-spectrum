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

import {DateRangePicker} from '../src/DateRangePicker';

import type {Meta} from '@storybook/react';

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  parameters: {
    layout: 'centered'
  },
  title: 'S2/DateRangePicker'
};

export default meta;

export const Example = (args: any) => <DateRangePicker {...args} />;

Example.args = {
  label: 'Event date'
};
