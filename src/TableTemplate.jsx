import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        onRowClick: PropTypes.func,
        showHeader: PropTypes.bool,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        scrollTop: PropTypes.number
    };

    static defaultProps = {
        showHeader: true
    };

    state = this.getInitState();

    actions = {
        handleBodyScroll: (e) => {
            const { onScroll } = this.props;
            this.setState({
                scrollLeft: e.target.scrollLeft
            });
            onScroll(e);
        }
    };

    getInitState() {
        return {
            scrollLeft: 0
        };
    }

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
            currentHoverKey,
            data,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            onMouseOver,
            onTouchStart,
            onRowHover,
            onRowClick,
            rowClassName,
            rowKey,
            scrollTop
        } = this.props;
        const { handleBodyScroll } = this.actions;
        return (
            <TableBody
                columns={columns}
                currentHoverKey={currentHoverKey}
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
                emptyText={emptyText}
                onMouseOver={onMouseOver}
                onTouchStart={onTouchStart}
                onRowHover={onRowHover}
                onRowClick={onRowClick}
                onScroll={handleBodyScroll}
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
