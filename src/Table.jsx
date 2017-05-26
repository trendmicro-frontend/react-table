import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableTemplate from './TableTemplate';

class Table extends PureComponent {
    static propTypes = {
        averageColumnsWidth: PropTypes.bool,
        bordered: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        footer: PropTypes.func,
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        loaderRender: PropTypes.func,
        maxHeight: PropTypes.number,
        onRowClick: PropTypes.func,
        showHeader: PropTypes.bool,
        sortable: PropTypes.bool,
        title: PropTypes.func,
        useFixedHeader: PropTypes.bool,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    };
    static defaultProps = {
        averageColumnsWidth: true,
        columns: [],
        data: [],
        bordered: true,
        hoverable: true,
        loading: false,
        maxHeight: 0,
        sortable: false,
        useFixedHeader: false
    };

    customEvent = null;

    mainTable = null;

    state = this.getInitState();

    actions = {
        detectScrollTarget: (e) => {
            if (this.scrollTarget !== e.currentTarget) {
                this.scrollTarget = e.currentTarget;
            }
        },
        handleBodyScroll: (e) => {
            if (e.target !== this.scrollTarget) {
                return;
            }
            this.setState({
                scrollTop: e.target.scrollTop
            });
        },
        handleRowHover: (isHover, key) => {
            const { hoverable } = this.props;
            if (hoverable) {
                this.setState({
                    currentHoverKey: isHover ? key : null
                });
            }
        },
        getTableHeight: () => {
            const { maxHeight } = this.props;
            const tableTopBorder = this.tableWrapper.style['border-top-width'] || window.getComputedStyle(this.tableWrapper, null)['border-top-width'];
            const tableBottomBorder = this.tableWrapper.style['border-bottom-width'] || window.getComputedStyle(this.tableWrapper, null)['border-bottom-width'];
            const headerHeight = this.title ? this.title.getBoundingClientRect().height : 0;
            const footerHeight = this.foot ? this.foot.getBoundingClientRect().height : 0;
            const tableHeight = maxHeight - headerHeight - footerHeight - parseInt(tableTopBorder, 10) - parseInt(tableBottomBorder, 10);
            this.setState({ tableHeight });
        },
        getTableWidth: () => {
            const tableWidth = this.tableWrapper.getBoundingClientRect().width;
            if (tableWidth !== this.state.tableWidth) {
                this.setState({ tableWidth });
            }
        }
    };

    componentDidMount() {
        const { getTableHeight, getTableWidth } = this.actions;
        window.addEventListener('resize', getTableHeight);
        if (document.createEvent) {
            // IE version
            this.customEvent = document.createEvent('Event');
            this.customEvent.initEvent('checkWidth', true, true);
        } else {
            this.customEvent = new Event('checkWidth');
        }
        window.addEventListener('checkWidth', getTableWidth);
        getTableHeight();
    }

    componentWillUnmount() {
        const { getTableHeight, getTableWidth } = this.actions;
        window.removeEventListener('resize', getTableHeight);
        window.removeEventListener('checkWidth', getTableWidth);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.columns !== this.props.columns) {
            this.setState({
                thisColumns: this.columnsParser()
            });
        }
        if (prevProps.data !== this.props.data ||
            prevProps.maxHeight !== this.props.maxHeight ||
            prevProps.expandedRowKeys !== this.props.expandedRowKeys) {
            const { getTableHeight } = this.actions;
            getTableHeight();
            // Issue: Page has no vertical scrollbar at begin, but appears the scrollbar after expanding A table,
            // and B table width also displays horizontal scrollbar.
            // Solution: Add this action to check other tables size in the same page.
            window.dispatchEvent(this.customEvent);
        }
    }

    getInitState () {
        return {
            currentHoverKey: null,
            scrollTop: 0,
            tableHeight: 0,
            tableWidth: 0,
            thisColumns: this.columnsParser()
        };
    }

    columnsParser() {
        return this.props.columns.filter((column) => {
            return column;
        });
    }

    leftColumns() {
        const columns = this.state.thisColumns;
        const fixedColumns = columns.filter((column) => {
            return column.fixed === true;
        });
        const lastFixedColumn = fixedColumns[fixedColumns.length - 1];
        const lastFixedIndex = columns.lastIndexOf(lastFixedColumn);
        return columns.filter((column, index) => {
            return index <= lastFixedIndex;
        });
    }

    isAnyColumnsLeftFixed() {
        const columns = this.state.thisColumns;
        return columns.some((column) => {
            return column.fixed === true;
        });
    }

    renderTable() {
        const columns = this.state.thisColumns;
        const { currentHoverKey, scrollTop, tableHeight, tableWidth } = this.state;
        const { detectScrollTarget, handleBodyScroll, handleRowHover } = this.actions;
        return (
            <TableTemplate
                {...this.props}
                columns={columns}
                currentHoverKey={currentHoverKey}
                maxHeight={tableHeight}
                maxWidth={tableWidth}
                onMouseOver={detectScrollTarget}
                onRowHover={handleRowHover}
                onTouchStart={detectScrollTarget}
                onScroll={handleBodyScroll}
                scrollTop={scrollTop}
                ref={node => {
                    this.mainTable = node;
                }}
            />
        );
    }

    renderFixedLeftTable() {
        const { currentHoverKey, scrollTop, tableHeight, tableWidth } = this.state;
        const { detectScrollTarget, handleBodyScroll, handleRowHover } = this.actions;
        let fixedColumns = this.leftColumns();
        return (
            <TableTemplate
                {...this.props}
                columns={fixedColumns}
                currentHoverKey={currentHoverKey}
                className={styles.tableFixedLeftContainer}
                maxHeight={tableHeight}
                maxWidth={tableWidth}
                isFixed={true}
                onMouseOver={detectScrollTarget}
                onRowHover={handleRowHover}
                onTouchStart={detectScrollTarget}
                onScroll={handleBodyScroll}
                scrollTop={scrollTop}
                ref={node => {
                    this.tableFixedLeft = node;
                }}
            />
        );
    }

    renderTitle() {
        const { title } = this.props;
        return (
            <div
                className={styles.title}
                ref={(node) => {
                    this.title = node;
                }}
            >
                {title()}
            </div>
        );
    }

    renderFooter () {
        const { footer } = this.props;
        return (
            <div
                className={styles.tfoot}
                ref={(node) => {
                    this.foot = node;
                }}
            >
                {footer()}
            </div>
        );
    }

    renderLoader() {
        const { loaderRender } = this.props;
        const defaultLoader = () => {
            return (
                <div className={styles.loaderOverlay}>
                    <span className={classNames(styles.loader, styles.loaderLarge)} />
                </div>
            );
        };
        const loader = loaderRender || defaultLoader;
        return loader();
    }

    render() {
        const {
            className,
            loading,
            bordered,
            title,
            footer,
            averageColumnsWidth,
            hoverable,
            sortable,
            useFixedHeader,
            ...props
        } = this.props;

        delete props.rowKey;
        delete props.columns;
        delete props.expandedRowRender;
        delete props.expandedRowKeys;
        delete props.maxHeight;
        delete props.rowClassName;
        delete props.onRowClick;
        delete props.emptyText;
        delete props.showHeader;

        return (
            <div
                {...props}
                className={classNames(
                    className,
                    styles.tableWrapper,
                    { [styles.tableMinimalism]: !bordered },
                    { [styles.tableBordered]: bordered },
                    { [styles.tableExtendColumnWidth]: !averageColumnsWidth },
                    { [styles.tableFixedHeader]: useFixedHeader },
                    { [styles.tableNoData]: !props.data || props.data.length === 0 },
                    { [styles.tableHover]: hoverable },
                    { [styles.tableSortable]: sortable }
                )}
                ref={(node) => {
                    this.tableWrapper = node;
                }}
            >
                { title && this.renderTitle() }
                <div className={styles.tableArea}>
                    { this.renderTable() }
                    { this.isAnyColumnsLeftFixed() && this.renderFixedLeftTable() }
                    { loading && this.renderLoader() }
                </div>
                { footer && this.renderFooter() }
            </div>
        );
    }
}

export default Table;
