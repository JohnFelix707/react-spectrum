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

import {categorizeArgTypes} from './utils';
import {ColorArea} from '../src/ColorArea';
import type {Meta} from '@storybook/react';

const meta: Meta<typeof ColorArea> = {
  component: ColorArea,
  parameters: {
    layout: 'centered'
    // TODO: uncomment when baseline for new S2 chromatic stories is accepted since these are resused in the chromatic stories
    // chromatic: {
    //   disableSnapshot: true
    // }
  },
  tags: ['autodocs'],
  argTypes: {
    ...categorizeArgTypes('Events', ['onChange', 'onChangeEnd'])
  },
  title: 'S2/ColorArea'
};

export default meta;

export const Example = (args: any) => <ColorArea {...args} onChange={undefined} />;

Example.args = {
  defaultValue: 'hsl(30, 100%, 50%)'
};
