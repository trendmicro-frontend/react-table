import classNames from 'classnames';
import ensureArray from 'ensure-array';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableCell from './TableCell';

class TableRow extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        hoveredRowKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        rowKey: PropTypes.any,
        index: PropTypes.number,
        onHover: PropTypes.func,
        onRowClick: PropTypes.func,
        record: PropTypes.object,
        rowClassName: PropTypes.func
    };

    static defaultProps = {
        expandedRowKeys: [],
        expandedRowRender: () => {},
        onHover: () => {},
        onRowClick: () => {},
        record: {},
        rowClassName: () => {
            return '';
        }
    };

    handleRowClick = (event) => {
        const { onRowClick, record, index } = this.props;
        onRowClick(record, index, event);
    };

    handleRowMouseEnter = (event) => {
        const { rowKey, onHover } = this.props;
        onHover(true, rowKey);
    }

    handleRowMouseLeave = (event) => {
        const { rowKey, onHover } = this.props;
        onHover(false, rowKey);
    };

    isRowExpanded = (record, rowKey) => {
        const expandedRows = ensureArray(this.props.expandedRowKeys)
            .filter(expandedRowKey => (expandedRowKey === rowKey));
        return expandedRows.length > 0;
    };

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
            hoveredRowKey,
            expandedRowRender,
            rowKey,
            record,
            rowClassName
        } = this.props;
        const className = rowClassName(record, rowKey);
        const isRowExpanded = this.isRowExpanded(record, rowKey);
        let expandedRowContent;
        if (expandedRowRender && isRowExpanded) {
            expandedRowContent = expandedRowRender(record, rowKey);
        }
        return (
            <div
                className={classNames(
                    styles.tr,
                    className,
                    { [styles['tr-hover']]: (hoveredRowKey === rowKey) }
                )}
                ref={node => {
                    this.row = node;
                }}
                role="presentation"
                onClick={this.handleRowClick}
            >
                {
                    columns.map((column, i) => {
                        const index = i++;
                        return (
                            <TableCell
                                key={`${rowKey}_${index}`}
                                column={column}
                                record={record}
                            />
                        );
                    })
                }
                {isRowExpanded &&
                <div className={styles['tr-expand']}>
                    { expandedRowContent }
                </div>
                }
            </div>
        );
    }
}

export default TableRow;
