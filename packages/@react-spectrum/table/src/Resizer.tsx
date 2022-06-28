/* eslint-disable jsx-a11y/role-supports-aria-props */
import {classNames} from '@react-spectrum/utils';
import {GridNode} from '@react-types/grid';
// @ts-ignore
import intlMessages from '../intl/*.json';
import React, {RefObject} from 'react';
import styles from '@adobe/spectrum-css-temp/components/table/vars.css';
import {useLocale, useMessageFormatter} from '@react-aria/i18n';
import {useTableColumnResize} from '@react-aria/table';
import {useTableContext} from './TableView';

interface ResizerProps<T> {
  column: GridNode<T>,
  tableRef: RefObject<HTMLElement>,
  showResizer: boolean,
  onResizeDone: () => void,
  onResizeEntered: () => void
}

function Resizer<T>(props: ResizerProps<T>, ref: RefObject<HTMLDivElement>) {
  let {column, showResizer} = props;
  let {state, columnState} = useTableContext();
  let formatMessage = useMessageFormatter(intlMessages);
  let {direction} = useLocale();

  let {resizerProps} = useTableColumnResize({...props, label: formatMessage('columnResizer')}, {...state, ...columnState}, ref);

  let style = {
    cursor: undefined,
    height: '100%',
    display: showResizer ? 'block' : 'none'
  };
  if (columnState.getColumnMinWidth(column.key) >= columnState.getColumnWidth(column.key)) {
    style.cursor = direction === 'rtl' ? 'w-resize' : 'e-resize';
  } else if (columnState.getColumnMaxWidth(column.key) <= columnState.getColumnWidth(column.key)) {
    style.cursor = direction === 'rtl' ? 'e-resize' : 'w-resize';
  } else {
    style.cursor = 'col-resize';
  }
  return (
    <div
      ref={ref}
      {...resizerProps}
      style={style}
      className={classNames(styles, 'spectrum-Table-columnResizer')} />
  );
}

const _Resizer = React.forwardRef(Resizer);
export {_Resizer as Resizer};
