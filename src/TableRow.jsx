import cx from 'classnames';
import ensureArray from 'ensure-array';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableCell from './TableCell';

class TableRow extends Component {
    static propTypes = {
        className: PropTypes.string,
        columns: PropTypes.array,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        hovered: PropTypes.bool,
        isExpanded: PropTypes.bool,
        onRowClick: PropTypes.func,
        record: PropTypes.object,
        rowKey: PropTypes.any,
        rowIndex: PropTypes.number,
        setCurrentHoverKey: PropTypes.func,
    };

    static defaultProps = {
        expandedRowKeys: [],
        expandedRowRender: () => {},
        onRowClick: () => {},
        record: {},
        setCurrentHoverKey: () => {},
    };

    handleRowClick = (event) => {
        const { onRowClick, record, rowIndex } = this.props;
        onRowClick(record, rowIndex, event);
    };

    handleRowMouseEnter = (event) => {
        const { rowKey, setCurrentHoverKey, hovered } = this.props;
        if (!hovered) {
            setCurrentHoverKey(rowKey);
        }
    };

    handleRowMouseLeave = (event) => {
        const { setCurrentHoverKey, hovered } = this.props;
        if (hovered) {
            setCurrentHoverKey(null);
        }
    };

    isRowExpanded = (record, rowKey) => {
        const expandedRows = ensureArray(this.props.expandedRowKeys)
            .filter(expandedRowKey => (expandedRowKey === rowKey));
        return expandedRows.length > 0;
    };

    shouldComponentUpdate(nextProps, nextState) {
        const columnEqual = isEqual(
            nextProps.columns.map(it => ({ key: it.key, sortOrder: it.sortOrder })),
            this.props.columns.map(it => ({ key: it.key, sortOrder: it.sortOrder }))
        );
        const recordEqual = isEqual(nextProps.record, this.props.record);
        return (
            this.props.className !== nextProps.className
            ||
            this.props.hovered !== nextProps.hovered
            ||
            !columnEqual
            ||
            !recordEqual
            ||
            this.props.isExpanded !== nextProps.isExpanded
        );
    }

    componentDidMount() {
        this.row.addEventListener('mouseenter', this.handleRowMouseEnter);
        this.row.addEventListener('mouseleave', this.handleRowMouseLeave);
    }

    componentWillUnmount() {
        this.row.removeEventListener('mouseenter', this.handleRowMouseEnter);
        this.row.removeEventListener('mouseleave', this.handleRowMouseLeave);
    }

    render() {
        const {
            columns,
            hovered,
            expandedRowRender,
            rowKey,
            rowIndex,
            record,
            className,
            isExpanded
        } = this.props;

        return (
            <div
                className={cx(
                    styles.tr,
                    className,
                    { [styles['tr-hover']]: hovered }
                )}
                ref={node => {
                    this.row = node;
                }}
                role="presentation"
                onClick={this.handleRowClick}
            >
                {columns.map((column, index) => {
                    const key = `${rowKey}_${index}`;
                    // dataKey is an alias for dataIndex
                    const dataKey = (typeof column.dataKey !== 'undefined')
                        ? column.dataKey
                        : column.dataIndex;
                    let cellValue = get(record, dataKey);
                    if (typeof column.render === 'function') {
                        cellValue = column.render(cellValue, record, rowIndex);
                    }

                    return (
                        <TableCell
                            key={key}
                            className={cx(column.className, column.cellClassName)}
                            style={{
                                ...column.style,
                                ...column.cellStyle
                            }}
                        >
                            {cellValue}
                        </TableCell>
                    );
                })}
                {isExpanded && expandedRowRender &&
                <div className={styles['tr-expand']}>
                    {expandedRowRender(record, rowIndex)}
                </div>
                }
            </div>
        );
    }
}

export default TableRow;
