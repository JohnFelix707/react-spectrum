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
import {ComponentMeta, ComponentStoryObj} from '@storybook/react';
import {Label} from '../';
import React from 'react';
import {SpectrumLabelProps} from '@react-types/label';
import {TextField} from '@react-spectrum/textfield';

type LabelStory = ComponentStoryObj<typeof Label>;

export default {
  title: 'Label',
  component: Label,
  args: {width: '100%'}
} as ComponentMeta<typeof Label>;

export let Default: LabelStory = {
  render: (args) => <TextFieldLabel {...args} />
};

export let LabelAlignStart: LabelStory = {
  ...Default,
  args: {labelAlign: 'start'},
  name: 'labelAlign: start'
};

export let LabelAlignEnd: LabelStory = {
  ...LabelAlignStart,
  args: {...LabelAlignStart.args, labelAlign: 'end'},
  name: 'labelAlign: end'
};

export let LabelPositionSideLabelAlignStart: LabelStory = {
  ...LabelAlignStart,
  args: {...LabelAlignStart.args, width: 80, labelPosition: 'side'},
  name: 'labelPosition: side, labelAlign: start'
};

export let LabelPositionSideLabelAlignEnd: LabelStory = {
  ...LabelPositionSideLabelAlignStart,
  args: {...LabelPositionSideLabelAlignStart.args, labelAlign: 'end'},
  name: 'labelPosition: side, labelAlign: end'
};

export let IsRequired: LabelStory = {
  ...Default,
  args: {isRequired: true},
  name: 'isRequired'
};

export let IsRequiredNecessityIndicatorIcon: LabelStory = {
  ...IsRequired,
  args: {...IsRequired.args, necessityIndicator: 'icon'},
  name: 'isRequired: true, necessityIndicator: icon'
};

export let NecessityIndicatorLabel: LabelStory = {
  ...Default,
  args: {...Default.args, necessityIndicator: 'label'},
  name: 'necessityIndicator: label'
};

export let IsRequiredNecessityIndicatorLabel: LabelStory = {
  ...IsRequired,
  args: {...IsRequired.args, necessityIndicator: 'label'},
  name: 'isRequired: true, necessityIndicator: label'
};

function TextFieldLabel(props: SpectrumLabelProps = {}) {
  return (
    <div style={{whiteSpace: 'nowrap'}}>
      <Label {...props} for="test">
        Test
      </Label>
      <TextField id="test" isRequired={props.isRequired} />
    </div>
  );
}
