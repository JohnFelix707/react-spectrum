import classNames from 'classnames';
import React from 'react';
import TableSortArrow from '../../Icon/core/TableSortArrow';

export default class TableCell extends React.Component {
  getCellStyle(column) {
    let style = {
      width: column.width,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth
    };

    if (column.width) {
      style.flexShrink = 0;
    } else {
      style.flexGrow = 1;
    }

    return style;
  }

  render() {
    let {column, isHeaderRow, sortDir, onClick, onDoubleClick, className, children} = this.props;
    let isSortable = isHeaderRow && column && column.sortable;
    className = classNames(className, {
      'spectrum-Table-headCell': isHeaderRow,
      'spectrum-Table-cell': !isHeaderRow,
      'is-sortable': isSortable,
      'is-sorted-desc': isHeaderRow && sortDir === 1,
      'is-sorted-asc': isHeaderRow && sortDir === -1,
      'spectrum-Table-cell--divider': !isHeaderRow && column && column.divider,
      'spectrum-Table-cell--alignCenter': column && column.align === 'center',
      'spectrum-Table-cell--alignRight': column && column.align === 'right'
    });

    return (
      <div className={className} style={column && this.getCellStyle(column)} onClick={onClick} onDoubleClick={onDoubleClick}>
        {children}
        {isSortable &&
          <TableSortArrow className="spectrum-Table-sortedIcon" size={null} />
        }
      </div>
    );
  }
}
