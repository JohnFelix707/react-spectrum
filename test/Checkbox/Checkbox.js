import assert from 'assert';
import Checkbox from '../../src/Checkbox';
import React from 'react';
import {shallow} from 'enzyme';

describe('Checkbox', () => {
  it('has correct defaults', () => {
    const tree = shallow(<Checkbox />);
    assert.equal(tree.prop('inputType'), 'checkbox');
    assert(!tree.prop('aria-checked'));
    assert.equal(tree.prop('className'), 'spectrum-Checkbox');
    assert.equal(tree.prop('inputClassName'), 'spectrum-Checkbox-input');
    assert.equal(tree.prop('markClassName'), 'spectrum-Checkbox-box');
    assert.equal(tree.prop('labelClassName'), 'spectrum-Checkbox-label');
  });

  it('supports indeterminate', () => {
    // Render the Checkbox AND it's SwitchBase component and make sure overriding
    // aria-checked happens properly.
    const tree = shallow(<Checkbox indeterminate />);
    let innerTree = tree.shallow();
    assert.equal(tree.prop('aria-checked'), 'mixed');
    assert.equal(findInput(innerTree).prop('aria-checked'), 'mixed');
    assert.equal(findInput(innerTree).prop('checked'), false);


    tree.setProps({indeterminate: false});
    innerTree = tree.shallow();
    assert(!tree.prop('aria-checked'));
    assert(!findInput(innerTree).prop('aria-checked'));
    assert.equal(findInput(innerTree).prop('checked'), false);

    tree.setProps({checked: true});
    innerTree = tree.shallow();
    assert(!tree.prop('aria-checked'));
    assert(!findInput(innerTree).prop('aria-checked'));
    assert.equal(findInput(innerTree).prop('checked'), true);
  });

  it('supports additional classNames', () => {
    const tree = shallow(<Checkbox className="foo" />);
    assert.equal(tree.hasClass('foo'), true);
  });

  it('supports additional properties', () => {
    const tree = shallow(<Checkbox foo />);
    let innerTree = tree.shallow();
    assert.equal(tree.prop('foo'), true);
    assert.equal(findInput(innerTree).prop('foo'), true);
  });
});

const findInput = tree => tree.find('input');

