import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { connect } from 'mini-store';
import PropTypes from 'prop-types';
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
            <TableHeaderHoc>
                <TableHeader
                    columns={columns}
                    ref={node => {
                        if (node) {
                            this.tableHeader = node;
                        }
                    }}
                />
            </TableHeaderHoc>
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
            <TableBodyHoc>
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
                    tableRole={tableRole}
                />
            </TableBodyHoc>
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

const TableBodyHoc = connect((state, props) => {
    return {
        scrollTop: state.scrollTop,
        scrollLeft: state.scrollLeft,
        store: state.store
    };
})(
    props => React.cloneElement(props.children, {
        scrollTop: props.scrollTop,
        scrollLeft: props.scrolLeft,
        store: props.store
    })
);

const TableHeaderHoc = connect((state, props) => {
    return {
        scrollLeft: state.scrollLeft
    };
})(
    (props) => React.cloneElement(props.children, {
        scrollLeft: props.scrollLeft
    })
);

export default TableTemplate;
