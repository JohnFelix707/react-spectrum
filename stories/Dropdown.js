import {action, storiesOf} from '@storybook/react';
import Button from '../src/Button';
import Dropdown from '../src/Dropdown';
import {Menu, MenuItem} from '../src/Menu';
import React from 'react';
import {VerticalCenter} from '../.storybook/layout';

storiesOf('Dropdown', module)
  .addDecorator(story => (
    <VerticalCenter style={{textAlign: 'left', margin: '0 100px 50px', position: 'static', transform: 'none'}}>
      {story()}
    </VerticalCenter>
  ))
  .addWithInfo(
    'Default',
    () => render(),
    {inline: true}
  )
  .addWithInfo(
    'Stay open on select',
    () => render({closeOnSelect: false}),
    {inline: true}
  );

function render(props = {}) {
  return (
    <Dropdown onSelect={action('select')} {...props}>
      <Button variant="cta">Test</Button>
      <Menu>
        <MenuItem role="menuitemradio" value="foo">Foo</MenuItem>
        <MenuItem role="menuitemradio" value="bar" selected>Bar</MenuItem>
        <MenuItem role="menuitemradio" value="baz">Baz</MenuItem>
      </Menu>
    </Dropdown>
  );
}
