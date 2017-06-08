import classNames from 'classnames';
import Icon from '../../Icon';
import {interpretKeyboardEvent} from '../../utils/events';
import React, {Component} from 'react';

export default class ListItem extends Component {
  static defaultProps = {
    iconSize: 'S',
    selected: false,
    disabled: false,
    onSelect: function () {},
    onFocusNext: function () {},
    onFocusPrevious: function () {},
    onFocusFirst: function () {},
    onFocusLast: function () {}
  }

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else {
      this.onSelectFocused(e);
    }
  }

  handleMouseEnter = e => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    } else {
      e.target.focus();
    }
  }

  onSelectFocused = e => {
    this.props.onSelect(this.props.value, e);
  }

  onFocusFirst = e => {
    this.props.onFocusFirst(e);
  }

  onFocusLast = e => {
    this.props.onFocusLast(e);
  }

  onFocusPrevious = e => {
    this.props.onFocusPrevious(e);
  }

  onFocusNext = e => {
    this.props.onFocusNext(e);
  }

  render() {
    const {
      icon,
      iconSize,
      label,
      className,
      children,
      selected,
      disabled,
      focused,
      role = 'option',
      ...otherProps
    } = this.props;

    return (
      <li
        className={
          classNames(
            'coral-BasicList-item',
            {
              'is-selected': selected,
              'is-disabled': disabled,
              'is-focused': focused
            },
            className
          )
        }
        onKeyDown={!disabled && interpretKeyboardEvent.bind(this)}
        onMouseEnter={disabled ? null : this.handleMouseEnter}
        onClick={!disabled && this.handleClick}
        tabIndex="0"
        role={role}
        aria-checked={selected}
        aria-selected={selected}
        aria-disabled={disabled}
        { ...otherProps }
      >
        {icon &&
          <Icon className="coral-BasicList-item-icon" icon={ icon } size={ iconSize } />
        }
        <div className="coral-BasicList-item-content">
          {label || children}
        </div>
      </li>
    );
  }
}
