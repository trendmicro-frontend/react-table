import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
import styles from './index.styl';
import TableRow from './TableRow';

class TableBody extends PureComponent {
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
        scrollTop: PropTypes.number,
        setScrollLeft: PropTypes.func,
        setScrollTop: PropTypes.func,
        tableRole: PropTypes.string, // present fixed left table or normal table
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        records: [],
        rowKey: 'key',
        rowClassName: () => {}
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.scrollTop !== prevProps.scrollTop) {
            const { scrollTop } = this.props;
            if (this.body.scrollTop !== scrollTop) {
                this.body.scrollTop = scrollTop;
            }
        }
    }

    onScroll = (e) => {
        e.stopPropagation();
        const {
            scrollLeft,
            setScrollLeft,
            setScrollTop,
            tableRole
        } = this.props;
        setScrollTop(e.target.scrollTop);
        setScrollLeft(tableRole === 'leftTable' ? scrollLeft : e.target.scrollLeft);
    };

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        let key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
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
            records,
            rowClassName
        } = this.props;
        const noData = (!records || records.length === 0);
        return (
            <Context.Consumer>
                {({
                    currentHoverKey,
                    setCurrentHoverKey,
                }) => (
                    <div
                        className={styles.tbody}
                        ref={node => {
                            this.body = node;
                        }}
                        onScroll={this.onScroll}
                    >
                        {
                            records.map((row, index) => {
                                const key = this.getRowKey(row, index);
                                const className = rowClassName(row, key);
                                const hovered = currentHoverKey === key;
                                const isExpanded = expandedRowRender && expandedRowKeys.indexOf(key) >= 0;
                                return (
                                    <TableRow
                                        className={className}
                                        columns={columns}
                                        expandedRowKeys={expandedRowKeys}
                                        expandedRowRender={expandedRowRender}
                                        hovered={hovered}
                                        isExpanded={isExpanded}
                                        key={key}
                                        onRowClick={onRowClick}
                                        record={row}
                                        rowKey={key}
                                        rowIndex={index}
                                        setCurrentHoverKey={setCurrentHoverKey}
                                    />
                                );
                            })
                        }
                        {
                            noData && !loading &&
                            <div className={styles.tablePlaceholder}>
                                { emptyText() }
                            </div>
                        }
                        {
                            noData && loading &&
                            <div className={styles.tableNoDataLoader} />
                        }
                    </div>
                )}
            </Context.Consumer>
        );
    }
}

export default TableBody;
