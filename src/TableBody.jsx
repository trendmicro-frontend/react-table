
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './index.styl';
import TableRow from './TableRow';

class TableBody extends Component {
    static propTypes = {
        columns: PropTypes.array,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        loading: PropTypes.bool,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollLeft: PropTypes.number,
        selectedRowKeys: PropTypes.array,
        setScrollLeft: PropTypes.func,
        width: PropTypes.number,
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        records: [],
        rowClassName: () => {},
        rowKey: 'key',
    };

    getRowKey = (record, index) => {
        const rowKey = this.props.rowKey;
        const key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
        return key === undefined ? `table_row_${index}` : key;
    }

    render() {
        const {
            columns,
            expandedRowKeys,
            expandedRowRender,
            emptyText,
            loading,
            onRowClick,
            selectedRowKeys,
            records,
            rowClassName,
            width,
        } = this.props;
        const noData = (!records || records.length === 0);
        return (
            <div
                className={styles.tbody}
                style={{ width: width }}
            >
                {
                    records.map((row, index) => {
                        const key = this.getRowKey(row, index);
                        const className = rowClassName(row, key);
                        const isExpanded = expandedRowRender && expandedRowKeys.indexOf(key) >= 0;
                        const isSelected = selectedRowKeys.indexOf(key) >= 0;
                        return (
                            <TableRow
                                key={key}
                                className={className}
                                columns={columns}
                                expandedRowRender={expandedRowRender}
                                isExpanded={isExpanded}
                                isSelected={isSelected}
                                onRowClick={onRowClick}
                                record={row}
                                rowKey={key}
                                rowIndex={index}
                            />
                        );
                    })
                }
                {
                    noData && !loading && (
                        <div className={styles.tablePlaceholder}>
                            { emptyText() }
                        </div>
                    )
                }
                {
                    noData && loading && (
                        <div className={styles.tableNoDataLoader} />
                    )
                }
            </div>
        );
    }
}

export default TableBody;
