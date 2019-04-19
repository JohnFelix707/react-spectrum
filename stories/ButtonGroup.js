import {action} from '@storybook/addon-actions';
import Add from '../src/Icon/Add';
import Bell from '../src/Icon/Bell';
import Brush from '../src/Icon/Brush';
import Button from '../src/Button';
import ButtonGroup from '../src/ButtonGroup';
import Camera from '../src/Icon/Camera';
import CheckmarkCircle from '../src/Icon/CheckmarkCircle';
import Delete from '../src/Icon/Delete';
import React from 'react';
import RegionSelect from '../src/Icon/RegionSelect';
import Select from '../src/Icon/Select';
import {storiesOf} from '@storybook/react';
import Undo from '../src/Icon/Undo';

const defaultProps = {
  children: [
    <Button label="React" value="react" icon={<CheckmarkCircle />} />,
    <Button label="Add" value="add" icon={<Add />} />,
    <Button label="Delete" value="delete" icon={<Delete />} />,
    <Button label="Bell" value="bell" icon={<Bell />} />,
    <Button label="Camera" value="camera" icon={<Camera />} />,
    <Button label="Undo" value="undo" icon={<Undo />} />
  ]
};

const toolProps = {
  children: [
    <Button variant="tool" value="brush" icon={<Brush />} />,
    <Button variant="tool" value="select" icon={<Select />} />,
    <Button variant="tool" value="regionselect" icon={<RegionSelect />} />
  ]
};

const selectedValue = [
  'delete'
];

storiesOf('ButtonGroup', module)
  .add(
    'Default',
    () => (render({...defaultProps}))
  )
  .add(
    'Vertical',
    () => (render({orientation: 'vertical'}))
  )
  .add(
    'multiple selection',
    () => (render({multiple: true}))
  )
  .add(
    'disabled: true',
    () => (render({value: selectedValue, multiple: true, disabled: true}))
  )
  .add(
    'readOnly: true',
    () => (render({readOnly: true, onClick: action('click')}))
  )
  .add(
    'readOnly: true (vertical)',
    () => (render({readOnly: true, orientation: 'vertical', onClick: action('click')}))
  )
  .add(
    'Tool',
    () => (render({...toolProps}))
  )
  .add(
    'Tool (vertical)',
    () => (render({orientation: 'vertical', ...toolProps}))
  );

function render(props = {}) {
  return (
    <ButtonGroup
      style={{textAlign: 'left'}}
      aria-label="ButtonGroup"
      onChange={action('change')}
      {...defaultProps}
      {...props} />
  );
}
