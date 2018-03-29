import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableRow from './TableRow';

const ROW_HEIGHT = 37;

class TableBody extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        hoveredRowKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        emptyText: PropTypes.func,
        loading: PropTypes.bool,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        records: PropTypes.array,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number,
        fixedHeader: PropTypes.bool,
        onRowsRendered: PropTypes.func
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

    state = {
        from: 0,
        to: this.props.records.length
    };

    handleScroll = (event) => {
        const start = Math.max(Math.floor(event.target.scrollTop / ROW_HEIGHT) - 2, 0);
        const count = Math.ceil(this.body.offsetHeight / ROW_HEIGHT) + 4;

        this.setState({
            from: start,
            to: Math.min(start + count, this.props.records.length)
        }, () => {
            if (typeof this.props.onRowsRendered === 'function') {
                this.props.onRowsRendered({
                    startIndex: this.state.from,
                    stopIndex: this.state.to
                });
            }
        });

        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(event);
        }
    };

    componentDidMount() {
        const { onMouseOver, onTouchStart, fixedHeader } = this.props;
        const scrollElement = fixedHeader ? this.body : this.body.parentElement;
        const tableBodyElement = this.body;

        scrollElement.addEventListener('scroll', this.handleScroll);
        tableBodyElement.addEventListener('mouseover', onMouseOver);
        tableBodyElement.addEventListener('touchstart', onTouchStart);

        setTimeout(() => {
            const start = 0;
            const count = Math.ceil(this.body.offsetHeight / ROW_HEIGHT) + 4;
            this.setState({
                to: Math.min(start + count, this.props.records.length)
            });
        }, 0);
    }

    componentWillUnmount() {
        const { onMouseOver, onTouchStart, fixedHeader } = this.props;
        const scrollElement = fixedHeader ? this.body : this.body.parentElement;
        const tableBodyElement = this.body;

        scrollElement.removeEventListener('scroll', this.handleScroll);
        tableBodyElement.removeEventListener('mouseover', onMouseOver);
        tableBodyElement.removeEventListener('touchstart', onTouchStart);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.scrollTop !== prevProps.scrollTop) {
            const { scrollTop } = this.props;
            if (this.body.scrollTop !== scrollTop) {
                this.body.scrollTop = scrollTop;
            }
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
            hoveredRowKey,
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
        const rows = [];

        const { from, to } = this.state;

        rows.push(
            <div key="placeholder-top" style={{ height: ROW_HEIGHT * from }} />
        );

        for (let index = from; index < to; ++index) {
            const row = records[index];
            const key = this.getRowKey(row, index);

            rows.push(
                <TableRow
                    columns={columns}
                    hoveredRowKey={hoveredRowKey}
                    expandedRowKeys={expandedRowKeys}
                    expandedRowRender={expandedRowRender}
                    rowKey={key}
                    index={index}
                    key={key}
                    onHover={onRowHover}
                    onRowClick={onRowClick}
                    record={row}
                    rowClassName={rowClassName}
                />
            );
        }

        rows.push(
            <div key="placeholder-bottom" style={{ height: ROW_HEIGHT * (records.length - to) }} />
        );

        return (
            <div
                className={styles.tbody}
                ref={node => {
                    this.body = node;
                }}
            >
                {rows}
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
