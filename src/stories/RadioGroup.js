import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import RadioGroup from '../RadioGroup';
import Radio from '../Radio';

storiesOf('RadioGroup', module)
  .add('Default', () => render())
  .add('labelsBelow: true', () => render({ labelsBelow: true }))
  .add('vertical: true', () => render({ vertical: true }));

function render(props = {}) {
  return (
    <RadioGroup name="foo-group" onChange={ action('change') } { ...props }>
      <Radio label="1" value="1" />
      <Radio label="2" value="2" />
      <Radio label="3" value="3" />
    </RadioGroup>
  );
}
