import React, { Component } from 'react';
import classNames from 'classnames';

export default class List extends Component {
  static defaultProps = {
    listItemSelector: '.coral-BasicList-item',
    onSelect: () => {}
  }

  handleFocusFirst = e => {
    this.getItems()[0].focus();
  }

  handleFocusLast = e => {
    const items = this.getItems();
    items[items.length - 1].focus();
  }

  handleFocusPrevious = e => {
    const items = this.getItems();
    let index = items.indexOf(e.target) - 1;
    if (index < 0) {
      index = items.length - 1;
    }
    items[index].focus();
  }

  handleFocusNext = e => {
    const items = this.getItems();
    let index = items.indexOf(e.target) + 1;
    if (index >= items.length) {
      index = 0;
    }
    items[index].focus();
  }

  getItems() {
    return Array.prototype.slice.call(this.refs.list.querySelectorAll(this.props.listItemSelector));
  }

  render() {
    const {
      className,
      children,
      onSelect,
      ...otherProps
    } = this.props;

    return (
      <div
        ref="list"
        className={
          classNames(
            'coral-BasicList',
            className
          )
        }
        {...otherProps}
      >
        {
          React.Children.map(children, child => (
            React.cloneElement(child, {
              onSelect,
              onFocusNext: this.handleFocusNext,
              onFocusPrevious: this.handleFocusPrevious,
              onFocusFirst: this.handleFocusFirst,
              onFocusLast: this.handleFocusLast
            })
          ))
        }
      </div>
    );
  }
}
