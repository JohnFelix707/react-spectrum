import {action, storiesOf} from '@kadira/storybook';
import {MenuItem} from '../src/Menu';
import React from 'react';
import SplitButton from '../src/SplitButton';
import {VerticalCenter} from '../.storybook/layout';

storiesOf('SplitButton', module)
  .addDecorator(story => (
    <VerticalCenter style={{textAlign: 'left', margin: '0 100px 50px', position: 'static', transform: 'none'}}>
      {story()}
    </VerticalCenter>
  ))
  .addWithInfo(
    'variant: primary',
    () => render({label: 'Action', variant: 'primary'}),
    {inline: true}
  )
  .addWithInfo(
    'variant: secondary',
    () => render({label: 'Action', variant: 'secondary'}),
    {inline: true}
  )
  .addWithInfo(
    'variant: cta',
    () => render({label: 'Action', variant: 'cta'}),
    {inline: true}
  );

function render(props = {}) {
  return (
    <SplitButton {...props} onClick={action('click')} onSelect={action('select')}>
      <MenuItem icon="twitter">Twitter</MenuItem>
      <MenuItem icon="facebook">Facebook</MenuItem>
      <MenuItem icon="instagram">Instagram</MenuItem>
    </SplitButton>
  );
}
