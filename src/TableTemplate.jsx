import 'react-perfect-scrollbar/dist/css/styles.css';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Context from './context';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends Component {
    static propTypes = {
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        height: PropTypes.number,
        hideHeader: PropTypes.bool,
        loading: PropTypes.bool,
        onRowClick: PropTypes.func,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selectedRowKeys: PropTypes.array,
        useFixedHeader: PropTypes.bool,
        width: PropTypes.number,
    };

    onScrollX = (setScrollLeft) => (container) => {
        setScrollLeft(container.scrollLeft);
    };

    renderHeader = () => {
        const {
            columns,
            width: tableWidth
        } = this.props;
        return (
            <Context.Consumer>
                {({
                    scrollLeft,
                }) => (
                    <TableHeader
                        columns={columns}
                        scrollLeft={scrollLeft}
                        width={tableWidth}
                    />
                )}
            </Context.Consumer>
        );
    };

    renderBody = () => {
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
            selectedRowKeys,
            width: tableWidth,
        } = this.props;

        return (
            <Context.Consumer>
                {({
                    scrollLeft,
                }) => (
                    <TableBody
                        columns={columns}
                        emptyText={emptyText}
                        expandedRowKeys={expandedRowKeys}
                        expandedRowRender={expandedRowRender}
                        loading={loading}
                        onRowClick={onRowClick}
                        records={data}
                        rowClassName={rowClassName}
                        rowKey={rowKey}
                        scrollLeft={scrollLeft}
                        selectedRowKeys={selectedRowKeys}
                        width={tableWidth}
                    />
                )}
            </Context.Consumer>
        );
    };

    render() {
        const {
            hideHeader,
            height,
            useFixedHeader,
        } = this.props;
        const tableHeight = !!height ? height : 'auto';

        if (!useFixedHeader) {
            return (
                <div
                    className={styles.table}
                    style={{
                        height: tableHeight
                    }}
                >
                    <PerfectScrollbar>
                        { !hideHeader && this.renderHeader() }
                        { this.renderBody() }
                    </PerfectScrollbar>
                </div>
            );
        }

        return (
            <Context.Consumer>
                {({
                    setScrollLeft,
                }) => (
                    <div
                        className={styles.table}
                        style={{
                            height: tableHeight
                        }}
                    >
                        { !hideHeader && this.renderHeader() }
                        <PerfectScrollbar onScrollX={this.onScrollX(setScrollLeft)}>
                            { this.renderBody() }
                        </PerfectScrollbar>
                    </div>
                )}
            </Context.Consumer>
        );
    }
}

export default TableTemplate;
