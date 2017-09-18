import classNames from 'classnames';
import React from 'react';

export default function TD({
  className,
  children,
  ...otherProps
}) {
  return (
    <td
      className={
        classNames(
          'spectrum-Table-cell',
          className
        )
      }
      {...otherProps}>
      {children}
    </td>
  );
}

TD.displayName = 'TD';
