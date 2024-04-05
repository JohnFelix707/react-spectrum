/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {act, fireEvent, mockClickDefault, pointerMap, render, within} from '@react-spectrum/test-utils-internal';
import {Button, Checkbox, Collection, Text, Tree, TreeItem, TreeItemContent} from '../';
import React from 'react';
import userEvent from '@testing-library/user-event';

let onSelectionChange = jest.fn();
let onAction = jest.fn();
let onExpandedChange = jest.fn();

let StaticTreeItem = (props) => {
  return (
    <TreeItem {...props}>
      <TreeItemContent>
        {({isExpanded, hasChildRows, selectionMode, selectionBehavior}) => (
          <>
            {(selectionMode === 'multiple' || props.href != null) && selectionBehavior === 'toggle' && (
              <Checkbox slot="selection" />
            )}
            {hasChildRows && <Button slot="chevron">{isExpanded ? '⏷' : '⏵'}</Button>}
            <Text>{props.title || props.children}</Text>
            <Button aria-label="Info">ⓘ</Button>
            <Button aria-label="Menu">☰</Button>
          </>
        )}
      </TreeItemContent>
      {props.title && props.children}
    </TreeItem>
  );
};

let StaticTree = ({treeProps = {}, rowProps = {}}) => (
  <Tree defaultExpandedKeys="all" aria-label="test tree" onExpandedChange={onExpandedChange} onSelectionChange={onSelectionChange} {...treeProps}>
    <StaticTreeItem id="Photos" textValue="Photos" {...rowProps}>Photos</StaticTreeItem>
    <StaticTreeItem id="projects" textValue="Projects" title="Projects" {...rowProps}>
      <StaticTreeItem id="projects-1" textValue="Projects-1" title="Projects-1" {...rowProps}>
        <StaticTreeItem id="projects-1A" textValue="Projects-1A" {...rowProps}>
          Projects-1A
        </StaticTreeItem>
      </StaticTreeItem>
      <StaticTreeItem id="projects-2" textValue="Projects-2" {...rowProps}>
        Projects-2
      </StaticTreeItem>
      <StaticTreeItem id="projects-3" textValue="Projects-3" {...rowProps}>
        Projects-3
      </StaticTreeItem>
    </StaticTreeItem>
  </Tree>
);

let rows = [
  {id: 'projects', name: 'Projects', childItems: [
    {id: 'project-1', name: 'Project 1'},
    {id: 'project-2', name: 'Project 2', childItems: [
      {id: 'project-2A', name: 'Project 2A'},
      {id: 'project-2B', name: 'Project 2B'},
      {id: 'project-2C', name: 'Project 2C'}
    ]},
    {id: 'project-3', name: 'Project 3'},
    {id: 'project-4', name: 'Project 4'},
    {id: 'project-5', name: 'Project 5', childItems: [
      {id: 'project-5A', name: 'Project 5A'},
      {id: 'project-5B', name: 'Project 5B'},
      {id: 'project-5C', name: 'Project 5C'}
    ]}
  ]},
  {id: 'reports', name: 'Reports', childItems: [
    {id: 'reports-1', name: 'Reports 1', childItems: [
      {id: 'reports-1A', name: 'Reports 1A', childItems: [
        {id: 'reports-1AB', name: 'Reports 1AB', childItems: [
          {id: 'reports-1ABC', name: 'Reports 1ABC'}
        ]}
      ]},
      {id: 'reports-1B', name: 'Reports 1B'},
      {id: 'reports-1C', name: 'Reports 1C'}
    ]},
    {id: 'reports-2', name: 'Reports 2'}
  ]}
];

let DynamicTreeItem = (props) => {
  return (
    <TreeItem {...props}>
      <TreeItemContent>
        {({isExpanded, hasChildRows, selectionMode, selectionBehavior}) => (
          <>
            {(selectionMode === 'multiple' || props.href != null) && selectionBehavior === 'toggle' && (
              <Checkbox slot="selection" />
            )}
            {hasChildRows && <Button slot="chevron">{isExpanded ? '⏷' : '⏵'}</Button>}
            <Text>{props.title || props.children}</Text>
            <Button aria-label="Info">ⓘ</Button>
            <Button aria-label="Menu">☰</Button>
          </>
        )}
      </TreeItemContent>
      <Collection items={props.childItems}>
        {(item: any) => (
          <DynamicTreeItem childItems={item.childItems} textValue={item.name} href={props.href}>
            {item.name}
          </DynamicTreeItem>
        )}
      </Collection>
    </TreeItem>
  );
};

let DynamicTree = ({treeProps = {}, rowProps = {}}) => (
  <Tree defaultExpandedKeys="all" aria-label="test dynamic tree" items={rows} onExpandedChange={onExpandedChange} onSelectionChange={onSelectionChange} {...treeProps}>
    {(item: any) => (
      <DynamicTreeItem childItems={item.childItems} textValue={item.name} {...rowProps}>
        {item.name}
      </DynamicTreeItem>
    )}
  </Tree>
);

describe('Tree', () => {
  let user;

  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    act(() => {jest.runAllTimers();});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render a Tree with default classes', () => {
    let {getByRole, getAllByRole} = render(<StaticTree />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('class', 'react-aria-Tree');

    for (let row of getAllByRole('row')) {
      expect(row).toHaveAttribute('class', 'react-aria-TreeItem');
    }
  });

  it('should render a Tree with custom classes', () => {
    let {getByRole, getAllByRole} = render(<StaticTree treeProps={{className: 'test-tree'}} rowProps={{className: 'test-row'}} />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('class', 'test-tree');

    for (let row of getAllByRole('row')) {
      expect(row).toHaveAttribute('class', 'test-row');
    }
  });

  it('should support DOM props', () => {
    let {getByRole, getAllByRole} = render(<StaticTree treeProps={{'data-testid': 'test-tree'}} rowProps={{'data-testid': 'test-row'}} />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('data-testid', 'test-tree');

    for (let row of getAllByRole('row')) {
      expect(row).toHaveAttribute('data-testid', 'test-row');
    }
  });

  it('should support style', () => {
    let {getByRole} = render(<StaticTree treeProps={{style: {width: 200}}} />);

    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('style', expect.stringContaining('width: 200px'));
  });

  it('should have the base set of aria and data attributes', () => {
    let {getByRole, getAllByRole} = render(<StaticTree treeProps={{defaultExpandedKeys: 'none'}} />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('data-rac');
    expect(tree).toHaveAttribute('aria-label', 'test tree');
    expect(tree).not.toHaveAttribute('data-empty');
    expect(tree).not.toHaveAttribute('data-focused');
    expect(tree).not.toHaveAttribute('data-focus-visible');

    for (let row of getAllByRole('row')) {
      expect(row).toHaveAttribute('aria-level');
      expect(row).toHaveAttribute('data-level');
      expect(row).toHaveAttribute('aria-posinset');
      expect(row).toHaveAttribute('aria-setsize');
      expect(row).toHaveAttribute('data-has-child-rows');
      expect(row).toHaveAttribute('data-rac');
      expect(row).not.toHaveAttribute('data-selected');
      expect(row).not.toHaveAttribute('data-disabled');
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveAttribute('data-focused');
      expect(row).not.toHaveAttribute('data-focus-visible');
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveAttribute('data-selection-mode');
    }
  });

  it('should have the expected attributes on the rows', () => {
    let {getAllByRole} = render(<StaticTree />);

    let rows = getAllByRole('row');
    let rowNoChild = rows[0];
    expect(rowNoChild).toHaveAttribute('aria-label', 'Photos');
    expect(rowNoChild).not.toHaveAttribute('aria-expanded');
    expect(rowNoChild).not.toHaveAttribute('data-expanded');
    expect(rowNoChild).toHaveAttribute('aria-level', '1');
    expect(rowNoChild).toHaveAttribute('data-level', '1');
    expect(rowNoChild).toHaveAttribute('aria-posinset', '1');
    expect(rowNoChild).toHaveAttribute('aria-setsize', '2');
    expect(rowNoChild).toHaveAttribute('data-has-child-rows', 'false');
    expect(rowNoChild).toHaveAttribute('data-rac');

    let rowWithChildren = rows[1];
    expect(rowWithChildren).toHaveAttribute('aria-label', 'Projects');
    expect(rowWithChildren).toHaveAttribute('aria-expanded', 'true');
    expect(rowWithChildren).toHaveAttribute('data-expanded', 'true');
    expect(rowWithChildren).toHaveAttribute('aria-level', '1');
    expect(rowWithChildren).toHaveAttribute('data-level', '1');
    expect(rowWithChildren).toHaveAttribute('aria-posinset', '2');
    expect(rowWithChildren).toHaveAttribute('aria-setsize', '2');
    expect(rowWithChildren).toHaveAttribute('data-has-child-rows', 'true');
    expect(rowWithChildren).toHaveAttribute('data-rac');

    let level2ChildRow = rows[2];
    expect(level2ChildRow).toHaveAttribute('aria-label', 'Projects-1');
    expect(level2ChildRow).toHaveAttribute('aria-expanded', 'true');
    expect(level2ChildRow).toHaveAttribute('data-expanded', 'true');
    expect(level2ChildRow).toHaveAttribute('aria-level', '2');
    expect(level2ChildRow).toHaveAttribute('data-level', '2');
    expect(level2ChildRow).toHaveAttribute('aria-posinset', '1');
    expect(level2ChildRow).toHaveAttribute('aria-setsize', '3');
    expect(level2ChildRow).toHaveAttribute('data-has-child-rows', 'true');
    expect(level2ChildRow).toHaveAttribute('data-rac');

    let level3ChildRow = rows[3];
    expect(level3ChildRow).toHaveAttribute('aria-label', 'Projects-1A');
    expect(level3ChildRow).not.toHaveAttribute('aria-expanded');
    expect(level3ChildRow).not.toHaveAttribute('data-expanded');
    expect(level3ChildRow).toHaveAttribute('aria-level', '3');
    expect(level3ChildRow).toHaveAttribute('data-level', '3');
    expect(level3ChildRow).toHaveAttribute('aria-posinset', '1');
    expect(level3ChildRow).toHaveAttribute('aria-setsize', '1');
    expect(level3ChildRow).toHaveAttribute('data-has-child-rows', 'false');
    expect(level3ChildRow).toHaveAttribute('data-rac');

    let level2ChildRow2 = rows[4];
    expect(level2ChildRow2).toHaveAttribute('aria-label', 'Projects-2');
    expect(level2ChildRow2).not.toHaveAttribute('aria-expanded');
    expect(level2ChildRow2).not.toHaveAttribute('data-expanded');
    expect(level2ChildRow2).toHaveAttribute('aria-level', '2');
    expect(level2ChildRow2).toHaveAttribute('data-level', '2');
    expect(level2ChildRow2).toHaveAttribute('aria-posinset', '2');
    expect(level2ChildRow2).toHaveAttribute('aria-setsize', '3');
    expect(level2ChildRow2).toHaveAttribute('data-has-child-rows', 'false');
    expect(level2ChildRow2).toHaveAttribute('data-rac');

    let level2ChildRow3 = rows[5];
    expect(level2ChildRow3).toHaveAttribute('aria-label', 'Projects-3');
    expect(level2ChildRow3).not.toHaveAttribute('aria-expanded');
    expect(level2ChildRow3).not.toHaveAttribute('data-expanded');
    expect(level2ChildRow3).toHaveAttribute('aria-level', '2');
    expect(level2ChildRow3).toHaveAttribute('data-level', '2');
    expect(level2ChildRow3).toHaveAttribute('aria-posinset', '3');
    expect(level2ChildRow3).toHaveAttribute('aria-setsize', '3');
    expect(level2ChildRow3).toHaveAttribute('data-has-child-rows', 'false');
    expect(level2ChildRow3).toHaveAttribute('data-rac');
  });

  it('should support dynamic trees', () => {
    let {getByRole, getAllByRole} = render(<DynamicTree />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('class', 'react-aria-Tree');

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(20);

    // Check the rough structure to make sure dynamic rows are rendering as expected (just checks the expandable rows and their attributes)
    expect(rows[0]).toHaveAttribute('aria-label', 'Projects');
    expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[0]).toHaveAttribute('aria-level', '1');
    expect(rows[0]).toHaveAttribute('aria-posinset', '1');
    expect(rows[0]).toHaveAttribute('aria-setsize', '2');
    expect(rows[0]).toHaveAttribute('data-has-child-rows', 'true');

    expect(rows[2]).toHaveAttribute('aria-label', 'Project 2');
    expect(rows[2]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[2]).toHaveAttribute('aria-level', '2');
    expect(rows[2]).toHaveAttribute('aria-posinset', '2');
    expect(rows[2]).toHaveAttribute('aria-setsize', '5');
    expect(rows[2]).toHaveAttribute('data-has-child-rows', 'true');

    expect(rows[8]).toHaveAttribute('aria-label', 'Project 5');
    expect(rows[8]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[8]).toHaveAttribute('aria-level', '2');
    expect(rows[8]).toHaveAttribute('aria-posinset', '5');
    expect(rows[8]).toHaveAttribute('aria-setsize', '5');
    expect(rows[8]).toHaveAttribute('data-has-child-rows', 'true');

    expect(rows[12]).toHaveAttribute('aria-label', 'Reports');
    expect(rows[12]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[12]).toHaveAttribute('aria-level', '1');
    expect(rows[12]).toHaveAttribute('aria-posinset', '2');
    expect(rows[12]).toHaveAttribute('aria-setsize', '2');
    expect(rows[12]).toHaveAttribute('data-has-child-rows', 'true');

    expect(rows[16]).toHaveAttribute('aria-label', 'Reports 1ABC');
    expect(rows[16]).toHaveAttribute('aria-level', '5');
    expect(rows[16]).toHaveAttribute('aria-posinset', '1');
    expect(rows[16]).toHaveAttribute('aria-setsize', '1');
  });

  it('should render checkboxes for selection', async () => {
    let {getByRole, getAllByRole} = render(<StaticTree treeProps={{selectionMode: 'single'}} rowProps={{href: 'https://google.com'}} />);
    let tree = getByRole('treegrid');
    expect(tree).not.toHaveAttribute('aria-multiselectable');

    for (let row of getAllByRole('row')) {
      let checkbox = within(row).getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toHaveAttribute('aria-label', 'Select');
      expect(checkbox).toHaveAttribute('aria-labelledby', `${checkbox.id} ${row.id}`);
      expect(row).toHaveAttribute('aria-selected', 'false');
      expect(row).not.toHaveAttribute('data-selected');
      expect(row).toHaveAttribute('data-selection-mode', 'single');
    }

    let row = getAllByRole('row')[2];
    let checkbox = within(row).getByRole('checkbox');
    await user.click(checkbox);
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row).toHaveAttribute('data-selected', 'true');
    expect(checkbox).toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(['projects-1']));
  });

  it('should not render checkboxes for selection with selectionBehavior=replace ', async () => {
    let {getByRole, getAllByRole} = render(<StaticTree treeProps={{selectionMode: 'multiple', selectionBehavior: 'replace'}} />);
    let tree = getByRole('treegrid');
    expect(tree).toHaveAttribute('aria-multiselectable', 'true');

    for (let row of getAllByRole('row')) {
      let checkbox = within(row).queryByRole('checkbox');
      expect(checkbox).toBeNull();
      expect(row).toHaveAttribute('aria-selected', 'false');
      expect(row).not.toHaveAttribute('data-selected');
      expect(row).toHaveAttribute('data-selection-mode', 'multiple');
    }

    let row2 = getAllByRole('row')[2];
    await user.click(row2);
    expect(row2).toHaveAttribute('aria-selected', 'true');
    expect(row2).toHaveAttribute('data-selected', 'true');
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(['projects-1']));

    let row1 = getAllByRole('row')[1];
    await user.click(row1);
    expect(row1).toHaveAttribute('aria-selected', 'true');
    expect(row1).toHaveAttribute('data-selected', 'true');
    expect(row2).toHaveAttribute('aria-selected', 'false');
    expect(row2).not.toHaveAttribute('data-selected');
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(new Set(onSelectionChange.mock.calls[1][0])).toEqual(new Set(['projects']));
  });

  describe('general interactions', () => {
    it('should support hover on rows', async () => {
      let {getAllByRole, rerender} = render(<StaticTree treeProps={{selectionMode: 'multiple'}} rowProps={{className: ({isHovered}) => isHovered ? 'hover' : ''}} />);

      let row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');

      await user.hover(row);
      expect(row).toHaveAttribute('data-hovered', 'true');
      expect(row).toHaveClass('hover');

      await user.unhover(row);
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');

      rerender(<StaticTree treeProps={{selectionMode: 'none', onAction: jest.fn()}} rowProps={{className: ({isHovered}) => isHovered ? 'hover' : ''}} />);
      row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');

      await user.hover(row);
      expect(row).toHaveAttribute('data-hovered', 'true');
      expect(row).toHaveClass('hover');

      await user.unhover(row);
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');
    });

    it('should not update the hover state if the row is not interactive', async () => {
      let {getAllByRole, rerender} = render(<StaticTree treeProps={{selectionMode: 'none'}} rowProps={{className: ({isHovered}) => isHovered ? 'hover' : ''}} />);

      let row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');

      await user.hover(row);
      expect(row).not.toHaveAttribute('data-hovered');
      expect(row).not.toHaveClass('hover');

      let expandableRow = getAllByRole('row')[1];
      expect(expandableRow).not.toHaveAttribute('data-hovered');
      expect(expandableRow).not.toHaveClass('hover');

      await user.hover(expandableRow);
      expect(expandableRow).toHaveAttribute('data-hovered', 'true');
      expect(expandableRow).toHaveClass('hover');

      await user.unhover(expandableRow);
      expect(expandableRow).not.toHaveAttribute('data-hovered');
      expect(expandableRow).not.toHaveClass('hover');

      // Test a completely inert expandable row
      // Note the disabledBehavior setting here, by default we make disableKey keys NOT restrict expandablity of the row. Similar pattern to Table
      rerender(<StaticTree treeProps={{selectionMode: 'none', disabledBehavior: 'all', disabledKeys: ['projects']}} rowProps={{className: ({isHovered}) => isHovered ? 'hover' : ''}} />);

      expandableRow = getAllByRole('row')[1];
      expect(expandableRow).toHaveAttribute('data-disabled', 'true');
      expect(expandableRow).not.toHaveAttribute('data-hovered');
      expect(expandableRow).not.toHaveClass('hover');

      await user.hover(expandableRow);
      expect(expandableRow).not.toHaveAttribute('data-hovered');
      expect(expandableRow).not.toHaveClass('hover');
    });

    it('should support press on rows', async () => {
      let {getAllByRole, rerender} = render(<StaticTree treeProps={{selectionMode: 'multiple'}} rowProps={{className: ({isPressed}) => isPressed ? 'pressed' : ''}} />);

      let row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');

      fireEvent.mouseDown(row);
      expect(row).toHaveAttribute('data-pressed', 'true');
      expect(row).toHaveClass('pressed');

      fireEvent.mouseUp(row);
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');

      rerender(<StaticTree treeProps={{selectionMode: 'none', onAction: jest.fn()}} rowProps={{className: ({isPressed}) => isPressed ? 'pressed' : ''}} />);
      row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');

      fireEvent.mouseDown(row);
      expect(row).toHaveAttribute('data-pressed', 'true');
      expect(row).toHaveClass('pressed');

      fireEvent.mouseUp(row);
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');
    });

    it('should not update the press state if the row is not interactive', () => {
      let {getAllByRole, rerender} = render(<StaticTree treeProps={{selectionMode: 'none'}} rowProps={{className: ({isPressed}) => isPressed ? 'pressed' : ''}} />);

      let row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');

      fireEvent.mouseDown(row);
      expect(row).not.toHaveAttribute('data-pressed');
      expect(row).not.toHaveClass('pressed');
      fireEvent.mouseUp(row);

      let expandableRow = getAllByRole('row')[1];
      expect(expandableRow).not.toHaveAttribute('data-pressed');
      expect(expandableRow).not.toHaveClass('pressed');

      fireEvent.mouseDown(expandableRow);
      expect(expandableRow).toHaveAttribute('data-pressed', 'true');
      expect(expandableRow).toHaveClass('pressed');

      fireEvent.mouseUp(expandableRow);
      expect(expandableRow).not.toHaveAttribute('data-pressed');
      expect(expandableRow).not.toHaveClass('pressed');

      // Test a completely inert expandable row
      rerender(<StaticTree treeProps={{selectionMode: 'none', disabledBehavior: 'all',  disabledKeys: ['projects']}} rowProps={{className: ({isPressed}) => isPressed ? 'pressed' : ''}} />);
      expandableRow = getAllByRole('row')[1];
      expect(expandableRow).toHaveAttribute('data-disabled', 'true');
      expect(expandableRow).not.toHaveAttribute('data-pressed');
      expect(expandableRow).not.toHaveClass('pressed');

      fireEvent.mouseDown(expandableRow);
      expect(expandableRow).not.toHaveAttribute('data-pressed');
      expect(expandableRow).not.toHaveClass('pressed');
      fireEvent.mouseUp(expandableRow);
    });

    it('should support focus', async () => {
      let {getAllByRole, rerender} = render(<StaticTree treeProps={{selectionMode: 'multiple', disabledKeys: ['projects']}} rowProps={{className: ({isFocused}) => isFocused ? 'focus' : ''}} />);

      let row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-focused');
      expect(row).not.toHaveClass('focus');

      await user.click(row);
      expect(row).toHaveAttribute('data-focused');
      expect(row).toHaveClass('focus');

      rerender(<StaticTree treeProps={{selectionMode: 'multiple', disabledKeys: ['projects']}} rowProps={{className: ({isFocusVisible}) => isFocusVisible ? 'focus-visible' : ''}} />);
      row = getAllByRole('row')[0];
      expect(row).not.toHaveAttribute('data-focus-visible');
      expect(row).not.toHaveClass('focus-visible');

      await user.click(row);
      expect(row).not.toHaveAttribute('data-focus-visible');
      expect(row).not.toHaveClass('focus-visible');

      await user.keyboard('{Enter}');
      expect(row).toHaveAttribute('data-focus-visible', 'true');
      expect(row).toHaveClass('focus-visible');

      let disabledRow = getAllByRole('row')[1];
      expect(disabledRow).not.toHaveAttribute('data-disabled', 'true');
      expect(disabledRow).not.toHaveAttribute('data-focus-visible');
      expect(disabledRow).not.toHaveClass('focus-visible');

      await user.keyboard('{ArrowDown}');
      disabledRow = getAllByRole('row')[1];
      // Note that the row is able to be focused because default disabledBehavior is 'selection'
      expect(disabledRow).toHaveAttribute('data-focus-visible', 'true');
      expect(disabledRow).toHaveClass('focus-visible');
      expect(row).not.toHaveAttribute('data-focus-visible');
      expect(row).not.toHaveClass('focus-visible');
    });

    it('should support actions on rows', async () => {
      let {getAllByRole} = render(<StaticTree treeProps={{selectionMode: 'multiple', disabledBehavior: 'all', onAction, disabledKeys: ['projects']}}  />);

      let row = getAllByRole('row')[0];
      await user.click(row);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenLastCalledWith('Photos');
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      // Due to disabledBehavior being set to 'all' this expandable row has its action disabled
      let disabledRow = getAllByRole('row')[1];
      expect(disabledRow).toHaveAttribute('data-disabled', 'true');
      await user.click(disabledRow);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      let expandableRow = getAllByRole('row')[2];
      await user.click(expandableRow);
      expect(onAction).toHaveBeenCalledTimes(2);
      expect(onAction).toHaveBeenLastCalledWith('projects-1');
      expect(onSelectionChange).toHaveBeenCalledTimes(0);

      await user.keyboard('{Enter}');
      expect(onAction).toHaveBeenCalledTimes(3);
      expect(onAction).toHaveBeenLastCalledWith('projects-1');
      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });

    it('should support onScroll', () => {
      let onScroll = jest.fn();
      let {getByRole} = render(<StaticTree treeProps={{onScroll}} />);
      let tree = getByRole('treegrid');
      fireEvent.scroll(tree);
      expect(onScroll).toHaveBeenCalled();
    });

    describe('links', function () {
      describe.each(['mouse', 'keyboard'])('%s', (type) => {
        let trigger = async (item, key = 'Enter') => {
          if (type === 'mouse') {
            await user.click(item);
          } else {
            await user.keyboard(`{${key}}`);
          }
        };

        it('should support links with selectionMode="none"', async () => {
          let {getAllByRole} = render(<StaticTree treeProps={{selectionMode: 'none'}} rowProps={{href: 'https://google.com/'}} />);
          let items = getAllByRole('row');
          for (let item of items) {
            expect(item.tagName).not.toBe('A');
            expect(item).toHaveAttribute('data-href');
          }

          if (type === 'keyboard') {
            await user.tab();
          }

          let onClick = mockClickDefault();
          await trigger(items[0]);
          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
          expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
        });

        it.each(['single', 'multiple'])('should support links with selectionBehavior="toggle" selectionMode="%s"', async (selectionMode) => {
          let {getAllByRole} = render(<StaticTree treeProps={{selectionMode}} rowProps={{href: 'https://google.com/'}} />);
          let items = getAllByRole('row');
          for (let item of items) {
            expect(item.tagName).not.toBe('A');
            expect(item).toHaveAttribute('data-href');
          }

          if (type === 'keyboard') {
            await user.tab();
          }

          let onClick = mockClickDefault();
          await trigger(items[0]);
          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
          expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');

          await user.click(within(items[0]).getByRole('checkbox'));
          expect(items[0]).toHaveAttribute('aria-selected', 'true');

          if (type === 'keyboard') {
            await user.keyboard('{ArrowLeft}');
            await user.keyboard('{ArrowDown}');
          }
          await trigger(items[1], ' ');
          expect(onClick).toHaveBeenCalledTimes(1);
          expect(items[1]).toHaveAttribute('aria-selected', 'true');
        });

        it.each(['single', 'multiple'])('should support links with selectionBehavior="replace" selectionMode="%s"', async (selectionMode) => {
          let {getAllByRole} = render(<StaticTree treeProps={{selectionMode, selectionBehavior: 'replace'}} rowProps={{href: 'https://google.com/'}} />);

          let items = getAllByRole('row');
          for (let item of items) {
            expect(item.tagName).not.toBe('A');
            expect(item).toHaveAttribute('data-href');
          }

          let onClick = mockClickDefault();
          if (type === 'mouse') {
            await user.click(items[0]);
          } else {
            await user.tab();
            await user.keyboard('{Space}');
          }
          expect(onClick).not.toHaveBeenCalled();
          expect(items[0]).toHaveAttribute('aria-selected', 'true');

          if (type === 'mouse') {
            await user.dblClick(items[0], {pointerType: 'mouse'});
          } else {
            await user.keyboard('{Enter}');
          }
          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
          expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
        });
      });
    });

    describe('keyboard interactions', () => {
      it('left and right arrows should navigate between interactive elements in the row', async () => {
        let {getAllByRole} = render(<DynamicTree treeProps={{selectionMode: 'multiple'}} />);
        let expandableRow = getAllByRole('row')[0];
        let buttons = within(expandableRow).getAllByRole('button');
        let checkbox = within(expandableRow).getByRole('checkbox');

        await user.tab();
        expect(expandableRow).toHaveAttribute('aria-expanded', 'true');
        expect(document.activeElement).toBe(expandableRow);
        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(checkbox);
        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(buttons[0]);
        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(buttons[1]);
        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(buttons[2]);
        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(expandableRow);

        // Test that if focus is on the row that right/left will expand/collapse if it isn't already
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(expandableRow);
        expect(expandableRow).toHaveAttribute('aria-expanded', 'false');

        await user.keyboard('{ArrowRight}');
        expect(document.activeElement).toBe(expandableRow);
        expect(expandableRow).toHaveAttribute('aria-expanded', 'true');

        // Resume testing navigation to interacive elements
        await user.keyboard('{ArrowLeft}');
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(buttons[2]);
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(buttons[1]);
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(buttons[0]);
        await user.keyboard('{ArrowLeft}');
        expect(document.activeElement).toBe(checkbox);
      });

      it('should support type ahead', async () => {
        let {getAllByRole, queryByText} = render(<DynamicTree />);
        await user.tab();
        let rows = getAllByRole('row');
        expect(document.activeElement).toBe(rows[0]);
        await user.keyboard('Reports 1ABC');
        expect(document.activeElement).toBe(rows[16]);

        act(() => {jest.runAllTimers();});
        await user.keyboard('Pro');
        expect(document.activeElement).toBe(rows[0]);

        // Test typeahead doesn't match against hidden rows
        await user.click(rows[12]);
        expect(queryByText('Reports 1ABC')).toBeFalsy();
        await user.keyboard('Reports 1ABC');
        expect(document.activeElement).toBe(rows[12]);
        expect(rows[12]).toHaveAttribute('aria-label', 'Reports');
      });

      it('should navigate between visible rows when using Arrow Up/Down', async () => {
        let {getAllByRole} = render(<DynamicTree />);
        await user.tab();
        let rows = getAllByRole('row');
        expect(rows).toHaveLength(20);
        expect(document.activeElement).toBe(rows[0]);
        await user.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(rows[1]);
        expect(rows[1]).toHaveAttribute('aria-label', 'Project 1');
        await user.keyboard('{ArrowUp}');

        // Collapse parent row and try arrow navigation again
        await user.keyboard('{ArrowLeft}');
        rows = getAllByRole('row');
        expect(rows).toHaveLength(9);
        await user.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(rows[1]);
        expect(rows[1]).toHaveAttribute('aria-label', 'Reports');
        await user.keyboard('{ArrowUp}');
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-label', 'Projects');
      });

      it('should navigate between visible rows when using Home/End', async () => {
        let {getAllByRole} = render(<DynamicTree />);
        await user.tab();
        let rows = getAllByRole('row');
        expect(rows).toHaveLength(20);
        expect(document.activeElement).toBe(rows[0]);
        await user.keyboard('{End}');
        expect(document.activeElement).toBe(rows[19]);
        expect(rows[19]).toHaveAttribute('aria-label', 'Reports 2');
        await user.keyboard('{Home}');
        expect(document.activeElement).toBe(rows[0]);

        // Collapse the 2nd top level row and try End/Home again
        await user.click(rows[12]);
        rows = getAllByRole('row');
        expect(rows).toHaveLength(13);
        await user.keyboard('{Home}');
        await user.keyboard('{End}');
        expect(document.activeElement).toBe(rows[12]);
        expect(rows[12]).toHaveAttribute('aria-label', 'Reports');
      });
    });
  });

  describe('expanding and collapsing', () => {
    describe.each(['mouse', 'keyboard'])('%s', (type) => {
      let trigger = async (item, key = 'ArrowRight') => {
        if (type === 'mouse') {
          await user.click(item);
        } else {
          await user.keyboard(`{${key}}`);
        }
      };

      it('should expand/collapse a row when clicking/using Enter on the row itself and there arent any other primary actions', async () => {
        let {getAllByRole} = render(<DynamicTree />);
        let rows = getAllByRole('row');
        expect(rows).toHaveLength(20);

        await user.tab();
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(rows[0]).toHaveAttribute('aria-level', '1');
        expect(rows[0]).toHaveAttribute('aria-posinset', '1');
        expect(rows[0]).toHaveAttribute('aria-setsize', '2');
        expect(rows[0]).toHaveAttribute('data-has-child-rows', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);

        // Check we can open/close a top level row
        await trigger(rows[0], 'Enter');
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(rows[0]).toHaveAttribute('aria-level', '1');
        expect(rows[0]).toHaveAttribute('aria-posinset', '1');
        expect(rows[0]).toHaveAttribute('aria-setsize', '2');
        expect(rows[0]).toHaveAttribute('data-has-child-rows', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        // Note that the children of the parent row will still be in the "expanded" array
        expect(new Set(onExpandedChange.mock.calls[0][0])).toEqual(new Set(['project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        rows = getAllByRole('row');
        expect(rows).toHaveLength(9);

        await trigger(rows[0], 'Enter');
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(rows[0]).toHaveAttribute('aria-level', '1');
        expect(rows[0]).toHaveAttribute('aria-posinset', '1');
        expect(rows[0]).toHaveAttribute('aria-setsize', '2');
        expect(rows[0]).toHaveAttribute('data-has-child-rows', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(2);
        expect(new Set(onExpandedChange.mock.calls[1][0])).toEqual(new Set(['projects', 'project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        rows = getAllByRole('row');
        expect(rows).toHaveLength(20);

        await user.keyboard('{ArrowDown}');
        await user.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(rows[2]);
        expect(rows[2]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[2]).toHaveAttribute('data-expanded', 'true');
        expect(rows[2]).toHaveAttribute('aria-level', '2');
        expect(rows[2]).toHaveAttribute('aria-posinset', '2');
        expect(rows[2]).toHaveAttribute('aria-setsize', '5');
        expect(rows[2]).toHaveAttribute('data-has-child-rows', 'true');

        // Check we can close a nested row and it doesn't affect the parent
        await trigger(rows[2], 'ArrowLeft');
        expect(document.activeElement).toBe(rows[2]);
        expect(rows[2]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[2]).toHaveAttribute('data-expanded', 'false');
        expect(rows[2]).toHaveAttribute('aria-level', '2');
        expect(rows[2]).toHaveAttribute('aria-posinset', '2');
        expect(rows[2]).toHaveAttribute('aria-setsize', '5');
        expect(rows[2]).toHaveAttribute('data-has-child-rows', 'true');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(rows[0]).toHaveAttribute('aria-level', '1');
        expect(rows[0]).toHaveAttribute('aria-posinset', '1');
        expect(rows[0]).toHaveAttribute('aria-setsize', '2');
        expect(rows[0]).toHaveAttribute('data-has-child-rows', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(3);
        expect(new Set(onExpandedChange.mock.calls[2][0])).toEqual(new Set(['projects', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        rows = getAllByRole('row');
        expect(rows).toHaveLength(17);

        // Check behavior of onExpandedChange when a nested row is already closed and the parent is collapsed
        await user.keyboard('{ArrowUp}');
        await user.keyboard('{ArrowUp}');
        await trigger(rows[0], 'ArrowLeft');
        expect(document.activeElement).toBe(rows[0]);
        expect(onExpandedChange).toHaveBeenCalledTimes(4);
        expect(new Set(onExpandedChange.mock.calls[3][0])).toEqual(new Set(['project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        rows = getAllByRole('row');
        expect(rows).toHaveLength(9);

        // Check that the nested collapsed row is still closed when the parent is reexpanded
        await trigger(rows[0], 'ArrowRight');
        expect(document.activeElement).toBe(rows[0]);
        expect(onExpandedChange).toHaveBeenCalledTimes(5);
        expect(new Set(onExpandedChange.mock.calls[4][0])).toEqual(new Set(['projects', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        rows = getAllByRole('row');
        expect(rows).toHaveLength(17);
      });

      it('should not expand/collapse if disabledBehavior is "all" and the row is disabled', async () => {
        let {getAllByRole, rerender} = render(<DynamicTree treeProps={{disabledKeys: ['projects'], disabledBehavior: 'all', expandedKeys: 'all'}} />);
        let rows = getAllByRole('row');
        expect(rows).toHaveLength(20);

        await user.tab();
        // Since first row is disabled, we can't keyboard focus it
        expect(document.activeElement).toBe(rows[1]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
        expect(rows[0]).toHaveAttribute('data-disabled', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);

        // Try clicking on first row
        await trigger(rows[0], 'Space');
        expect(document.activeElement).toBe(rows[1]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);

        rerender(<DynamicTree treeProps={{disabledKeys: ['projects'], disabledBehavior: 'all', expandedKeys: []}} />);
        await user.tab();
        rows = getAllByRole('row');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
        expect(rows[0]).toHaveAttribute('data-disabled', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);

        await trigger(rows[0], 'Space');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
      });

      it('should expand/collapse if disabledBehavior is "selection" and the row is disabled', async () => {
        let {getAllByRole} = render(<DynamicTree treeProps={{disabledKeys: ['projects'], disabledBehavior: 'selection', selectionMode: 'multiple'}} />);
        let rows = getAllByRole('row');

        await user.tab();
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onSelectionChange).toHaveBeenCalledTimes(0);

        // Since selection is enabled, we need to click the chevron even for disabled rows since it is still regarded as the primary action
        let chevron = within(rows[0]).getAllByRole('button')[0];
        await trigger(chevron, 'ArrowLeft');
        // TODO: reenable this when we make it so the chevron button isn't focusable via click/keyboard nav
        // expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        expect(new Set(onExpandedChange.mock.calls[0][0])).toEqual(new Set(['project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        expect(onSelectionChange).toHaveBeenCalledTimes(0);

        await trigger(chevron);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(2);
        expect(new Set(onExpandedChange.mock.calls[1][0])).toEqual(new Set(['projects', 'project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        expect(onSelectionChange).toHaveBeenCalledTimes(0);

        let disabledCheckbox = within(rows[0]).getByRole('checkbox');
        expect(disabledCheckbox).toHaveAttribute('disabled');
      });

      it('should not expand when clicking/using Enter on the row if the row is selectable', async () => {
        let {getAllByRole} = render(<DynamicTree treeProps={{selectionMode: 'multiple'}} />);
        let rows = getAllByRole('row');

        await user.tab();
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onSelectionChange).toHaveBeenCalledTimes(0);

        await trigger(rows[0], 'Enter');
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(['projects']));

        await trigger(rows[0], 'Enter');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onSelectionChange).toHaveBeenCalledTimes(2);
        expect(new Set(onSelectionChange.mock.calls[1][0])).toEqual(new Set([]));

        let chevron = within(rows[0]).getAllByRole('button')[0];
        await trigger(chevron, 'ArrowLeft');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        expect(new Set(onExpandedChange.mock.calls[0][0])).toEqual(new Set(['project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        expect(onSelectionChange).toHaveBeenCalledTimes(2);
      });

      it('should not expand when clicking/using Enter on the row if the row has an action', async () => {
        let {getAllByRole} = render(<DynamicTree treeProps={{onAction}} />);
        let rows = getAllByRole('row');

        await user.tab();
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onAction).toHaveBeenCalledTimes(0);

        await trigger(rows[0], 'Enter');
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenLastCalledWith('projects');

        let chevron = within(rows[0]).getAllByRole('button')[0];
        await trigger(chevron, 'ArrowLeft');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        expect(new Set(onExpandedChange.mock.calls[0][0])).toEqual(new Set(['project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
        expect(onAction).toHaveBeenCalledTimes(1);
      });

      it('should not expand when clicking/using Enter on the row if the row has a link', async () => {
        let {getAllByRole} = render(<DynamicTree rowProps={{href: 'https://google.com'}} />);
        let rows = getAllByRole('row');
        expect(rows[0]).toHaveAttribute('data-href');

        await user.tab();
        expect(document.activeElement).toBe(rows[0]);
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);

        let onClick = mockClickDefault();
        await trigger(rows[0], 'Enter');
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
        expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
        expect(rows[0]).toHaveAttribute('data-expanded', 'true');
        expect(onExpandedChange).toHaveBeenCalledTimes(0);
        expect(document.activeElement).toBe(document.body);

        await user.tab();
        let chevron = within(rows[0]).getAllByRole('button')[0];
        await trigger(chevron, 'ArrowLeft');
        expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
        expect(rows[0]).toHaveAttribute('data-expanded', 'false');
        expect(onExpandedChange).toHaveBeenCalledTimes(1);
        expect(new Set(onExpandedChange.mock.calls[0][0])).toEqual(new Set(['project-2', 'project-5', 'reports', 'reports-1', 'reports-1A', 'reports-1AB']));
      });
    });

    it('should support controlled expansion', async () => {
      function ControlledTree() {
        let [expandedKeys, setExpandedKeys] = React.useState(new Set([]));

        return (
          <DynamicTree treeProps={{expandedKeys, onExpandedChange: setExpandedKeys}} />
        );
      }

      let {getAllByRole} = render(<ControlledTree />);
      let rows = getAllByRole('row');
      expect(rows).toHaveLength(2);

      await user.tab();
      expect(document.activeElement).toBe(rows[0]);
      expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
      expect(rows[0]).toHaveAttribute('data-expanded', 'false');

      await user.click(rows[0]);
      rows = getAllByRole('row');
      expect(rows).toHaveLength(7);

      await user.click(rows[0]);
      expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
      expect(rows[0]).toHaveAttribute('data-expanded', 'false');
      rows = getAllByRole('row');
      expect(rows).toHaveLength(2);
    });

    it('should apply the proper attributes to the chevron', async () => {
      let {getAllByRole} = render(<DynamicTree />);
      let rows = getAllByRole('row');
      let chevron = within(rows[0]).getAllByRole('button')[0];

      await user.tab();
      expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
      expect(chevron).toHaveAttribute('aria-label', 'Collapse');
      expect(chevron).toHaveAttribute('slot', 'chevron');

      await user.click(rows[0]);
      expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
      expect(chevron).toHaveAttribute('aria-label', 'Expand');
    });
  });

  describe('empty state', () => {
    it('should allow the user to tab to the empty tree', async () => {
      let {getAllByRole, getByRole} = render(
        <Tree
          className={({isFocused, isFocusVisible}) => `isFocused: ${isFocused}, isFocusVisible: ${isFocusVisible}`}
          aria-label="test empty tree"
          items={[]}
          renderEmptyState={({isFocused, isFocusVisible}) => <span>{`Nothing in tree, isFocused: ${isFocused}, isFocusVisible: ${isFocusVisible}`}</span>}>
          {() => (
            <TreeItem textValue="dummy value">
              <TreeItemContent>
                Dummy Value
              </TreeItemContent>
            </TreeItem>
          )}
        </Tree>
      );

      let tree = getByRole('treegrid');
      expect(tree).toHaveAttribute('data-empty', 'true');
      expect(tree).not.toHaveAttribute('data-focused');
      expect(tree).not.toHaveAttribute('data-focus-visible');
      expect(tree).toHaveClass('isFocused: false, isFocusVisible: false');

      let row = getAllByRole('row')[0];
      expect(row).toHaveAttribute('aria-level', '1');
      expect(row).toHaveAttribute('aria-posinset', '1');
      expect(row).toHaveAttribute('aria-setsize', '1');
      let gridCell = within(row).getByRole('gridcell');
      expect(gridCell).toHaveTextContent('Nothing in tree, isFocused: false, isFocusVisible: false');

      await user.tab();
      expect(document.activeElement).toBe(tree);
      expect(tree).toHaveAttribute('data-empty', 'true');
      expect(tree).toHaveAttribute('data-focused', 'true');
      expect(tree).toHaveAttribute('data-focus-visible', 'true');
      expect(tree).toHaveClass('isFocused: true, isFocusVisible: true');
      expect(gridCell).toHaveTextContent('Nothing in tree, isFocused: true, isFocusVisible: true');

      await user.tab();
      expect(tree).toHaveAttribute('data-empty', 'true');
      expect(tree).not.toHaveAttribute('data-focused');
      expect(tree).not.toHaveAttribute('data-focus-visible');
      expect(tree).toHaveClass('isFocused: false, isFocusVisible: false');
      expect(row).toHaveAttribute('aria-level', '1');
      expect(row).toHaveAttribute('aria-posinset', '1');
      expect(row).toHaveAttribute('aria-setsize', '1');
      expect(gridCell).toHaveTextContent('Nothing in tree, isFocused: false, isFocusVisible: false');
    });
  });
});
