/*
 * Copyright 2020 Adobe. All rights reserved.
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
import {ActionButton} from '@react-spectrum/button';
import {Cell, Column, Row, SpectrumTableProps, TableBody, TableHeader, TableView} from '../';
import {chain} from '@react-aria/utils';
import {ComponentMeta} from '@storybook/react';
import defaultConfig, {columns, TableStory} from './Table.stories';
import {enableTableNestedRows} from '@react-stately/flags';
import {Flex} from '@react-spectrum/layout';
import React, {Key, useState} from 'react';

enableTableNestedRows();

export default {
  ...defaultConfig,
  title: 'TableView/Expandable rows'
} as ComponentMeta<typeof TableView>;

// TODO: add stories with variable expandedKeys (will need to wait for toggle functionality)
export const StaticExpandableRows: TableStory = {
  args: {
    'aria-label': 'TableView with static expandable rows',
    width: 500,
    height: 200
  },
  render: (args) => (
    <TableView defaultExpandedKeys={['row 1']} hasExpandableRows onExpandedChange={action('onExpandedChange')} {...args}>
      <TableHeader>
        <Column key="foo">Foo</Column>
        <Column key="bar">Bar</Column>
        <Column key="baz">Baz</Column>
      </TableHeader>
      <TableBody>
        <Row key="row 1">
          <Cell>Lvl 1 Foo 1</Cell>
          <Cell>Lvl 1 Bar 1</Cell>
          <Cell> Lvl 1 Baz 1</Cell>
          <Row key="child row 1 level 2">
            <Cell>Lvl 2 Foo 1</Cell>
            <Cell>Lvl 2 Bar 1</Cell>
            <Cell>Lvl 2 Baz 1</Cell>
            <Row key="child row 1 level 3">
              <Cell>Lvl 3 Foo 1</Cell>
              <Cell>Lvl 3 Bar 1</Cell>
              <Cell>Lvl 3 Baz 1</Cell>
            </Row>
          </Row>
          <Row key="child row 2 level 2">
            <Cell>Lvl 2 Foo 2</Cell>
            <Cell>Lvl 2 Bar 2</Cell>
            <Cell>Lvl 2 Baz 2</Cell>
          </Row>
        </Row>
      </TableBody>
    </TableView>
  ),
  name: 'static with expandable rows'
};

let nestedItems = [
  {foo: 'Lvl 1 Foo 1', bar: 'Lvl 1 Bar 1', baz: 'Lvl 1 Baz 1', childRows: [
    {foo: 'Lvl 2 Foo 1', bar: 'Lvl 2 Bar 1', baz: 'Lvl 2 Baz 1', childRows: [
      {foo: 'Lvl 3 Foo 1', bar: 'Lvl 3 Bar 1', baz: 'Lvl 3 Baz 1'}
    ]},
    {foo: 'Lvl 2 Foo 2', bar: 'Lvl 2 Bar 2', baz: 'Lvl 2 Baz 2'}
  ]}
];

function DynamicExpandableRows(props: SpectrumTableProps<unknown>) {
  let [expandedKeys, setExpandedKeys] = useState<'all' | Set<Key>>('all');

  return (
    <Flex direction="column">
      <ActionButton onPress={() => setExpandedKeys('all')}>Expand all</ActionButton>
      <ActionButton onPress={() => setExpandedKeys(new Set([]))}>Collapse all</ActionButton>
      <ActionButton onPress={() => setExpandedKeys(new Set(['Lvl 1 Foo 1']))}>Set expanded to Lvl 1 Foo 1</ActionButton>
      <TableView expandedKeys={expandedKeys} onExpandedChange={chain(setExpandedKeys, action('onExpandedChange'))} hasExpandableRows {...props}>
        <TableHeader columns={columns}>
          {column => <Column>{column.name}</Column>}
        </TableHeader>
        <TableBody items={nestedItems}>
          {item =>
            (<Row key={item.foo} childItems={item.childRows}>
              {(key) => {
                // Note: The "item" here will reflect the child Row's values from nestedItems
                return <Cell>{item[key]}</Cell>;
              }}
            </Row>)
          }
        </TableBody>
      </TableView>
    </Flex>
  );
}

export const DynamicExpandableRowsStory: TableStory = {
  args: {
    'aria-label': 'TableView with dynamic expandable rows',
    width: 500,
    height: 400
  },
  render: (args) => (
    <DynamicExpandableRows {...args} />
  ),
  name: 'dynamic with expandable rows'
};

export const UserSetRowHeader: TableStory = {
  args: {
    'aria-label': 'TableView with expandable rows and multiple row headers',
    width: 500,
    height: 400
  },
  render: (args) => (
    <TableView hasExpandableRows onExpandedChange={action('onExpandedChange')} {...args}>
      <TableHeader>
        <Column key="foo">Foo</Column>
        <Column isRowHeader key="bar">Bar</Column>
        <Column isRowHeader key="baz">Baz</Column>
      </TableHeader>
      <TableBody>
        <Row key="test">
          <Cell>Lvl 1 Foo 1</Cell>
          <Cell>Lvl 1 Bar 1</Cell>
          <Cell>Lvl 1 Baz 1</Cell>
          <Row>
            <Cell>Lvl 2 Foo 1</Cell>
            <Cell>Lvl 2 Bar 1</Cell>
            <Cell>Lvl 2 Baz 1</Cell>
            <Row>
              <Cell>Lvl 3 Foo 1</Cell>
              <Cell>Lvl 3 Bar 1</Cell>
              <Cell>Lvl 3 Baz 1</Cell>
            </Row>
          </Row>
          <Row>
            <Cell>Lvl 2 Foo 2</Cell>
            <Cell>Lvl 2 Bar 2</Cell>
            <Cell>Lvl 2 Baz 2</Cell>
          </Row>
        </Row>
      </TableBody>
    </TableView>
  ),
  name: 'multiple user set row headers',
  parameters: {
    description: {
      data: 'Row headers are Bar and Baz column cells, chevron'
    }
  }
};

let manyRows = [];
function generateRow(lvlIndex, lvlLimit, rowIndex) {
  let row = {key: `Row ${rowIndex} Lvl ${lvlIndex}`};
  for (let col of columns) {
    row[col.key] = `Row ${rowIndex}, Lvl ${lvlIndex}, ${col.name}`;
  }

  if (lvlIndex < lvlLimit) {
    row['childRows'] = [generateRow(++lvlIndex, lvlLimit, rowIndex)];
  }
  return row;
}

for (let i = 1; i < 20; i++) {
  let row = generateRow(1, 3, i);
  manyRows.push(row);
}

function ManyExpandableRows(props: SpectrumTableProps<unknown>) {
  let [expandedKeys, setExpandedKeys] = useState<'all' | Set<Key>>('all');
  return (
    <Flex direction="column">
      <ActionButton onPress={() => setExpandedKeys('all')}>Expand all</ActionButton>
      <ActionButton onPress={() => setExpandedKeys(new Set([]))}>Collapse all</ActionButton>
      <TableView expandedKeys={expandedKeys} onExpandedChange={chain(setExpandedKeys, action('onExpandedChange'))} hasExpandableRows disabledKeys={['Row 1 Lvl 2']} {...props}>
        <TableHeader columns={columns}>
          {column => <Column>{column.name}</Column>}
        </TableHeader>
        <TableBody items={manyRows}>
          {item =>
            (<Row key={item.key} childItems={item.childRows}>
              {(key) => {
                return <Cell>{item[key]}</Cell>;
              }}
            </Row>)
          }
        </TableBody>
      </TableView>
    </Flex>
  );
}
export const ManyExpandableRowsStory: TableStory = {
  args: {
    'aria-label': 'TableView with many dynamic expandable rows',
    width: 500,
    height: 400
  },
  render: (args) => (
    <ManyExpandableRows {...args} />
  ),
  name: 'many expandable rows'
};


// TODO: make sorting example? empty state table, nested columns, icons in cells, resizeable column headers, loading story, dividers
