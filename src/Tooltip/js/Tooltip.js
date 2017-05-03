import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';


import '../style/index.styl';

const ARROWS = {
  right: 'arrowRight',
  left: 'arrowLeft',
  bottom: 'arrowDown',
  top: 'arrowUp'
};

export default class Tooltip extends Component {
  static propTypes = {
    placement: PropTypes.string,
    variant: PropTypes.oneOf(['inspect', 'info', 'success', 'error']),
    className: PropTypes.string
  };

  static defaultProps = {
    variant: 'inspect',
    placement: 'right',
    open: true
  };

  render() {
    const {
      variant,
      children,
      className,
      placement,
      ...otherProps
    } = this.props;

    return (
      <div
        className={
          classNames(
            'coral3-Tooltip',
            `coral3-Tooltip--${variant}`,
            `coral3-Tooltip--${ARROWS[placement]}`,
            {
              'coral3-Tooltip-drop-after-open': open
            },
            className
          )
        }
        {...otherProps}>
          {children}
      </div>
    );
  }
}

Tooltip.displayName = 'Tooltip';
