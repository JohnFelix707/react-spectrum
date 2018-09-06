import CheckmarkMedium from '../../Icon/core/CheckmarkMedium';
import classNames from 'classnames';
import {cloneIcon} from '../../utils/icon';
import {interpretKeyboardEvent} from '../../utils/events';
import React, {Component} from 'react';

/**
 * An item in a list
 */
export default class ListItem extends Component {
  static defaultProps = {
    selected: false,
    disabled: false,
    onSelect: function () {}
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
      e.currentTarget.focus();
    }
  }

  handleFocus = e => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleBlur = e => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onSelectFocused = e => {
    if (this.props.onSelect) {
      e.preventDefault();
      this.props.onSelect(this.props.value, e);
    }
  }

  render() {
    const {
      icon,
      label,
      className,
      children,
      selected,
      disabled,
      focused,
      tabIndex = 0,
      role = 'option',
      ...otherProps
    } = this.props;

    // We don't need/want to add onFocusNext to the accordion header div because we call it manually when arrow key, home or end is pressed with focus on accordion header.
    delete otherProps.onFocusNext;
    delete otherProps.onFocusPrevious;
    delete otherProps.onFocusFirst;
    delete otherProps.onFocusLast;
    delete otherProps.onPageDown;
    delete otherProps.onPageUp;
    delete otherProps.onTab;
    delete otherProps.onFocus;
    delete otherProps.onBlur;
    delete otherProps.value;

    return (
      <li
        className={
          classNames(
            'spectrum-Menu-item',
            {
              'is-selected': selected,
              'is-disabled': disabled,
              'is-focused': focused
            },
            className
          )
        }
        onKeyDown={disabled ? null : interpretKeyboardEvent.bind(this)}
        onMouseEnter={disabled ? null : this.handleMouseEnter}
        onClick={disabled ? null : this.handleClick}
        onFocus={disabled ? null : this.handleFocus}
        onBlur={this.handleBlur}
        tabIndex={!disabled ? tabIndex : null}
        role={role}
        aria-checked={role === 'menuitemcheckbox' || role === 'menuitemradio' ? !!selected : null}
        aria-selected={role === 'option' ? (!!selected || !!focused) : null}
        aria-disabled={disabled || null}
        {...otherProps}>
        {cloneIcon(icon, {
          size: 'S'
        })}
        <span className="spectrum-Menu-itemLabel">{label || children}</span>
        {selected && <CheckmarkMedium size={null} className="spectrum-Menu-checkmark" />}
      </li>
    );
  }
}
