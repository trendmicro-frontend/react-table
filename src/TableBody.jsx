import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

class TableBody extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number
    };

    static defaultProps = {
        emptyText: () => {
            return 'No Data';
        },
        onMouseOver: () => {},
        onTouchStart: () => {},
        onScroll: () => {},
        records: [],
        rowKey: 'key'
    };

    componentDidMount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.addEventListener('scroll', onScroll);
        this.body.addEventListener('mouseover', onMouseOver);
        this.body.addEventListener('touchstart', onTouchStart);
    }
    componentWillUnmount() {
        const { onMouseOver, onTouchStart, onScroll } = this.props;
        this.body.removeEventListener('scroll', onScroll);
        this.body.removeEventListener('mouseover', onMouseOver);
        this.body.removeEventListener('touchstart', onTouchStart);
    }

    componentDidUpdate(prevProps, prevState) {
        const { scrollTop } = this.props;
        if (this.body.scrollTop !== scrollTop) {
            this.body.scrollTop = scrollTop;
        }
    }

    getRowKey (record, index) {
        const rowKey = this.props.rowKey;
        let key = (typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey]);
        return key === undefined ? `table_row_${index}` : key;
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowKeys,
            expandedRowRender,
            emptyText,
            loading,
            onRowHover,
            onRowClick,
            records,
            rowClassName
        } = this.props;
        const noData = (!records || records.length === 0);
        return (
            <div
                className={styles.tbody}
                ref={node => {
                    this.body = node;
                }}
            >
                {
                    records.map((row, index) => {
                        const key = this.getRowKey(row, index);
                        return (
                            <TableRow
                                columns={columns}
                                currentHoverKey={currentHoverKey}
                                expandedRowKeys={expandedRowKeys}
                                expandedRowRender={expandedRowRender}
                                hoverKey={key}
                                index={index}
                                key={key}
                                onHover={onRowHover}
                                onRowClick={onRowClick}
                                record={row}
                                rowClassName={rowClassName}
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
        );
    }
}

export default TableBody;
