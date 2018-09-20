import classNames from 'classnames';
import LabelBase from './LabelBase';
import PropTypes from 'prop-types';
import React from 'react';

importSpectrumCSS('fieldlabel');

export default function FieldLabel({label, position, children, className, labelFor, ...otherProps}) {
  return (
    <LabelBase
      label={label}
      className={className}
      componentName="FieldLabel"
      labelClassName={classNames(
        'spectrum-FieldLabel',
        {
          'spectrum-FieldLabel--left': position === 'left',
          'spectrum-FieldLabel--right': position === 'right'
        }
      )}
      labelFor={labelFor}
      {...otherProps}>
      {children}
    </LabelBase>
  );
}

FieldLabel.displayName = 'FieldLabel';

FieldLabel.propTypes = {
  /**
   * String to display
   */
  label: PropTypes.string.isRequired,

  /**
   * Justification of the label text within its container. Setting this property
   * will situate the label container to the left of the form field, regardless
   * of the property value.
   */
  position: PropTypes.oneOf(['left', 'right']),

  /**
   * Custom classname to apply to the label
   */
  className: PropTypes.string,

  /**
   * Like in a form, what input should the label be associated with
   */
  labelFor: PropTypes.string
};
