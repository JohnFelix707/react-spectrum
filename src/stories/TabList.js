import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { VerticalCenter } from '../../.storybook/layout';

import TabList from '../TabList';
import Tab from '../Tab';

storiesOf('TabList', module)
  .addDecorator(story => (
    <VerticalCenter style={ { textAlign: 'left', margin: '0 100px' } }>
      { story() }
    </VerticalCenter>
  ))
  .add('Default', () => render())
  .add('defaultSelectedKey: 1', () => render({ defaultSelectedKey: '1' }))
  .add('selectedKey: 1', () => render({ selectedKey: '1' }))
  .add('size: L', () => render({ size: 'L' }))
  .add('orientation: vertical', () => render({ orientation: 'vertical' }))
  .add('orientation: vertical, size: L', () => render({ orientation: 'vertical', size: 'L' }));

function render(props = {}) {
  return (
    <TabList { ...props } onChange={ action('onChange') }>
      <Tab>Tab 1</Tab>
      <Tab selected>Tab 2</Tab>
    </TabList>
  );
}
