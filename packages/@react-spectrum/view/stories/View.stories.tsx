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
import {Button} from '@react-spectrum/button';
import {ComponentMeta, ComponentStoryObj} from '@storybook/react';
import React from 'react';
import {View} from '../';

type ViewStory = ComponentStoryObj<typeof View>;

let meta = {
  title: 'View',
  component: View
} as ComponentMeta<typeof View>;

export default meta;

export const NameMe: ViewStory = {
  render: () => (
    <div style={{display: 'flex'}}>
      <View
        backgroundColor="negative"
        width="single-line-width"
        height="size-500"
        elementType="span" />
      <View
        backgroundColor="positive"
        width="size-500"
        height="size-500"
        marginStart="size-250"
        borderColor="default"
        borderWidth="thin" />
      <Button variant="primary" marginStart="size-250">
        Test
      </Button>
    </div>
  )
};

export const DimensionFunctions: ViewStory = {
  args: {
    width: 'calc(100px + size-250)',
    height: 'single-line-height',
    backgroundColor: 'blue-400'
  }
};
