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

import type {Meta} from '@storybook/react';
import {AlertBanner} from '../src/AlertBanner';
import {action} from '@storybook/addon-actions';

const meta: Meta<typeof AlertBanner> = {
  component: AlertBanner,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

export const Example = (args: any) => (
  <AlertBanner actionLabel="Action" onAction={action('onAction')} onDismiss={action('onDismiss')} {...args}>Your trial has expired.</AlertBanner>
);

export const LongText = (args: any) => (
  <AlertBanner actionLabel="Action" onAction={action('onAction')} onDismiss={action('onDismiss')} {...args}>
    Neutral alert banner message that wraps to multiple lines. For example: Your trial has expired. Explain how to renew the trial.
  </AlertBanner>
);
