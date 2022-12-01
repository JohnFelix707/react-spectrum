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

import {act, fireEvent, render, within} from '@react-spectrum/test-utils';
import {Button} from '@react-spectrum/button';
import {chain} from '@react-aria/utils';
import {Item} from '@react-stately/collections';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {TagGroup} from '../src';
import {theme} from '@react-spectrum/theme-default';
import userEvent from '@testing-library/user-event';

function pressKeyOnButton(key) {
  return (button) => {
    fireEvent.keyDown(button, {key});
  };
}

function pressArrowRight(button) {
  return pressKeyOnButton('ArrowRight')(button);
}

function pressArrowLeft(button) {
  return pressKeyOnButton('ArrowLeft')(button);
}

function pressArrowUp(button) {
  return pressKeyOnButton('ArrowUp')(button);
}

function pressArrowDown(button) {
  return pressKeyOnButton('ArrowDown')(button);
}

describe('TagGroup', function () {
  let onRemoveSpy = jest.fn();
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    onRemoveSpy.mockClear();
  });

  it('provides context for Tag component', function () {
    let {getAllByRole} = render(
      <TagGroup aria-label="tag group" allowsRemoving onRemove={onRemoveSpy}>
        <Item aria-label="Tag 1">Tag 1</Item>
        <Item aria-label="Tag 2">Tag 2</Item>
        <Item aria-label="Tag 3">Tag 3</Item>
      </TagGroup>
    );

    let tags = getAllByRole('row');
    expect(tags.length).toBe(3);

    fireEvent.keyDown(tags[1], {key: 'Delete'});
    expect(onRemoveSpy).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility roles', () => {
    let {getByRole, getAllByRole} = render(
      <TagGroup
        aria-label="tag group">
        <Item aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tagGroup = getByRole('grid');
    expect(tagGroup).toBeInTheDocument();
    let tags = getAllByRole('row');
    let cells = getAllByRole('gridcell');
    expect(tags).toHaveLength(cells.length);
  });

  it('has correct tab index', () => {
    let {getAllByRole} = render(
      <TagGroup
        aria-label="tag group">
        <Item aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tags = getAllByRole('row');
    expect(tags[0]).toHaveAttribute('tabIndex', '0');
  });

  it.each`
    Name                                                | props                                         | orders
    ${'(left/right arrows, ltr + horizontal) TagGroup'} | ${{locale: 'de-DE'}}                          | ${[{action: () => {userEvent.tab();}, index: 0}, {action: pressArrowRight, index: 1}, {action: pressArrowLeft, index: 0}, {action: pressArrowLeft, index: 2}]}
    ${'(left/right arrows, rtl + horizontal) TagGroup'} | ${{locale: 'ar-AE'}}                          | ${[{action: () => {userEvent.tab();}, index: 0}, {action: pressArrowLeft, index: 1}, {action: pressArrowRight, index: 0}, {action: pressArrowRight, index: 2}]}
    ${'(up/down arrows, ltr + horizontal) TagGroup'}    | ${{locale: 'de-DE'}}                          | ${[{action: () => {userEvent.tab();}, index: 0}, {action: pressArrowDown, index: 1}, {action: pressArrowUp, index: 0}, {action: pressArrowUp, index: 2}]}
    ${'(up/down arrows, rtl + horizontal) TagGroup'}    | ${{locale: 'ar-AE'}}                          | ${[{action: () => {userEvent.tab();}, index: 0}, {action: pressArrowUp, index: 2}, {action: pressArrowDown, index: 0}, {action: pressArrowDown, index: 1}]}
  `('$Name shifts button focus in the correct direction on key press', function ({Name, props, orders}) {
    let {getAllByRole} = render(
      <Provider theme={theme} locale={props.locale}>
        <TagGroup aria-label="tag group">
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
          <Item key="3" aria-label="Tag 3">Tag 3</Item>
        </TagGroup>
      </Provider>
    );

    let tags = getAllByRole('row');
    orders.forEach(({action, index}, i) => {
      action(document.activeElement);
      expect(document.activeElement).toBe(tags[index]);
    });
  });

  it('TagGroup allows aria-label', function () {
    let {getByRole} = render(
      <TagGroup aria-label="tag group">
        <Item key="1" aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tagGroup = getByRole('grid');
    expect(tagGroup).toHaveAttribute('aria-label', 'tag group');
  });

  it('TagGroup allows aria-labelledby', function () {
    let {getByRole} = render(
      <TagGroup aria-labelledby="tag group">
        <Item key="1" aria-label="Tag 1">Tag 1</Item>
      </TagGroup>
    );

    let tagGroup = getByRole('grid');
    expect(tagGroup).toHaveAttribute('aria-labelledby', 'tag group');
  });

  it('TagGroup allows aria-label on Item', function () {
    let {getByRole} = render(
      <TagGroup aria-label="tag group">
        <Item key="1" aria-label="Tag 1">Tag 1</Item>
        <Item key="2" aria-label="Tag 2">Tag 2</Item>
        <Item key="3" aria-label="Tag 3">Tag 3</Item>
      </TagGroup>
    );

    let tagGroup = getByRole('grid');
    let tagRow = tagGroup.children[0];
    let tag = tagRow.children[0];
    expect(tag).toHaveAttribute('aria-label', 'Tag 1');
  });

  it('should remember last focused item', function () {
    let {getAllByRole, getByLabelText} = render(
      <Provider theme={theme} locale="de-DE">
        <Button variant="primary" aria-label="ButtonBefore" />
        <TagGroup aria-label="tag group" disabledKeys={['foo', 'bar']}>
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
        </TagGroup>
        <Button variant="primary" aria-label="ButtonAfter" />
      </Provider>
    );

    let buttonBefore = getByLabelText('ButtonBefore');
    let buttonAfter = getByLabelText('ButtonAfter');
    let tags = getAllByRole('row');
    act(() => {buttonBefore.focus();});

    userEvent.tab();
    expect(document.activeElement).toBe(tags[0]);

    pressArrowRight(tags[0]);
    expect(document.activeElement).toBe(tags[1]);

    userEvent.tab();
    expect(document.activeElement).toBe(buttonAfter);

    userEvent.tab({shift: true});
    expect(document.activeElement).toBe(tags[1]);
  });

  it('should be focusable from Tab', async function () {
    let {getAllByRole, getByLabelText} = render(
      <Provider theme={theme} locale="de-DE">
        <Button variant="primary" aria-label="ButtonBefore" />
        <TagGroup aria-label="tag group" disabledKeys={['foo', 'bar']}>
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
        </TagGroup>
        <Button variant="primary" aria-label="ButtonAfter" />
      </Provider>
    );

    let buttonBefore = getByLabelText('ButtonBefore');
    let buttonAfter = getByLabelText('ButtonAfter');
    let tags = getAllByRole('row');
    act(() => {buttonBefore.focus();});
    expect(buttonBefore).toHaveFocus();
    userEvent.tab();
    expect(tags[0]).toHaveFocus();
    userEvent.tab();
    expect(buttonAfter).toHaveFocus();
  });

  it('should be focusable from Shift + Tab', function () {
    let {getAllByRole, getByLabelText} = render(
      <Provider theme={theme} locale="de-DE">
        <Button variant="primary" aria-label="ButtonBefore" />
        <TagGroup aria-label="tag group" disabledKeys={['foo', 'bar']}>
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
        </TagGroup>
        <Button variant="primary" aria-label="ButtonAfter" autoFocus />
      </Provider>
    );

    let buttonBefore = getByLabelText('ButtonBefore');
    let buttonAfter = getByLabelText('ButtonAfter');
    let tags = getAllByRole('row');
    act(() => {buttonAfter.focus();});
    userEvent.tab({shift: true});
    expect(document.activeElement).toBe(tags[1]);
    userEvent.tab({shift: true});
    expect(document.activeElement).toBe(buttonBefore);
    expect(buttonBefore).toHaveFocus();
  });

  it('TagGroup should pass className, role and tabIndex', function () {
    let {getByRole} = render(
      <Provider theme={theme} locale="de-DE">
        <TagGroup aria-label="tag group">
          <Item UNSAFE_className="test-class" key="1" aria-label="Tag 1">Tag 1</Item>
        </TagGroup>
      </Provider>
    );

    let tagGroup = getByRole('grid');
    let tag = tagGroup.children[0];
    expect(tag).not.toHaveAttribute('icon');
    expect(tag).not.toHaveAttribute('unsafe_classname');
    expect(tag).toHaveAttribute('class', expect.stringContaining('test-class'));
    expect(tag).toHaveAttribute('class', expect.stringContaining('-item'));
    expect(tag).toHaveAttribute('role', 'row');
    expect(tag).toHaveAttribute('tabIndex', '0');
  });

  it('handles keyboard focus management properly', function () {
    let {getAllByRole} = render(
      <Provider theme={theme}>
        <TagGroup aria-label="tag group">
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
        </TagGroup>
      </Provider>
    );

    let tags = getAllByRole('row');
    expect(tags.length).toBe(2);
    expect(tags[0]).toHaveAttribute('tabIndex', '0');
    expect(tags[1]).toHaveAttribute('tabIndex', '0');

    act(() => tags[0].focus());
    expect(tags[0]).toHaveAttribute('tabIndex', '0');
    expect(tags[1]).toHaveAttribute('tabIndex', '-1');

    pressArrowRight(tags[0]);
    expect(tags[0]).toHaveAttribute('tabIndex', '-1');
    expect(tags[1]).toHaveAttribute('tabIndex', '0');
  });

  it.each`
    Name                         | props
    ${'on `Delete` keypress'}    | ${{keyPress: 'Delete'}}
    ${'on `Backspace` keypress'} | ${{keyPress: 'Backspace'}}
    ${'on `space` keypress'}     | ${{keyPress: ' '}}
  `('Remove tag $Name', function ({Name, props}) {
    let {getByText} = render(
      <Provider theme={theme}>
        <TagGroup aria-label="tag group" allowsRemoving onRemove={onRemoveSpy}>
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
          <Item key="3" aria-label="Tag 3">Tag 3</Item>
        </TagGroup>
      </Provider>
    );

    let tag = getByText('Tag 1');
    fireEvent.keyDown(tag, {key: props.keyPress});
    expect(onRemoveSpy).toHaveBeenCalledWith('1');
  });

  it('should remove tag when remove button is clicked', function () {
    let {getAllByRole} = render(
      <Provider theme={theme}>
        <TagGroup aria-label="tag group" allowsRemoving onRemove={onRemoveSpy}>
          <Item key="1" aria-label="Tag 1">Tag 1</Item>
          <Item key="2" aria-label="Tag 2">Tag 2</Item>
          <Item key="3" aria-label="Tag 3">Tag 3</Item>
        </TagGroup>
      </Provider>
    );

    let tags = getAllByRole('row');
    fireEvent.click(tags[0]);
    expect(onRemoveSpy).not.toHaveBeenCalled();

    let removeButton = within(tags[0]).getByRole('button');
    fireEvent.click(removeButton);
    expect(onRemoveSpy).toHaveBeenCalledWith('1');
  });

  it.each`
    Name                         | props
    ${'on `Delete` keypress'}    | ${{keyPress: 'Delete'}}
    ${'on `Backspace` keypress'} | ${{keyPress: 'Backspace'}}
    ${'on `space` keypress'}     | ${{keyPress: ' '}}
  `('Can move focus after removing tag $Name', function ({Name, props}) {

    function TagGroupWithDelete(props) {
      let [items, setItems] = React.useState([
        {id: 1, label: 'Cool Tag 1'},
        {id: 2, label: 'Another cool tag'},
        {id: 3, label: 'This tag'},
        {id: 4, label: 'What tag?'},
        {id: 5, label: 'This tag is cool too'},
        {id: 6, label: 'Shy tag'}
      ]);

      let removeItem = (key) => {
        setItems(prevItems => prevItems.filter((item) => key !== item.id));
      };
    
      return (
        <Provider theme={theme}>
          <TagGroup items={items} aria-label="tag group" allowsRemoving onRemove={chain(removeItem, onRemoveSpy)} {...props}>
            {item => <Item>{item.label}</Item>}
          </TagGroup>
        </Provider>
      );
    }
      
    let {getAllByRole} = render(
      <TagGroupWithDelete {...props} />
    );

    let tags = getAllByRole('row');
    userEvent.tab();
    expect(document.activeElement).toBe(tags[0]);
    fireEvent.keyDown(document.activeElement, {key: props.keyPress});
    expect(onRemoveSpy).toHaveBeenCalledTimes(1);
    expect(onRemoveSpy).toHaveBeenCalledWith(1);
    tags = getAllByRole('row');
    expect(document.activeElement).toBe(tags[0]);
    pressArrowRight(tags[0]);
    expect(document.activeElement).toBe(tags[1]);
  });
});
