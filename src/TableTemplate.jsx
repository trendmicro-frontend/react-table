import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        loading: PropTypes.bool,
        onRowClick: PropTypes.func,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        showHeader: PropTypes.bool,
        tableRole: PropTypes.string, // present fixed left table or normal table
        useFixedHeader: PropTypes.bool,
    };

    static defaultProps = {
        showHeader: true
    };

    renderHeader() {
        const { columns } = this.props;
        return (
            <Context.Consumer>
                {({ scrollLeft }) => (
                    <TableHeader
                        columns={columns}
                        scrollLeft={scrollLeft}
                        ref={node => {
                            if (node) {
                                this.tableHeader = node;
                            }
                        }}
                    />
                )}
            </Context.Consumer>
        );
    }

    renderBody() {
        const {
            columns,
            data,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            loading,
            onRowClick,
            rowClassName,
            rowKey,
            tableRole
        } = this.props;

        return (
            <Context.Consumer>
                {({
                    scrollLeft,
                    scrollTop,
                    setScrollLeft,
                    setScrollTop,
                }) => (
                    <TableBody
                        columns={columns}
                        expandedRowKeys={expandedRowKeys}
                        expandedRowRender={expandedRowRender}
                        emptyText={emptyText}
                        loading={loading}
                        onRowClick={onRowClick}
                        records={data}
                        ref={node => {
                            if (node) {
                                this.tableBody = node;
                            }
                        }}
                        rowClassName={rowClassName}
                        rowKey={rowKey}
                        scrollLeft={scrollLeft}
                        scrollTop={scrollTop}
                        setScrollLeft={setScrollLeft}
                        setScrollTop={setScrollTop}
                        tableRole={tableRole}
                    />
                )}
            </Context.Consumer>
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
