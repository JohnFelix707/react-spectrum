import {List} from '../../List';
import Popover from '../../Popover';
import PropTypes from 'prop-types';
import React from 'react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import '../style/index.styl';

export default class Menu extends React.Component {
  static propTypes = {
    placement: PropTypes.oneOf([
      'bottom', 'bottom left', 'bottom right',
      'top', 'top left', 'top right',
      'left', 'left top', 'left bottom',
      'right', 'right top', 'right bottom'
    ]),
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    className: PropTypes.string
  };

  render() {
    const {className, open, onClose, onSelect, placement, children, style, ...otherProps} = this.props;

    return (
      <Popover isDialog={false} placement={placement} open={open} onClose={onClose} style={style}>
        <List role="menu" className={className} {...otherProps}>
          {React.Children.map(children, child => React.cloneElement(child, {onSelect}))}
        </List>
      </Popover>
    );
  }
}
