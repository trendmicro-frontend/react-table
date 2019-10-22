import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { Provider, create } from 'mini-store';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import elementResizeDetectorMaker from 'element-resize-detector';
import debounce from 'lodash.debounce';
import helper from './helper';
import uniqueid from './uniqueid';
import styles from './index.styl';
import TableTemplate from './TableTemplate';

const getUniqueId = uniqueid('table:');

class Table extends PureComponent {
    static propTypes = {
        bordered: PropTypes.bool,
        justified: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        loaderRender: PropTypes.func,
        maxHeight: PropTypes.number,
        onRowClick: PropTypes.func,
        showHeader: PropTypes.bool,
        title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        useFixedHeader: PropTypes.bool,
        rowClassName: PropTypes.func,
        rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    };

    static defaultProps = {
        bordered: true,
        justified: true,
        columns: [],
        data: [],
        hoverable: true,
        loading: false,
        maxHeight: 0,
        useFixedHeader: false
    };

    static getDerivedStateFromProps(props, state) {
        const columnsAreChanged = !isEqual(
            props.columns.map(it => ({ key: it.key, sortOrder: it.sortOrder })),
            state.prevColumns.map(it => ({ key: it.key, sortOrder: it.sortOrder }))
        );

        if (columnsAreChanged) {
            // Checking columns
            const filterColumns = props.columns
                // Filter out empty columns
                .filter(Boolean)
                // Set default value to column's key attribute.
                .map(column => ({ ...column, key: column.key !== undefined ? column.key : getUniqueId() }));
            return {
                prevColumns: props.columns,
                thisColumns: filterColumns
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.resizer = elementResizeDetectorMaker();
        this.containerWidth = 0;
        this.tableWrapper = null;
        this.mainTable = null;
        this.state = {
            prevColumns: [],
            thisColumns: []
        };
        this.store = create({
            currentHoverKey: null,
            scrollTop: 0,
            scrollLeft: 0
        });
    }

    actions = {
        setTableSize: () => {
            if (this.tableWrapper) {
                const { maxHeight } = this.props;
                const tableTopBorder = helper.getElementStyle(this.tableWrapper, 'border-top-width');
                const tableBottomBorder = helper.getElementStyle(this.tableWrapper, 'border-bottom-width');
                const headerHeight = this.title ? this.title.getBoundingClientRect().height : 0;
                const footerHeight = this.foot ? this.foot.getBoundingClientRect().height : 0;
                const tableHeight = maxHeight - headerHeight - footerHeight - parseInt(tableTopBorder, 10) - parseInt(tableBottomBorder, 10);
                this.actions.sizeTable(tableHeight);
            }
        },
        sizeTable: (tablehHight) => {
            if (this.mainTable) {
                this.actions.sizeMainTable();
                if (tablehHight) {
                    const headerHeight = this.mainTable.tableHeader ? this.mainTable.tableHeader.header.getBoundingClientRect().height : 0;
                    const bodyHeight = tablehHight ? (tablehHight - headerHeight) : 0;
                    this.mainTable.tableBody.body.style['max-height'] = `${bodyHeight}px`;
                }
                if (this.tableFixedLeft) {
                    this.actions.sizeFixedTable();
                }
            }
        },
        sizeMainTable: () => {
            const {
                getMainTableCellWidth,
                getMainTableRowHeight,
                setMainTableBodyCellWidth,
                setMainTableBodyCellHeight,
                getMainTableHeaderCellActualHeight,
                setMainTableHeaderCellWidth,
                setMainTableHeaderCellHeight
            } = this.actions;

            // Set cells width first
            const cellsWidth = getMainTableCellWidth();
            setMainTableBodyCellWidth(cellsWidth);

            // Then set cells height
            const rowsHeight = getMainTableRowHeight();
            setMainTableBodyCellHeight(rowsHeight);

            if (this.mainTable.tableHeader) {
                // Set cells width first
                setMainTableHeaderCellWidth(cellsWidth);

                // Then set cells height
                const headerHeight = getMainTableHeaderCellActualHeight();
                setMainTableHeaderCellHeight(headerHeight);
            }
        },
        sizeFixedTable: () => {
            const fixedTable = this.tableFixedLeft.table;
            const fixedBody = this.tableFixedLeft.tableBody;
            const mainTHeader = this.mainTable.tableHeader.header;
            const mainHeaderRow = mainTHeader ? helper.getSubElements(mainTHeader, `.${styles.tr}`) : [];
            const mainBody = this.mainTable.tableBody;
            const mainTBody = mainBody.body;
            const mainBodyRows = helper.getSubElements(mainTBody, `.${styles.tr}`);
            const fixedTHeader = this.tableFixedLeft.tableHeader.header;
            const fixexHeaderRow = fixedTHeader ? helper.getSubElements(fixedTHeader, `.${styles.tr}`) : [];
            const fixedTBody = fixedBody.body;
            const fixedBodyRows = helper.getSubElements(fixedTBody, `.${styles.tr}`);
            const mainBodyOffset = mainTBody.getBoundingClientRect();
            const scrollHeight = (mainBodyOffset.height - mainTBody.clientHeight);
            let i;
            let j;
            let headerCell;
            let bodyCell;
            let fixedHeaderCell;
            let fixedBodyCell;
            let sumCellsWidth;
            let th;
            let fixedTh;
            let td;
            let fixedTd;
            for (i = 0; i < mainHeaderRow.length; i++) {
                headerCell = helper.getSubElements(mainHeaderRow[i], `.${styles.th}`);
                fixedHeaderCell = helper.getSubElements(fixexHeaderRow[i], `.${styles.th}`);
                sumCellsWidth = 0;
                for (j = 0; j < headerCell.length; j++) {
                    th = headerCell[j];
                    fixedTh = fixedHeaderCell[j];
                    if (fixedTh) {
                        fixedTh.style.width = th.style.width;
                        fixedTh.style.height = th.style.height;
                        sumCellsWidth += parseFloat(th.style.width);
                    }
                }
                fixexHeaderRow[i].style.width = sumCellsWidth ? `${sumCellsWidth}px` : fixexHeaderRow[i].style.width;
            }
            for (i = 0; i < mainBodyRows.length; i++) {
                bodyCell = helper.getSubElements(mainBodyRows[i], `.${styles.td}`);
                fixedBodyCell = helper.getSubElements(fixedBodyRows[i], `.${styles.td}`);
                sumCellsWidth = 0;
                for (j = 0; j < bodyCell.length; j++) {
                    td = bodyCell[j];
                    fixedTd = fixedBodyCell[j];
                    if (fixedTd) {
                        fixedTd.style.width = td.style.width;
                        fixedTd.style.height = td.style.height;
                        sumCellsWidth += parseFloat(td.style.width);
                    }
                }
                fixedBodyRows[i].style.width = sumCellsWidth ? `${sumCellsWidth}px` : fixedBodyRows[i].style.width;
            }
            fixedTable.style.width = `${fixedBodyRows[0].getBoundingClientRect().width}px`;
            fixedTBody.style.width = `${mainBodyOffset.width}px`;
            fixedTBody.style.height = `${mainBodyOffset.height - scrollHeight}px`;
        },
        getMainTableHeaderCellActualWidth: () => {
            const mainHeader = this.mainTable.tableHeader;
            let widthList = [];
            if (mainHeader) {
                const tHeader = mainHeader.header;
                const headerCells = helper.getSubElements(helper.getSubElements(tHeader, `.${styles.tr}`)[0], `.${styles.th}`);
                let i;
                let th;
                // For performance, do not clearing element style and getting element width at the same time.
                for (i = 0; i < headerCells.length; i++) {
                    th = headerCells[i];
                    if (th.style.width) {
                        th.style.width = null;
                    }
                }
                for (i = 0; i < headerCells.length; i++) {
                    th = headerCells[i];
                    widthList[i] = th.getBoundingClientRect().width;
                }
            }
            return widthList;
        },
        getMainTableHeaderCellActualHeight: () => {
            const tHeader = this.mainTable.tableHeader.header;
            const headerCells = helper.getSubElements(helper.getSubElements(tHeader, `.${styles.tr}`)[0], `.${styles.th}`);
            let headerHeight = 0;
            let th;
            let thHeight;
            let cellContent;
            let content;
            let i = 0;
            // Clearing element's height style before getting the actual height of table cell.
            for (i = 0; i < headerCells.length; i++) {
                th = headerCells[i];
                if (th.style.height) {
                    th.style.height = null;
                }
            }
            for (i = 0; i < headerCells.length; i++) {
                th = headerCells[i];
                cellContent = helper.getSubElements(th, `.${styles.thContent}`);
                content = cellContent[0];
                thHeight = (content ? content.getBoundingClientRect().height : 0) +
                            parseInt(helper.getElementStyle(th, 'padding-top'), 10) +
                            parseInt(helper.getElementStyle(th, 'padding-bottom'), 10) +
                            parseInt(helper.getElementStyle(th, 'border-top-width'), 10) +
                            parseInt(helper.getElementStyle(th, 'border-bottom-width'), 10);
                headerHeight = Math.max(headerHeight, thHeight);
            }
            return headerHeight;
        },
        getMainTableCellWidth: () => {
            const {
                justified,
                loading
            } = this.props;
            const {
                getMainTableHeaderCellActualWidth
            } = this.actions;
            const columns = this.state.thisColumns;
            const mainBody = this.mainTable.tableBody;
            const tBody = mainBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            const tableMaxWidth = tBody.clientWidth;
            const thsWidth = getMainTableHeaderCellActualWidth();
            let sumCellWidth = 0;
            let cellsWidth = [];
            let cellWidth = 0;
            let customWidth = { width: 0 };
            let columnWidth;
            let nonCustomColumnsIndex = [];
            const newColumns = columns.map((column, index) => {
                columnWidth = column.width;
                if (typeof columnWidth === 'string') {
                    const lastChar = columnWidth.substr(columnWidth.length - 1);
                    if (lastChar === '%') {
                        columnWidth = tableMaxWidth * (parseFloat(columnWidth) / 100);
                    } else {
                        columnWidth = parseFloat(columnWidth);
                    }
                }
                return {
                    ...column,
                    width: columnWidth
                };
            });
            const customColumns = newColumns.filter((column) => (column.width && column.width > 0));
            if (customColumns.length > 0) {
                customWidth = customColumns.reduce((a, b) => {
                    return { width: a.width + b.width };
                });
            }

            if (justified || loading) {
                cellWidth = (tableMaxWidth - customWidth.width) / (newColumns.length - customColumns.length);
            }

            if (bodyRows.length > 0) {
                let i = 0;
                let j = 0;
                let bodyCell = [];
                let customColumn;
                let td;
                let thWidth;
                let tdWidth;
                // For performance, do not clearing element style and getting element width at the same time.
                for (i = 0; i < bodyRows.length; i++) {
                    bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                    for (j = 0; j < bodyCell.length; j++) {
                        td = bodyCell[j];
                        if (td.style.width) {
                            td.style.width = null;
                        }
                    }
                }
                for (i = 0; i < bodyRows.length; i++) {
                    bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                    sumCellWidth = 0;
                    nonCustomColumnsIndex = [];
                    for (j = 0; j < bodyCell.length; j++) {
                        customColumn = newColumns[j];
                        td = bodyCell[j];
                        if (customColumn && customColumn.width) {
                            cellsWidth[j] = customColumn.width;
                        } else if (justified) {
                            cellsWidth[j] = cellWidth;
                        } else {
                            thWidth = thsWidth[j] || 0;
                            tdWidth = td.getBoundingClientRect().width;
                            cellWidth = cellsWidth[j] || 0;
                            cellsWidth[j] = Math.max(cellWidth, thWidth, tdWidth);
                            nonCustomColumnsIndex.push(j);
                        }
                        sumCellWidth += cellsWidth[j];
                    }
                }
            } else {
                // No data
                let j = 0;
                let customColumn;
                for (j = 0; j < newColumns.length; j++) {
                    customColumn = newColumns[j];
                    if (customColumn && customColumn.width) {
                        cellsWidth[j] = customColumn.width;
                    } else if (cellWidth > 0) {
                        cellsWidth[j] = cellWidth;
                    } else {
                        cellsWidth[j] = thsWidth[j];
                        nonCustomColumnsIndex.push(j);
                    }
                    sumCellWidth += cellsWidth[j];
                }
            }

            if (tableMaxWidth > sumCellWidth) {
                const extra = tableMaxWidth - sumCellWidth;
                let extraCellWidth;
                if (nonCustomColumnsIndex.length > 0) {
                    extraCellWidth = extra / (newColumns.length - customColumns.length);
                    let i = 0;
                    for (i = 0; i < nonCustomColumnsIndex.length; i++) {
                        cellsWidth[nonCustomColumnsIndex[i]] += extraCellWidth;
                    }
                } else {
                    extraCellWidth = extra / newColumns.length;
                    let i = 0;
                    for (i = 0; i < newColumns.length; i++) {
                        cellsWidth[i] += extraCellWidth;
                    }
                }
            }

            return cellsWidth;
        },
        getMainTableRowHeight: () => {
            const tBody = this.mainTable.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let cellHeight = 0;
            let rowsHeight = [];
            let bodyCell = [];
            let td;
            let tdHeight;
            let cellContent;
            let content;
            let i = 0;
            let j = 0;
            // Fix the issue that table shrinks in when browser resolution changed to other than 100%.
            // Clearing element's height style before getting the actual height of table cell.
            for (i = 0; i < bodyRows.length; i++) {
                bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                for (j = 0; j < bodyCell.length; j++) {
                    td = bodyCell[j];
                    if (td.style.height) {
                        td.style.height = null;
                    }
                }
            }
            for (i = 0; i < bodyRows.length; i++) {
                bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                cellHeight = rowsHeight[i] || 0;
                for (j = 0; j < bodyCell.length; j++) {
                    td = bodyCell[j];
                    cellContent = helper.getSubElements(td, `.${styles.tdContent}`);
                    content = cellContent[0];
                    tdHeight = (content ? content.getBoundingClientRect().height : 0) +
                                parseInt(helper.getElementStyle(td, 'padding-top'), 10) +
                                parseInt(helper.getElementStyle(td, 'padding-bottom'), 10) +
                                parseInt(helper.getElementStyle(td, 'border-top-width'), 10) +
                                parseInt(helper.getElementStyle(td, 'border-bottom-width'), 10);
                    cellHeight = Math.max(cellHeight, tdHeight);
                }
                rowsHeight[i] = cellHeight;
            }
            return rowsHeight;
        },
        setMainTableBodyCellWidth: (cellsWidth) => {
            const tBody = this.mainTable.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let cellWidth;
            let totalWidth;
            let i;
            let j;
            let bodyCell;
            for (i = 0; i < bodyRows.length; i++) {
                bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                totalWidth = 0;
                for (j = 0; j < bodyCell.length; j++) {
                    cellWidth = cellsWidth[j] || 0;
                    bodyCell[j].style.width = `${cellWidth}px`;
                    totalWidth += cellWidth;
                }
                bodyRows[i].style.width = `${totalWidth}px`;
            }
        },
        setMainTableBodyCellHeight: (rowsHeight) => {
            const tBody = this.mainTable.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let rowHeight;
            let i;
            let j;
            let bodyCell;
            for (i = 0; i < bodyRows.length; i++) {
                bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                rowHeight = rowsHeight[i] || 0;
                for (j = 0; j < bodyCell.length; j++) {
                    bodyCell[j].style.height = `${rowHeight}px`;
                }
            }
        },
        setMainTableHeaderCellWidth: (cellsWidth) => {
            const tHeader = this.mainTable.tableHeader.header;
            const tBody = this.mainTable.tableBody.body;
            const headerRows = helper.getSubElements(tHeader, `.${styles.tr}`);
            const offsetWidth = tBody.getBoundingClientRect().width;
            const clientWidth = tBody.clientWidth;
            const scrollbarWidth = offsetWidth - clientWidth;
            let totalWidth;
            let i;
            let j;
            let headerCells;
            let cellWidth;
            for (i = 0; i < headerRows.length; i++) {
                headerCells = helper.getSubElements(headerRows[i], `.${styles.th}`);
                totalWidth = 0;
                for (j = 0; j < headerCells.length; j++) {
                    cellWidth = cellsWidth[j] || 0;
                    if (j === headerCells.length - 1) {
                        cellWidth += scrollbarWidth;
                    }
                    headerCells[j].style.width = `${cellWidth}px`;
                    totalWidth += cellWidth;
                }
                headerRows[i].style.width = `${totalWidth}px`;
            }
        },
        setMainTableHeaderCellHeight: (headerHeight) => {
            const tHeader = this.mainTable.tableHeader.header;
            const headerRows = helper.getSubElements(tHeader, `.${styles.tr}`);
            let headerCells;
            let i;
            let j;
            for (i = 0; i < headerRows.length; i++) {
                headerCells = helper.getSubElements(headerRows[i], `.${styles.th}`);
                for (j = 0; j < headerCells.length; j++) {
                    headerCells[j].style.height = `${headerHeight}px`;
                }
            }
        }
    };

    componentDidMount() {
        const { setTableSize } = this.actions;
        this.onResizeDebounce = debounce((element) => {
            const newWidth = element.offsetWidth;
            if (this.containerWidth !== newWidth) {
                this.containerWidth = newWidth;
                setTableSize();
            }
        }, 100);
        this.resizer.listenTo(this.tableWrapper, this.onResizeDebounce);
        setTableSize();
    }

    componentWillUnmount() {
        this.resizer.removeListener(this.tableWrapper, this.onResizeDebounce);
        this.tableWrapper = null;
        this.mainTable = null;
    }

    componentDidUpdate(prevProps, prevState) {
        const equal = prevProps.columns.length === this.props.columns.length
        && isEqual(
            prevProps.columns.map(it => ({ key: it.key, sortOrder: it.sortOrder })),
            this.props.columns.map(it => ({ key: it.key, sortOrder: it.sortOrder }))
        );
        if (prevProps.maxHeight !== this.props.maxHeight
            ||
            !isEqual(prevProps.data, this.props.data)
            ||
            !equal
            || (this.props.loading !== prevProps.loading)
        ) {
            this.actions.setTableSize();
        }
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
        const {
            data,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            loading,
            onRowClick,
            showHeader,
            useFixedHeader,
            rowClassName,
            rowKey
        } = this.props;

        return (
            <TableTemplate
                columns={columns}
                data={data}
                emptyText={emptyText}
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
                loading={loading}
                onRowClick={onRowClick}
                showHeader={showHeader}
                useFixedHeader={useFixedHeader}
                rowClassName={rowClassName}
                rowKey={rowKey}
                ref={node => {
                    this.mainTable = node;
                }}
                tableRole="normalTable"
            />
        );
    }

    renderFixedLeftTable() {
        const fixedColumns = this.leftColumns();
        const {
            data,
            emptyText,
            expandedRowKeys,
            expandedRowRender,
            loading,
            onRowClick,
            showHeader,
            useFixedHeader,
            rowClassName,
            rowKey
        } = this.props;
        return (
            <TableTemplate
                columns={fixedColumns}
                className={styles.tableFixedLeftContainer}
                data={data}
                expandedRowKeys={expandedRowKeys}
                expandedRowRender={expandedRowRender}
                emptyText={emptyText}
                loading={loading}
                onRowClick={onRowClick}
                showHeader={showHeader}
                useFixedHeader={useFixedHeader}
                rowClassName={rowClassName}
                rowKey={rowKey}
                ref={node => {
                    this.tableFixedLeft = node;
                }}
                tableRole="leftTable"
            />
        );
    }

    renderTitle() {
        const { title } = this.props;
        const content = (typeof title === 'function' ? title() : title);
        return (
            <div
                className={styles.title}
                ref={(node) => {
                    this.title = node;
                }}
            >
                {content}
            </div>
        );
    }

    renderFooter () {
        const { footer } = this.props;
        const content = (typeof footer === 'function' ? footer() : footer);
        return (
            <div
                className={styles.tfoot}
                ref={(node) => {
                    this.foot = node;
                }}
            >
                {content}
            </div>
        );
    }

    renderLoader() {
        const { loaderRender, showHeader = true } = this.props;
        const loaderOverlayClassName = showHeader ? styles.loaderOverlay : classNames(styles.loaderOverlay, styles.noHeader);
        const defaultLoader = () => {
            return (
                <div className={loaderOverlayClassName}>
                    <span className={classNames(styles.loader, styles.loaderLarge)} />
                </div>
            );
        };
        const loader = loaderRender || defaultLoader;
        return loader();
    }

    render() {
        const {
            data,
            className,
            loading,
            bordered,
            justified,
            title,
            footer,
            hoverable,
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
            <Provider store={this.store}>
                <div
                    {...props}
                    className={classNames(
                        className,
                        styles.tableWrapper,
                        { [styles.tableMinimalism]: !bordered },
                        { [styles.tableBordered]: bordered },
                        { [styles.tableAutoFit]: !justified },
                        { [styles.tableFixedHeader]: useFixedHeader },
                        { [styles.tableNoData]: !data || data.length === 0 },
                        { [styles.tableHover]: hoverable }
                    )}
                    ref={(node) => {
                        if (node) {
                            this.tableWrapper = node;
                        }
                    }}
                >
                    { title && this.renderTitle() }
                    <div className={styles.tableArea}>
                        { this.renderTable() }
                        { this.isAnyColumnsLeftFixed() && data.length > 0 && this.renderFixedLeftTable() }
                        { loading && this.renderLoader() }
                    </div>
                    { footer && this.renderFooter() }
                </div>
            </Provider>
        );
    }
}

export default Table;
