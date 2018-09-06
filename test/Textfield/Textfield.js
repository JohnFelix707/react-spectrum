import assert from 'assert';
import {mount, shallow} from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import {sleep} from '../utils';
import Textfield from '../../src/Textfield';

describe('Textfield', () => {
  it('default', () => {
    const tree = shallow(<Textfield />);
    assert.equal(tree.prop('className'), 'spectrum-Textfield');
  });

  it('supports quiet variation', () => {
    const tree = shallow(<Textfield quiet />);
    assert.equal(tree.prop('className'), 'spectrum-Textfield spectrum-Textfield--quiet');
    tree.setProps({quiet: false});
    assert.equal(tree.prop('className'), 'spectrum-Textfield');
  });

  it('supports name', () => {
    const tree = shallow(<Textfield name="foo" />);
    assert.equal(tree.prop('name'), 'foo');
  });

  it('supports disabled', () => {
    const tree = shallow(<Textfield />);
    assert(!tree.prop('disabled'));
    tree.setProps({disabled: true});
    assert.equal(tree.prop('disabled'), true);
  });

  it('supports required', () => {
    const tree = shallow(<Textfield />);
    assert(!tree.prop('required'));
    tree.setProps({required: true});
    assert.equal(tree.prop('required'), true);
  });

  it('supports readOnly', () => {
    const tree = shallow(<Textfield />);
    assert(!tree.prop('readOnly'));
    tree.setProps({readOnly: true});
    assert.equal(tree.prop('readOnly'), true);
  });

  // Deprecated
  it('supports invalid', () => {
    const tree = shallow(<Textfield />);
    assert(!tree.prop('aria-invalid'));
    tree.setProps({invalid: true});
    assert.equal(tree.prop('className'), 'spectrum-Textfield is-invalid');
    assert.equal(tree.prop('aria-invalid'), true);
  });

  it('supports validationState', () => {
    const tree = shallow(<Textfield />);
    tree.setProps({validationState: 'valid'});
    assert.equal(tree.prop('className'), 'spectrum-Textfield is-valid');
    assert(!tree.prop('aria-invalid'));

    tree.setProps({validationState: 'invalid'});
    assert.equal(tree.prop('className'), 'spectrum-Textfield is-invalid');
    assert.equal(tree.prop('aria-invalid'), true);
  });

  it('supports additional classNames', () => {
    const tree = shallow(<Textfield className="myClass" />);
    assert.equal(tree.prop('className'), 'spectrum-Textfield myClass');
  });

  it('supports additional properties', () => {
    const tree = shallow(<Textfield data-foo />);
    assert.equal(tree.prop('data-foo'), true);
  });

  it('supports autoFocus', async () => {
    const tree = mount(<Textfield autoFocus />);
    assert(!tree.getDOMNode().getAttribute('autoFocus'));
    await sleep(17);
    assert.equal(document.activeElement, tree.getDOMNode());
    tree.unmount();
  });

  it('supports onChange event handler', () => {
    const spy = sinon.spy();
    const val = 'foo';
    const tree = mount(<Textfield onChange={spy} />);
    tree.getDOMNode().value = val;
    tree.simulate('change');
    assert(spy.calledOnce);
    assert.equal(spy.lastCall.args[0], val);

    tree.unmount();
  });
});
