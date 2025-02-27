/**
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {action} from '@storybook/addon-actions';
import {
  ActionMenu,
  Collection,
  Content,
  Heading,
  IllustratedMessage,
  Link,
  MenuItem,
  Text,
  TreeView,
  TreeViewItem,
  TreeViewItemContent
} from '../src';
import {categorizeArgTypes} from './utils';
import Delete from '../s2wf-icons/S2_Icon_Delete_20_N.svg';
import Edit from '../s2wf-icons/S2_Icon_Edit_20_N.svg';
import FileTxt from '../s2wf-icons/S2_Icon_FileText_20_N.svg';
import Folder from '../s2wf-icons/S2_Icon_Folder_20_N.svg';
import FolderOpen from '../spectrum-illustrations/linear/FolderOpen';
import type {Meta} from '@storybook/react';
import React from 'react';

let onActionFunc = action('onAction');
let noOnAction = null;
const onActionOptions = {onActionFunc, noOnAction};


const meta: Meta<typeof TreeView> = {
  component: TreeView,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    // Make sure onAction isn't autogenerated
    // @ts-ignore
    onAction: null
  },
  argTypes: {
    ...categorizeArgTypes('Events', ['onAction', 'onSelectionChange']),
    onAction: {
      options: Object.keys(onActionOptions), // An array of serializable values
      mapping: onActionOptions, // Maps serializable option values to complex arg values
      control: {
        type: 'select', // Type 'select' is automatically inferred when 'options' is defined
        labels: {
          // 'labels' maps option values to string labels
          onActionFunc: 'onAction enabled',
          noOnAction: 'onAction disabled'
        }
      },
      table: {category: 'Events'}
    }
  }
};

export default meta;


const TreeExampleStatic = (args) => (
  <div style={{width: '300px', resize: 'both', height: '320px', overflow: 'auto'}}>
    <TreeView
      {...args}
      disabledKeys={['projects-1']}
      aria-label="test static tree"
      onExpandedChange={action('onExpandedChange')}
      onSelectionChange={action('onSelectionChange')}>
      <TreeViewItem id="Photos" textValue="Photos">
        <TreeViewItemContent>
          <Text>Photos</Text>
          <Folder />
          <ActionMenu onAction={action('onActionGroup action')}>
            <MenuItem id="edit">
              <Edit />
              <Text>Edit</Text>
            </MenuItem>
            <MenuItem id="delete">
              <Delete />
              <Text>Delete</Text>
            </MenuItem>
          </ActionMenu>
        </TreeViewItemContent>
      </TreeViewItem>
      <TreeViewItem id="projects" textValue="Projects">
        <TreeViewItemContent>
          <Text>Projects</Text>
          <Folder />
          <ActionMenu onAction={action('onActionGroup action')}>
            <MenuItem id="edit">
              <Edit />
              <Text>Edit</Text>
            </MenuItem>
            <MenuItem id="delete">
              <Delete />
              <Text>Delete</Text>
            </MenuItem>
          </ActionMenu>
        </TreeViewItemContent>
        <TreeViewItem id="projects-1" textValue="Projects-1">
          <TreeViewItemContent>
            <Text>Projects-1</Text>
            <Folder />
            <ActionMenu onAction={action('onActionGroup action')}>
              <MenuItem id="edit">
                <Edit />
                <Text>Edit</Text>
              </MenuItem>
              <MenuItem id="delete">
                <Delete />
                <Text>Delete</Text>
              </MenuItem>
            </ActionMenu>
          </TreeViewItemContent>
          <TreeViewItem id="projects-1A" textValue="Projects-1A">
            <TreeViewItemContent>
              <Text>Projects-1A</Text>
              <FileTxt />
              <ActionMenu onAction={action('onActionGroup action')}>
                <MenuItem id="edit">
                  <Edit />
                  <Text>Edit</Text>
                </MenuItem>
                <MenuItem id="delete">
                  <Delete />
                  <Text>Delete</Text>
                </MenuItem>
              </ActionMenu>
            </TreeViewItemContent>
          </TreeViewItem>
        </TreeViewItem>
        <TreeViewItem id="projects-2" textValue="Projects-2">
          <TreeViewItemContent>
            <Text>Projects-2</Text>
            <FileTxt />
            <ActionMenu onAction={action('onActionGroup action')}>
              <MenuItem id="edit">
                <Edit />
                <Text>Edit</Text>
              </MenuItem>
              <MenuItem id="delete">
                <Delete />
                <Text>Delete</Text>
              </MenuItem>
            </ActionMenu>
          </TreeViewItemContent>
        </TreeViewItem>
        <TreeViewItem id="projects-3" textValue="Projects-3">
          <TreeViewItemContent>
            <Text>Projects-3</Text>
            <FileTxt />
            <ActionMenu onAction={action('onActionGroup action')}>
              <MenuItem id="edit">
                <Edit />
                <Text>Edit</Text>
              </MenuItem>
              <MenuItem id="delete">
                <Delete />
                <Text>Delete</Text>
              </MenuItem>
            </ActionMenu>
          </TreeViewItemContent>
        </TreeViewItem>
      </TreeViewItem>
    </TreeView>
  </div>
);

export const Example = {
  render: TreeExampleStatic,
  args: {
    selectionMode: 'multiple'
  }
};

let rows = [
  {id: 'projects', name: 'Projects', icon: <Folder />, childItems: [
    {id: 'project-1', name: 'Project 1 Level 1', icon: <FileTxt />},
    {id: 'project-2', name: 'Project 2 Level 1', icon: <Folder />, childItems: [
      {id: 'project-2A', name: 'Project 2A Level 2', icon: <FileTxt />},
      {id: 'project-2B', name: 'Project 2B Level 2', icon: <FileTxt />},
      {id: 'project-2C', name: 'Project 2C Level 3', icon: <FileTxt />}
    ]},
    {id: 'project-3', name: 'Project 3', icon: <FileTxt />},
    {id: 'project-4', name: 'Project 4', icon: <FileTxt />},
    {id: 'project-5', name: 'Project 5', icon: <Folder />, childItems: [
      {id: 'project-5A', name: 'Project 5A', icon: <FileTxt />},
      {id: 'project-5B', name: 'Project 5B', icon: <FileTxt />},
      {id: 'project-5C', name: 'Project 5C', icon: <FileTxt />}
    ]}
  ]},
  {id: 'reports', name: 'Reports', icon: <Folder />, childItems: [
    {id: 'reports-1', name: 'Reports 1', icon: <Folder />, childItems: [
      {id: 'reports-1A', name: 'Reports 1A', icon: <Folder />, childItems: [
        {id: 'reports-1AB', name: 'Reports 1AB', icon: <Folder />, childItems: [
          {id: 'reports-1ABC', name: 'Reports 1ABC', icon: <FileTxt />}
        ]}
      ]},
      {id: 'reports-1B', name: 'Reports 1B', icon: <FileTxt />},
      {id: 'reports-1C', name: 'Reports 1C', icon: <FileTxt />}
    ]},
    {id: 'reports-2', name: 'Reports 2', icon: <FileTxt />},
    ...Array.from({length: 100}, (_, i) => ({id: `reports-repeat-${i}`, name: `Reports ${i}`, icon: <FileTxt />}))
  ]}
];

const DynamicTreeItem = (props) => {
  let {childItems, name, icon} = props;
  return (
    <>
      <TreeViewItem id={props.id} textValue={name} href={props.href}>
        <TreeViewItemContent>
          <Text>{name}</Text>
          {icon}
          <ActionMenu onAction={action('onActionGroup action')}>
            <MenuItem id="edit">
              <Edit />
              <Text>Edit</Text>
            </MenuItem>
            <MenuItem id="delete">
              <Delete />
              <Text>Delete</Text>
            </MenuItem>
          </ActionMenu>
        </TreeViewItemContent>
        <Collection items={childItems}>
          {(item: any) => (
            <DynamicTreeItem
              id={item.id}
              icon={item.icon}
              childItems={item.childItems}
              textValue={item.name}
              name={item.name}
              href={props.href}>
              {item.name}
            </DynamicTreeItem>
          )}
        </Collection>
      </TreeViewItem>
    </>
  );
};

const TreeExampleDynamic = (args) => (
  <div style={{width: '300px', resize: 'both', height: '320px', overflow: 'auto', display: 'flex', flexDirection: 'column'}}>
    <TreeView disabledKeys={['reports-1AB']} aria-label="test dynamic tree" items={rows} onExpandedChange={action('onExpandedChange')} onSelectionChange={action('onSelectionChange')} {...args}>
      {(item: any) => (
        <DynamicTreeItem
          id={item.id}
          icon={item.icon}
          childItems={item.childItems}
          textValue={item.name}
          name={item.name} />
      )}
    </TreeView>
  </div>
);

export const Dynamic = {
  render: TreeExampleDynamic,
  args: {
    ...Example.args,
    disabledKeys: ['project-2C', 'project-5']
  }
};

function renderEmptyState() {
  return (
    <IllustratedMessage>
      <FolderOpen />
      <Heading>
        No results
      </Heading>
      <Content>
        <Content>No results found, press <Link href="https://adobe.com" onPress={action('linkPress')}>here</Link> for more info.</Content>
      </Content>
    </IllustratedMessage>
  );
}

export const Empty = {
  render: TreeExampleDynamic,
  args: {
    renderEmptyState,
    items: []
  }
};

const TreeExampleWithLinks = (args) => (
  <div style={{width: '300px', resize: 'both', height: '320px', overflow: 'auto'}}>
    <TreeView {...args} disabledKeys={['reports-1AB']} aria-label="test dynamic tree" items={rows} onExpandedChange={action('onExpandedChange')} onSelectionChange={action('onSelectionChange')}>
      {(item) => (
        <DynamicTreeItem
          id={item.id}
          icon={item.icon}
          childItems={item.childItems}
          textValue={item.name}
          name={item.name}
          href="https://adobe.com/" />
      )}
    </TreeView>
  </div>
);

export const WithLinks = {
  ...Dynamic,
  render: TreeExampleWithLinks,
  name: 'Tree with links',
  parameters: {
    description: {
      data: 'every tree item should link to adobe.com'
    }
  }
};
