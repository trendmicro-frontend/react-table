import cx from 'classnames';
import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Context from './context';
import styles from './index.styl';
import TableTemplate from './TableTemplate';

class Table extends Component {
    static propTypes = {
        bordered: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        height: PropTypes.number,
        hideHeader: PropTypes.bool,
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        loaderRender: PropTypes.func,
        onRowClick: PropTypes.func,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selectedRowKeys: PropTypes.array,
        useFixedHeader: PropTypes.bool,
        width: PropTypes.number.isRequired,
    };

    static defaultProps = {
        columns: [],
        data: [],
        expandedRowKeys: [],
        height: 0,
        selectedRowKeys: [],
    };

    constructor(props) {
        super(props);
        this.setScrollLeft = (scrollLeft) => {
            this.setState({
                scrollLeft: scrollLeft
            });
        };

        // State also contains the updater function so it will
        // be passed down into the context provider
        this.state = {
            scrollLeft: 0,
            prevColumns: [],
            thisColumns: [],
            setScrollLeft: this.setScrollLeft,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const columnsAreChanged = !isEqual(
            props.columns,
            state.prevColumns
        );

        if (columnsAreChanged) {
            const { columns: initColumns, width: tableWidth } = props;
            const columns = initColumns.map(column => {
                let columnWidth = column.width;
                if (typeof columnWidth === 'string') {
                    const lastChar = columnWidth.substr(columnWidth.length - 1);
                    if (lastChar === '%') {
                        columnWidth = tableWidth * (parseFloat(columnWidth) / 100);
                        return {
                            ...column,
                            width: columnWidth
                        };
                    }
                }
                return column;
            });
            const customWidthColumns = columns.filter(column => !!column.width);
            const customWidthColumnsTotalWidth = customWidthColumns.reduce((accumulator, column) => accumulator + column.width, 0);
            let averageWidth = (tableWidth - customWidthColumnsTotalWidth) / (columns.length - customWidthColumns.length);
            averageWidth = averageWidth <= 0 ? 150 : averageWidth;
            const parsedColumns = columns.map(column => {
                if (!!column.width) {
                    return column;
                }
                return {
                    ...column,
                    width: averageWidth
                };
            });

            return {
                prevColumns: props.columns,
                thisColumns: parsedColumns,
            };
        }
        return null;
    }

    renderTable = () => {
        const columns = this.state.thisColumns;
        const {
            data,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            height,
            hideHeader,
            loading,
            onRowClick,
            rowClassName,
            rowKey,
            selectedRowKeys,
            useFixedHeader,
            width,
        } = this.props;

        return (
            <TableTemplate
                columns={columns}
                data={data}
                emptyText={emptyText}
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
                height={height}
                hideHeader={hideHeader}
                loading={loading}
                onRowClick={onRowClick}
                rowClassName={rowClassName}
                rowKey={rowKey}
                selectedRowKeys={selectedRowKeys}
                useFixedHeader={useFixedHeader}
                width={width}
            />
        );
    };

    renderLoader = () => {
        const { loaderRender, hideHeader } = this.props;
        const loaderOverlayClassName = hideHeader ? cx(styles.loaderOverlay, styles.noHeader) : styles.loaderOverlay;
        const defaultLoader = () => {
            return (
                <div className={loaderOverlayClassName}>
                    <span className={cx(styles.loader, styles.loaderLarge)} />
                </div>
            );
        };
        const loader = loaderRender || defaultLoader;
        return loader();
    };

    render() {
        const {
            bordered,
            data,
            hoverable,
            loading,
            ...props
        } = this.props;

        delete props.columns;
        delete props.emptyText;
        delete props.expandedRowRender;
        delete props.expandedRowKeys;
        delete props.height;
        delete props.hideHeader;
        delete props.loaderRender;
        delete props.onRowClick;
        delete props.rowClassName;
        delete props.rowKey;
        delete props.selectedRowKeys;
        delete props.useFixedHeader;
        delete props.width;

        return (
            <Context.Provider value={this.state}>
                <div
                    {...props}
                    className={cx(
                        styles.tableWrapper,
                        { [styles.tableMinimalism]: !bordered },
                        { [styles.tableBordered]: bordered },
                        { [styles.tableNoData]: !data || data.length === 0 },
                        { [styles.tableHover]: hoverable }
                    )}
                >
                    { this.renderTable() }
                    { loading && this.renderLoader() }
                </div>
            </Context.Provider>
        );
    }
}

export default Table;
