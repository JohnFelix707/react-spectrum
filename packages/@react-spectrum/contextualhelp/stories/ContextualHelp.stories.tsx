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

import {action} from '@storybook/addon-actions';
import {Button, Flex, Link, Text} from '@adobe/react-spectrum';
import {ContextualHelp} from '../src';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('ContextualHelp', module)
.add(
  'default',
  () => <ContextualHelp title="Help title">{helpText()}</ContextualHelp>
)
.add(
  'type: info',
  () => <ContextualHelp variant="info" title="Help title">{helpText()}</ContextualHelp>
)
.add(
  'with link',
  () => (<ContextualHelp title="Help title" link={<Link>Learn more</Link>}>
    {helpText()}
  </ContextualHelp>)
)
.add(
  'with button',
  () => (<Flex alignItems="center">
    <Button variant="primary" isDisabled>Create</Button>
    <ContextualHelp title="Help title">{helpText()}</ContextualHelp>
  </Flex>)
)
.add(
  'trigger events',
  () => (<ContextualHelp title="Help title" onOpenChange={action('open change')}>{helpText()}</ContextualHelp>)
)
.add(
  'placement: bottom',
  () => (<ContextualHelp title="Help title" placement="bottom" >{helpText()}</ContextualHelp>)
)
.add(
  'placement: bottom start',
  () => (<ContextualHelp title="Help title" placement="bottom start" >{helpText()}</ContextualHelp>)
);

const helpText = () => <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem.</Text>;
