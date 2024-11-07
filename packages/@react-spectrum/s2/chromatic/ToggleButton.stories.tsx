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

import {categorizeArgTypes, StaticColorDecorator} from '../stories/utils';
import {generatePowerset} from '@react-spectrum/story-utils';
import type {Meta, StoryFn} from '@storybook/react';
import NewIcon from '../s2wf-icons/S2_Icon_New_20_N.svg';
import {shortName} from './utils';
import {StaticColorProvider} from '../stories/utils';
import {style} from '../style' with { type: 'macro' };
import {Text, ToggleButton} from '../src';

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
  parameters: {
    layout: 'centered'
  },
  decorators: [StaticColorDecorator],
  argTypes: {
    ...categorizeArgTypes('Events', ['onPress', 'onPressChange', 'onPressEnd', 'onPressStart', 'onPressUp', 'onChange'])
  },
  title: 'S2 Chromatic/ToggleButton'
};

export default meta;

let states = [
  {isQuiet: true},
  {isDisabled: true},
  {isEmphasized: true},
  {isSelected: true},
  {size: ['XS', 'S', 'M', 'L', 'XL']},
  {staticColor: ['black', 'white']}
];

let combinations = generatePowerset(states);

const Template = (args) => {
  let {children, ...otherArgs} = args;
  return (
    <div className={style({display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 250px))', gridAutoFlow: 'row', justifyItems: 'start', gap: 24, width: '[100vw]'})}>
      {combinations.map(c => {
        let fullComboName = Object.keys(c).map(k => `${k}: ${c[k]}`).join(' ');
        let key = Object.keys(c).map(k => shortName(k, c[k])).join(' ');
        if (!key) {
          key = 'default';
        }

        let button = <ToggleButton key={key} data-testid={fullComboName} {...otherArgs} {...c}>{children ? children : key}</ToggleButton>;
        if (c.staticColor != null) {
          return (
            <StaticColorProvider staticColor={c.staticColor}>
              {button}
            </StaticColorProvider>
          );
        }

        return button;
      })}
    </div>
  );
};

export const Default = {
  render: Template
};

export const WithIcon = {
  render: Template,
  args: {
    children: <><NewIcon /><Text>Press me</Text></>
  }
};

export const IconOnly = {
  render: Template,
  args: {
    children: <NewIcon />
  }
};

export const Truncate: StoryFn<typeof ToggleButton> = (args) => {
  return (
    <div style={{display: 'flex', gap: 8}}>
      <ToggleButton {...args} styles={style({width: 40})}>Press me</ToggleButton>
      <ToggleButton {...args} styles={style({width: 64})}><NewIcon /><Text>Press me</Text></ToggleButton>
    </div>
  );
};