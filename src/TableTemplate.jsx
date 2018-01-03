import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        hoveredRowKey: PropTypes.any,
        data: PropTypes.array,
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
        showHeader: PropTypes.bool,
        useFixedHeader: PropTypes.bool
    };

    static defaultProps = {
        showHeader: true
    };

    state = {
        scrollLeft: 0
    };

    handleBodyScroll = (event) => {
        const { onScroll, showHeader, useFixedHeader } = this.props;
        // scrollLeft is for scrolling table header and body at the same time.
        if (showHeader && useFixedHeader) {
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
            columns,
            hoveredRowKey,
            data,
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
            scrollTop
        } = this.props;

        return (
            <TableBody
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
                records={data}
                ref={node => {
                    if (node) {
                        this.tableBody = node;
                    }
                }}
                rowClassName={rowClassName}
                rowKey={rowKey}
            />
        );
    }
    render() {
        const {
            className,
            showHeader
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
                { showHeader && this.renderHeader() }
                { this.renderBody() }
            </div>
        );
    }
}

export default TableTemplate;
