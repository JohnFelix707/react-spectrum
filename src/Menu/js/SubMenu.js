import autobind from 'autobind-decorator';
import classNames from 'classnames';
import createId from '../../utils/createId';
import Menu from './Menu';
import MenuItem from './MenuItem';
import OverlayTrigger from '../../OverlayTrigger';
import PropTypes from 'prop-types';
import React, {cloneElement, Component} from 'react';
import ReactDOM from 'react-dom';

/**
 * A menu item that has a sub menu under it that is opened on hover.
 */
@autobind
export default class SubMenu extends Component {
  static displayName = 'SubMenu';
  static propTypes = {
    ...MenuItem.propTypes,

    /**
     * A custom classname to be applied to the menu item
     */
    className: PropTypes.string,

    /**
     * A select handler for the submenu, triggered whenever an item is selected.
     */
    onSelect: PropTypes.func
  };

  state = {
    opened: false
  }

  menuId = createId();
  subMenuId = createId();

  handleKeyDown(event) {
    const {onKeyDown} = this.props;
    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        event.preventDefault();
        this.setState({opened: false});
        break;

      case 'Enter':
      case ' ':
      case 'ArrowRight':
      case 'Right':
        event.preventDefault();
        this.setState({opened: true});
        break;
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  handleSubMenuKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        event.preventDefault();
        this.setState({opened: false});
        break;
    }
  }

  hide() {
    this.hideAnimationFrame = requestAnimationFrame(() => this.setState({opened: false}));
  }

  show() {
    if (this.hideAnimationFrame) {
      cancelAnimationFrame(this.hideAnimationFrame);
    }
    requestAnimationFrame(() => this.setState({opened: true}));
    if (this.props._onNestedSubmenuOpen) {
      this.props._onNestedSubmenuOpen();
    }
  }

  cloneItem(item) {
    const props = {
      ...item.props,
      onKeyDown: this.handleSubMenuKeyDown
    };
    if (item.type === SubMenu) {
      props._onNestedSubmenuOpen = this.show;
    }
    return cloneElement(item, props);
  }

  onExited() {
    ReactDOM.findDOMNode(this.menuItem).focus();
  }

  render() {
    const {
      children,
      onSelect,
      label,
      className,
      ...otherProps
    } = this.props;

    return (
      <OverlayTrigger
        placement="right top"
        offset={-10}
        crossOffset={-4}
        selected={false}
        show={this.state.opened}
        onExited={this.onExited}>
        <MenuItem
          id={this.menuId}
          className={
            classNames(
              {
                'is-open': this.state.opened
              },
              className
            )
          }
          ref={r => this.menuItem = r}
          aria-haspopup="menu"
          aria-expanded={this.state.opened}
          aria-owns={this.subMenuId}
          {...otherProps}
          onKeyDown={otherProps.disabled ? undefined : this.handleKeyDown}
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          hasNestedMenu>
          {label}
        </MenuItem>
        <Menu
          id={this.subMenuId}
          onSelect={onSelect}
          autoFocus
          aria-labelledby={this.menuId}
          onMouseEnter={this.show}
          onMouseLeave={this.hide}>
          {React.Children.toArray(children).map(this.cloneItem)}
        </Menu>
      </OverlayTrigger>
    );
  }
}
