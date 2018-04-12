import {action, storiesOf} from '@storybook/react';
import React from 'react';
import Select from '../src/Select';
import {VerticalCenter} from '../.storybook/layout';
import {withKnobs} from '@storybook/addon-knobs';

const defaultProps = {
  options: [
    {label: 'Chocolate', value: 'chocolate'},
    {label: 'Vanilla', value: 'vanilla'},
    {label: 'Strawberry', value: 'strawberry'},
    {label: 'Caramel', value: 'caramel'},
    {label: 'Cookies and Cream', value: 'cookiescream'},
    {label: 'Peppermint', value: 'peppermint'},
    {label: 'Some crazy long value that should be cut off', value: 'logVal'}
  ]
};

const selectedValue = [
  'chocolate',
  'vanilla',
  'logVal'
];

storiesOf('Select', module)
  .addDecorator(story => (
    <VerticalCenter style={{textAlign: 'left', margin: '0 100px 50px', position: 'static', transform: 'none'}}>
      {story()}
    </VerticalCenter>
  ))
  .addDecorator(withKnobs)
  .addWithInfo(
    'Default',
    () => render({...defaultProps}),
    {inline: true}
  )
  .addWithInfo(
    'placeholder: other placeholder',
    () => render({placeholder: 'other placeholder'}),
    {inline: true}
  )
  .addWithInfo(
    'quiet',
    () => render({quiet: true}),
    {inline: true}
  )
  .addWithInfo(
    'quiet, value: longVal',
    () => render({quiet: true, value: 'logVal'}),
    {inline: true}
  )
  .addWithInfo(
    'quiet multiple',
    () => render({quiet: true, multiple: true, value: selectedValue}),
    {inline: true}
  )
  .addWithInfo(
    'quiet disabled',
    () => render({quiet: true, disabled: true}),
    {inline: true}
  )
  .addWithInfo(
    'multiple: true',
    () => render({multiple: true, defaultValue: selectedValue}),
    {inline: true}
  )
  .addWithInfo(
    'required: true',
    () => render({required: true}),
    {inline: true}
  )
  .addWithInfo(
    'disabled: true',
    () => render({disabled: true}),
    {inline: true}
  )
  .addWithInfo(
    'invalid: true',
    () => render({invalid: true}),
    {inline: true}
  )
  .addWithInfo(
    'multiple disabled: true',
    () => render({disabled: true, multiple: true, value: selectedValue}),
    {inline: true}
  )
  .addWithInfo(
    'value: longVal',
    () => render({value: 'logVal'}),
    {inline: true}
  )
  .addWithInfo(
    'Stay open on select',
    () => render({closeOnSelect: false}),
    {inline: true}
  );

function render(props = {}) {
  return (
    <Select
      onChange={action('change')}
      onOpen={action('open')}
      onClose={action('close')}
      {...defaultProps}
      {...props} />
  );
}
