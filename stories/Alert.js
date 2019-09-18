/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
*/
import {action} from '@storybook/addon-actions';
import Alert from '../src/Alert';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('Alert', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'Closeable',
    () => render({closeLabel: 'Close', onClose: action('close')})
  )
  .add(
    'header',
    () => render({header: 'info'})
  )
  .add(
    'variant: info',
    () => render({header: 'info', variant: 'info'})
  )
  .add(
    'variant: help',
    () => render({header: 'help', variant: 'help'})
  )
  .add(
    'variant: success',
    () => render({header: 'success', variant: 'success'})
  )
  .add(
    'variant: error',
    () => render({header: 'error', variant: 'error'})
  )
  .add(
    'variant: warning',
    () => render({header: 'warning', variant: 'warning'})
  )
  .add(
    'aria-live: polite',
    () => render({header: 'error', variant: 'error', 'aria-live': 'polite'})
  )
  .add(
    'aria-live: off',
    () => render({header: 'error', variant: 'error', 'aria-live': 'off'})
  );

function render(props = {}, children = 'This is a React Spectrum alert') {
  return (
    <Alert
      {...props}>
      {children}
    </Alert>
  );
}
