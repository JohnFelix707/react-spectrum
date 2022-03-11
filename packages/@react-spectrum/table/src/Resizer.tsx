/* eslint-disable jsx-a11y/role-supports-aria-props */
import {classNames} from '@react-spectrum/utils';
import {FocusRing} from '@react-aria/focus';
import React from 'react';
import styles from '@adobe/spectrum-css-temp/components/table/vars.css';
import {useTableColumnResize} from '@react-aria/table/src/useTableColumnResize';


function Resizer(props, ref) {
  const {state, item} = props;
  let {resizerProps} = useTableColumnResize(state, item, ref);
  return (
    <FocusRing focusRingClass={classNames(styles, 'focus-ring')}>
      <div
        ref={ref}
        {...resizerProps}
        className={classNames(styles, 'spectrum-Table-columnResizer')}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize column"
        aria-valuenow={state.getColumnWidth(item.key)}
        aria-valuemin={state.getColumnMinWidth(item.key)}
        aria-valuemax={state.getColumnMaxWidth(item.key)} />
    </FocusRing>
  );
}

const _Resizer = React.forwardRef(Resizer);
export {_Resizer as Resizer};
