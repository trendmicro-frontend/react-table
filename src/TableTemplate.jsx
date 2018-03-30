import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        table: PropTypes.any,
        columns: PropTypes.array,
        hoveredRowKey: PropTypes.any,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        loading: PropTypes.bool,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number,
        disableHeader: PropTypes.bool,
        fixedHeader: PropTypes.bool,

        onRowsRendered: PropTypes.func,
        rowCount: PropTypes.number,
        rowHeight: PropTypes.number,
        rowGetter: PropTypes.func
    };

    static defaultProps = {
        disableHeader: false
    };

    state = {
        scrollLeft: 0
    };

    handleBodyScroll = (event) => {
        const { onScroll, disableHeader, fixedHeader } = this.props;
        // scrollLeft is for scrolling table header and body at the same time.
        if (!disableHeader && fixedHeader) {
            this.setState({
                scrollLeft: event.target.scrollLeft
            });
        }
        onScroll(event);
    };

    renderHeader() {
        const { columns } = this.props;
        const { scrollLeft } = this.state;
        return (
            <TableHeader
                scrollLeft={scrollLeft}
                columns={columns}
                ref={node => {
                    if (node) {
                        this.tableHeader = node;
                    }
                }}
            />
        );
    }

    renderBody() {
        const {
            table,
            columns,
            hoveredRowKey,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            loading,
            onMouseOver,
            onTouchStart,
            onRowHover,
            onRowClick,
            rowClassName,
            rowKey,
            scrollTop,
            fixedHeader,

            onRowsRendered,
            rowCount,
            rowHeight,
            rowGetter
        } = this.props;

        return (
            <TableBody
                table={table}
                columns={columns}
                hoveredRowKey={hoveredRowKey}
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
                emptyText={emptyText}
                loading={loading}
                onMouseOver={onMouseOver}
                onTouchStart={onTouchStart}
                onRowHover={onRowHover}
                onRowClick={onRowClick}
                onScroll={this.handleBodyScroll}
                scrollTop={scrollTop}
                fixedHeader={fixedHeader}
                ref={node => {
                    if (node) {
                        this.tableBody = node;
                    }
                }}
                rowClassName={rowClassName}
                rowKey={rowKey}

                onRowsRendered={onRowsRendered}
                rowCount={rowCount}
                rowHeight={rowHeight}
                rowGetter={rowGetter}
            />
        );
    }

    render() {
        const {
            className,
            disableHeader
        } = this.props;

        return (
            <div
                ref={node => {
                    if (node) {
                        this.table = node;
                    }
                }}
                className={classNames(
                    className,
                    styles.table
                )}
            >
                { !disableHeader && this.renderHeader() }
                { this.renderBody() }
            </div>
        );
    }
}

export default TableTemplate;
