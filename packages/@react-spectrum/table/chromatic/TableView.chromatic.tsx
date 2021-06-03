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


import {Cell, Column, Row, TableBody, TableHeader, TableView} from '../';
import {Content} from '@react-spectrum/view';
import {Grid, repeat} from '@react-spectrum/layout';
import {Heading} from '@react-spectrum/text';
import {IllustratedMessage} from '@react-spectrum/illustratedmessage';
import {mergeProps} from '@react-aria/utils';
import {Meta, Story} from '@storybook/react';
import React from 'react';
import {SpectrumTableProps} from '@react-types/table';
import {View} from '@react-spectrum/view';

let states = [
  {isQuiet: true},
  {overflowMode: 'wrap'},
  {selectionMode: ['multiple', 'single']},
  {density: ['compact', 'spacious']}
];

// Generate a powerset of the options
let combinations: any[] = [{}];
for (let i = 0; i < states.length; i++) {
  let len = combinations.length;
  for (let j = 0; j < len; j++) {
    if (states[i].selectionMode) {
      states[i].selectionMode.forEach(mode => {
        let merged = mergeProps(combinations[j], {selectionMode: mode});
        combinations.push(merged);
      });
    } else if (states[i].density) {
      states[i].density.forEach(density => {
        let merged = mergeProps(combinations[j], {density: density});
        combinations.push(merged);
      });
    } else {
      let merged = mergeProps(combinations[j], states[i]);
      combinations.push(merged);
    }
  }
}

function shortName(key, value) {
  let returnVal = '';
  switch (key) {
    case 'isQuiet':
      returnVal = 'quiet';
      break;
    case 'overflowMode':
      returnVal = 'wrap';
      break;
    case 'selectionMode':
      returnVal = `sm: ${value === undefined ? 'none' : value}`;
      break;
    case 'density':
      returnVal = `den: ${value === undefined ? 'regular' : value}`;
      break;
  }
  return returnVal;
}

const meta: Meta<SpectrumTableProps<object>> = {
  title: 'TableView',
  component: TableView,
  parameters: {
    chromaticProvider: {colorSchemes: ['light'], locales: ['en-US'], scales: ['medium'], disableAnimations: true},
    // large delay with the layout since there are so many tables
    chromatic: {delay: 2000}
  }
};

export default meta;

let columns = [
  {name: 'Foo', key: 'foo'},
  {name: 'Bar', key: 'bar'},
  {name: 'Baz', key: 'baz'}
];

let alignColumns = [
  {name: 'Foo', key: 'foo', align: 'end'},
  {name: 'Bar', key: 'bar', align: 'center'},
  {name: 'Baz', key: 'baz', align: 'start'}
];

let dividerColumns = [
  {name: 'Foo', key: 'foo', showDivider: true},
  {name: 'Bar', key: 'bar', showDivider: true},
  {name: 'Baz', key: 'baz', showDivider: true}
];

let customWidth = [
  {name: 'Foo', key: 'foo', width: 150},
  {name: 'Bar', key: 'bar', width: 100},
  {name: 'Baz', key: 'baz'}
];

let hiddenColumns = [
  {name: 'Foo', key: 'foo'},
  {name: 'Bar', key: 'bar'},
  {name: 'Baz', key: 'baz', hideHeader: true}
];

let nestedColumns = [
  {name: 'Tiered One Header', key: 'tier1', children: [
    {name: 'Tier Two Header A', key: 'tier2a', children: [
      {name: 'Foo', key: 'foo'},
      {name: 'Bar', key: 'bar'}
    ]},
    {name: 'Tier Two Header B', key: 'tier2b', children: [
      {name: 'Baz', key: 'baz'}
    ]}
  ]}
];

let items = [
  {foo: 'Foo 1', bar: 'Baaaaaaaaaar 1', baz: 'Baz 1'},
  {foo: 'Foo 2', bar: 'Baaaaaaaaaar 2', baz: 'Baz 2'},
  {foo: 'Foo 3', bar: 'Baaaaaaaaaar 3', baz: 'Baz 1'},
  {foo: 'Foo 4', bar: 'Baaaaaaaaaar 4', baz: 'Baz 2'},
  {foo: 'Foo 5', bar: 'Baaaaaaaaaar 5', baz: 'Baz 1'},
  {foo: 'Foo 6', bar: 'Baaaaaaaaaar 6', baz: 'Baz 2'},
  {foo: 'Foo 7', bar: 'Baaaaaaaaaar 7', baz: 'Baz 1'},
  {foo: 'Foo 8', bar: 'Baaaaaaaaaar 8', baz: 'Baz 2'}
];

const Template = (): Story => ({columns, items, ...args}) => (
  <Grid columns={repeat(3, '1fr')} autoFlow="row" gap="size-300">
    {combinations.map(c => {
      let key = Object.keys(c).map(k => shortName(k, c[k])).join(' ');
      if (!key) {
        key = 'empty';
      }
      return (
        <View flexGrow={1} maxWidth="size-5000" maxHeight={700}>
          <TableView {...args} {...c} width="100%" height="100%" key={key} selectedKeys={['Foo 3', 'Foo 1']} disabledKeys={['Foo 2', 'Foo 4']}>
            <TableHeader columns={columns}>
              {(column: any) => (
                <Column key={column.key} width={column.width} showDivider={column.showDivider} align={column.align} hideHeader={column.hideHeader} childColumns={column.children}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item: any) =>
                (<Row key={item.foo}>
                  {key => <Cell>{item[key]}</Cell>}
                </Row>)
              }
            </TableBody>
          </TableView>
        </View>
      );
    })}
  </Grid>
);

function renderEmptyState() {
  return (
    <IllustratedMessage>
      <svg width="150" height="103" viewBox="0 0 150 103">
        <path d="M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z" />
      </svg>
      <Heading>No results</Heading>
      <Content>No results found</Content>
    </IllustratedMessage>
  );
}

const EmptyTemplate = (): Story => (args) => (
  <TableView {...args} maxWidth={700} height={400} renderEmptyState={renderEmptyState}>
    <TableHeader columns={columns}>
      {(column: any) => (
        <Column key={column.key} width={column.width} showDivider={column.showDivider} align={column.align}>
          {column.name}
        </Column>
      )}
    </TableHeader>
    <TableBody>
      {[]}
    </TableBody>
  </TableView>
);

export const Default = Template().bind({});
Default.storyName = 'default items and columns';
Default.args = {columns, items};

export const ColumnAlign = Template().bind({});
ColumnAlign.storyName = 'column alignment';
ColumnAlign.args = {columns: alignColumns, items};

export const ColumnDividers = Template().bind({});
ColumnDividers.storyName = 'columns dividers';
ColumnDividers.args = {columns: dividerColumns, items};

export const ColumnWidth = Template().bind({});
ColumnWidth.storyName = 'columns widths';
ColumnWidth.args = {columns: customWidth, items};

export const HiddenColumns = Template().bind({});
HiddenColumns.storyName = 'hidden columns';
HiddenColumns.args = {columns: hiddenColumns, items};

export const NestedColumns = Template().bind({});
NestedColumns.storyName = 'nested columns';
NestedColumns.args = {columns: nestedColumns, items};

export const Empty = EmptyTemplate().bind({});
Empty.storyName = 'empty table';
Empty.args = {};
