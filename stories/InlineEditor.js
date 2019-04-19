import {action} from '@storybook/addon-actions';
import InlineEditor from '../src/InlineEditor';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('InlineEditor', module)
  .add(
    'Default',
    () => <InlineEditor defaultValue="test" onChange={action('onChange')} />
  )
  .add(
    'disabled',
    () => <InlineEditor defaultValue="test" disabled onChange={action('onChange')} />
  )
  .add(
    'controlled',
    () => <InlineEditor value="test" onChange={action('onChange')} />
  )
  .add(
    'validate',
    () => (<InlineEditor
      defaultValue="0000000000"
      placeholder="Enter 10 digit cell no"
      onChange={(value) => {
        action('onChange')(value);
        return RegExp(/^\d{10}$/).test(value);
      }} />)
  );
