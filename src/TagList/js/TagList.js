import classNames from 'classnames';
import filterDOMProps from '../../utils/filterDOMProps';
import React from 'react';
import Tag from './Tag';

importSpectrumCSS('tags');

/**
 * A TagList displays a list of Tags
 */
export default class TagList extends React.Component {
  static displayName = 'TagList';

  static defaultProps = {
    readOnly: false,
    disabled: false,
    required: false,
    invalid: false,
    onClose: function () {},
    onFocus: function () {},
    onBlur: function () {}
  };

  state = {
    selectedIndex: null,
    focused: false
  }

  handleFocus = e => {
    const {onFocus} = this.props;
    this.setState({focused: true});
    onFocus(e);
  }

  handleBlur = e => {
    const {onBlur} = this.props;
    this.setState({focused: false});
    onBlur(e);
  }

  baseChildProps(index) {
    const {readOnly, onClose, disabled} = this.props;
    const {selectedIndex, focused} = this.state;
    return {
      key: index,
      selected: !disabled && focused && selectedIndex === index,
      tabIndex: !disabled && selectedIndex === index ? 0 : -1,
      closable: !readOnly,
      disabled,
      onClose,
      role: 'option'
    };
  }

  renderChildren() {
    if (this.props.values) {
      return this.renderValues();
    }
    return React.Children.map(this.props.children, (child, index) =>
      React.cloneElement(child, this.baseChildProps(index))
    );
  }

  renderValues() {
    const {values} = this.props;
    return values.map((value, index) => (
      <Tag value={value} {...this.baseChildProps(index)}>
        {value}
      </Tag>
    ));
  }

  render() {
    const {
      className,
      name,
      readOnly,
      disabled,
      required,
      invalid,
      ...otherProps
    } = this.props;

    const {focused} = this.state;

    return (
      <div
        {...filterDOMProps(otherProps)}
        className={
          classNames(
            'spectrum-Tags',
            {
              'is-disabled': disabled
            },
            className
          )
        }
        name={name}
        readOnly={readOnly}
        disabled={disabled}
        role="listbox"
        aria-atomic="false"
        aria-relevant="additions"
        aria-live={focused ? 'polite' : 'off'}
        aria-disabled={disabled}
        aria-invalid={invalid}
        aria-required={required}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}>
        {this.renderChildren()}
      </div>
    );
  }
}
