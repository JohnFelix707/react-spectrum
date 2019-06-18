/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

import classNames from 'classnames';
import filterDOMProps from '../../utils/filterDOMProps';
import PropTypes from 'prop-types';
import React from 'react';

const VARIANTS = {
  1: 'display',
  2: 'pageTitle',
  3: 'subtitle1',
  4: 'subtitle2',
  5: 'subtitle3',
  6: 'subtitle3'
};

const ELEMENTS = {
  'display': 'h1',
  'pageTitle': 'h2',
  'subtitle1': 'h2',
  'subtitle2': 'h3',
  'subtitle3': 'h4'
};

export default function Heading({
  variant,
  size = 1, // back-compat
  children,
  className,
  ...otherProps
}) {
  variant = variant || VARIANTS[size] || 'display';
  const Element = ELEMENTS[variant];

  return (
    <Element
      className={
        classNames(
          'spectrum-Heading',
          `spectrum-Heading--${variant}`,
          className
        )
      }
      {...filterDOMProps(otherProps)}>
      {children}
    </Element>
  );
}

Heading.displayName = 'Heading';

Heading.propTypes = {
  /**
   * Variant of the heading to display. This maps to different heading HTML elements:
   * - display: h1
   * - pageTitle: h2
   * - subtitle1: h2
   * - subtitle2: h3
   * - subtitle3: h4
   */
  variant: PropTypes.oneOf(['display', 'pageTitle', 'subtitle1', 'subtitle2', 'subtitle3']),

  /**
   * Custom classname to apply to the heading.
   */
  className: PropTypes.string
};
