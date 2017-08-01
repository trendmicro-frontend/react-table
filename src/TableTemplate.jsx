import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import helper from './helper';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        bordered: PropTypes.bool,
        justified: PropTypes.bool,
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        expandedRowKeys: PropTypes.array,
        footer: PropTypes.func,
        hoverable: PropTypes.bool,
        isFixed: PropTypes.bool,
        loading: PropTypes.bool,
        maxHeight: PropTypes.number,
        maxWidth: PropTypes.number,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        showHeader: PropTypes.bool,
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
        },
        getTableCellWidth: () => {
            const { columns, justified, loading } = this.props;

            let thsWidth = [];
            if (this.tableHeader) {
                const tHeader = this.tableHeader.header;
                const headerCell = helper.getSubElements(helper.getSubElements(tHeader, `.${styles.tr}`)[0], `.${styles.th}`);
                for (let j = 0; j < headerCell.length; j++) {
                    let th = headerCell[j];
                    let thWidth = 0;
                    if (th) {
                        const headerCellContent = helper.getSubElements(th, `.${styles.thContent}`);
                        const content = headerCellContent[0];
                        thWidth = (content ? content.getBoundingClientRect().width : 0) + parseInt(helper.getElementStyle(th, 'padding-left'), 10) + parseInt(helper.getElementStyle(th, 'padding-right'), 10);
                    }
                    thsWidth[j] = thWidth;
                }
            }

            const tBody = this.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            const totalWidth = tBody.clientWidth;
            let cellTotalWidth = 0;
            let cellsWidth = [];
            let cellWidth = 0;
            let customWidth = { width: 0 };
            const newColumns = columns.map((column, index) => {
                let width = column.width;
                if (typeof width === 'string') {
                    const lastChar = width.substr(width.length - 1);
                    if (lastChar === '%') {
                        width = totalWidth * (parseFloat(width) / 100);
                    } else {
                        width = parseFloat(width);
                    }
                }
                return {
                    ...column,
                    width: width
                };
            });
            const customColumns = newColumns.filter((column) => {
                return column.width && column.width > 0;
            });
            if (customColumns.length > 0) {
                customWidth = customColumns.reduce((a, b) => {
                    return { width: a.width + b.width };
                });
            }

            if (justified || loading) {
                cellWidth = (totalWidth - customWidth.width) / (newColumns.length - customColumns.length);
            }

            let nonCustomColumnsIndex = [];
            if (bodyRows.length > 0) {
                for (let i = 0; i < bodyRows.length; i++) {
                    const bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                    cellTotalWidth = 0;
                    nonCustomColumnsIndex = [];
                    for (let j = 0; j < bodyCell.length; j++) {
                        const customColumn = newColumns[j];
                        let td = bodyCell[j];
                        if (customColumn && customColumn.width) {
                            cellsWidth[j] = customColumn.width;
                        } else if (justified) {
                            cellsWidth[j] = cellWidth;
                        } else {
                            const thWidth = thsWidth[j] || 0;
                            const bodyCellContent = helper.getSubElements(td, `.${styles.tdContent}`);
                            const content = bodyCellContent[0];
                            const tdWidth = (content ? content.getBoundingClientRect().width : 0) + parseInt(helper.getElementStyle(td, 'padding-left'), 10) + parseInt(helper.getElementStyle(td, 'padding-right'), 10);
                            cellWidth = cellsWidth[j] || 0;
                            cellsWidth[j] = Math.max(cellWidth, thWidth, tdWidth);
                            nonCustomColumnsIndex.push(j);
                        }
                        cellTotalWidth += cellsWidth[j];
                    }
                }
            } else {
                // No data
                for (let j = 0; j < newColumns.length; j++) {
                    const customColumn = newColumns[j];
                    if (customColumn && customColumn.width) {
                        cellsWidth[j] = customColumn.width;
                    } else if (cellWidth > 0) {
                        cellsWidth[j] = cellWidth;
                    } else {
                        cellsWidth[j] = thsWidth[j];
                        nonCustomColumnsIndex.push(j);
                    }
                    cellTotalWidth += cellsWidth[j];
                }
            }

            if (totalWidth > cellTotalWidth) {
                const extra = totalWidth - cellTotalWidth;
                let extraCellWidth;
                if (nonCustomColumnsIndex.length > 0) {
                    extraCellWidth = extra / (newColumns.length - customColumns.length);
                    for (let i = 0; i < nonCustomColumnsIndex.length; i++) {
                        cellsWidth[nonCustomColumnsIndex[i]] += extraCellWidth;
                    }
                } else {
                    extraCellWidth = extra / newColumns.length;
                    for (let i = 0; i < newColumns.length; i++) {
                        cellsWidth[i] += extraCellWidth;
                    }
                }
            }

            return {
                widths: cellsWidth
            };
        },
        getTableRowHeight: () => {
            const tHeader = this.tableHeader ? this.tableHeader.header : null;
            const headerRow = tHeader ? helper.getSubElements(tHeader, `.${styles.tr}`) : [];
            const tBody = this.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let cellHeight = 0;
            let rowsHeight = [];
            let headerHeight = 0;

            for (let i = 0; i < headerRow.length; i++) {
                const headerCell = helper.getSubElements(headerRow[i], `.${styles.th}`);
                for (let j = 0; j < headerCell.length; j++) {
                    const th = headerCell[j];
                    const headerCellContent = helper.getSubElements(th, `.${styles.thContent}`);
                    const content = headerCellContent[0];
                    const thHeight = (content ? content.getBoundingClientRect().height : 0) + parseInt(helper.getElementStyle(th, 'padding-top'), 10) + parseInt(helper.getElementStyle(th, 'padding-bottom'), 10);
                    headerHeight = Math.max(headerHeight, thHeight);
                }
            }

            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                cellHeight = rowsHeight[i] || 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    const td = bodyCell[j];
                    const bodyCellContent = helper.getSubElements(td, `.${styles.tdContent}`);
                    const content = bodyCellContent[0];
                    const tdHeight = (content ? content.getBoundingClientRect().height : 0) + parseInt(helper.getElementStyle(td, 'padding-top'), 10) + parseInt(helper.getElementStyle(td, 'padding-bottom'), 10);
                    cellHeight = Math.max(cellHeight, tdHeight);
                }
                rowsHeight[i] = cellHeight;
            }

            return {
                heights: rowsHeight,
                headerHeight: headerHeight
            };
        },
        getFixedTableCellsSize: () => {
            const mainTable = this.table.previousSibling;
            let cellsWidth = [];
            let rowsHeight = [];
            let tHeader;
            let headerRow = [];
            if (mainTable) {
                tHeader = helper.getSubElements(mainTable, `.${styles.thead}`) || [];
                headerRow = tHeader.length > 0 ? helper.getSubElements(tHeader[0], `.${styles.tr}`) : [];
                const tBody = helper.getSubElements(mainTable, `.${styles.tbody}`)[0];
                const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
                for (let i = 0; i < bodyRows.length; i++) {
                    const bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                    for (let j = 0; j < bodyCell.length; j++) {
                        const td = bodyCell[j];
                        cellsWidth[j] = parseFloat(td.style.width);
                    }
                    rowsHeight[i] = bodyRows[i].getBoundingClientRect().height;
                }
            }
            return {
                widths: cellsWidth,
                heights: rowsHeight,
                headerHeight: headerRow.length > 0 ? headerRow[0].getBoundingClientRect().height : 0
            };
        },
        sizeTable: () => {
            if (this.table) {
                const { maxHeight, maxWidth } = this.props;
                const headerHeight = this.tableHeader ? this.tableHeader.header.getBoundingClientRect().height : 0;
                const newTableHeight = maxHeight;
                const newTableWidth = maxWidth;
                const newBodyHeight = maxHeight ? (maxHeight - headerHeight) : 0;
                if (this.state.tableHeight !== newTableHeight ||
                    this.state.tableWidth !== newTableWidth ||
                    this.state.bodyHeight !== newBodyHeight) {
                    this.setState({
                        tableHeight: newTableHeight,
                        tableWidth: newTableWidth,
                        bodyHeight: newBodyHeight
                    }, this.actions.sizeTableCells);
                }
            }
        },
        sizeTableCells: () => {
            const { isFixed } = this.props;
            if (isFixed) {
                const size = this.actions.getFixedTableCellsSize();
                this.actions.setTableBodyCellWidth(size.widths);
                this.actions.setTableBodyCellHeight(size.heights);
                if (this.tableHeader) {
                    this.actions.setTableHeaderCellWidth(size.widths);
                    this.actions.setTableHeaderCellHeight(size.headerHeight);
                }
                this.actions.sizeFixedTable();
            } else {
                // Set cells width first
                const cellsWidth = this.actions.getTableCellWidth();
                this.actions.setTableBodyCellWidth(cellsWidth.widths);
                if (this.tableHeader) {
                    this.actions.setTableHeaderCellWidth(cellsWidth.widths);
                }
                // Then set cells height
                const rowsHeight = this.actions.getTableRowHeight();
                this.actions.setTableBodyCellHeight(rowsHeight.heights);
                if (this.tableHeader) {
                    this.actions.setTableHeaderCellHeight(rowsHeight.headerHeight);
                }
            }
        },
        setTableBodyCellWidth: (cellsWidth) => {
            const tBody = this.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let cellWidth;
            let totalWidth = 0;
            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                totalWidth = 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    let td = bodyCell[j];
                    cellWidth = cellsWidth[j] || 0;
                    td.style.width = `${cellWidth}px`;
                    totalWidth += cellWidth;
                }
                bodyRows[i].style.width = `${totalWidth}px`;
            }
        },
        setTableBodyCellHeight: (rowsHeight) => {
            const tBody = this.tableBody.body;
            const bodyRows = helper.getSubElements(tBody, `.${styles.tr}`);
            let rowHeight = 0;
            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = helper.getSubElements(bodyRows[i], `.${styles.td}`);
                rowHeight = rowsHeight[i] || 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    let td = bodyCell[j];
                    td.style.height = `${rowHeight}px`;
                }
            }
        },
        setTableHeaderCellWidth: (cellsWidth) => {
            const { isFixed } = this.props;
            let tHeader = this.tableHeader.header;
            let tBody = this.tableBody.body;
            const headerRows = helper.getSubElements(tHeader, `.${styles.tr}`);
            const offsetWidth = tBody.getBoundingClientRect().width;
            const clientWidth = tBody.clientWidth;
            const scrollbarWidth = offsetWidth - clientWidth;
            let totalWidth = 0;

            for (let i = 0; i < headerRows.length; i++) {
                const headerCell = helper.getSubElements(headerRows[i], `.${styles.th}`);
                totalWidth = 0;
                for (let j = 0; j < headerCell.length; j++) {
                    let cellWidth = cellsWidth[j] || 0;
                    let th = headerCell[j];
                    if (th) {
                        if (j === headerCell.length - 1) {
                            cellWidth = isFixed ? cellWidth : (cellWidth + scrollbarWidth);
                        }
                        th.style.width = `${cellWidth}px`;
                    }
                    totalWidth += cellWidth;
                }
                headerRows[i].style.width = `${totalWidth}px`;
            }
        },
        setTableHeaderCellHeight: (headerHeight) => {
            let tHeader = this.tableHeader.header;
            const headerRows = helper.getSubElements(tHeader, `.${styles.tr}`);

            for (let i = 0; i < headerRows.length; i++) {
                const headerCell = helper.getSubElements(headerRows[i], `.${styles.th}`);
                for (let j = 0; j < headerCell.length; j++) {
                    let th = headerCell[j];
                    if (th) {
                        th.style.height = `${headerHeight}px`;
                    }
                }
            }
        },
        sizeFixedTable: () => {
            const mainTable = this.table.previousSibling;
            const mainBody = helper.getSubElements(mainTable, `.${styles.tbody}`)[0];
            const offsetWidth = mainBody.getBoundingClientRect().width;
            const clientHeight = mainBody.clientHeight + 0.5;
            const tBody = this.tableBody.body;
            const totalWidth = helper.getSubElements(tBody, `.${styles.tr}`)[0].getBoundingClientRect().width;

            this.table.style.width = `${totalWidth}px`;
            tBody.style.width = `${offsetWidth}px`;
            this.setState({
                bodyHeight: clientHeight
            });
        }
    };

    getInitState() {
        return {
            scrollLeft: 0,
            tableHeight: 0,
            tableWidth: 0,
            bodyHeight: 0
        };
    }

    componentDidMount() {
        const { sizeTable } = this.actions;
        window.addEventListener('resize', sizeTable);
        sizeTable();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.actions.sizeTable);
        this.tableHeader = null;
        this.tableBody = null;
        this.table = null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.maxHeight !== this.props.maxHeight ||
            prevProps.maxWidth !== this.props.maxWidth ||
            prevProps.expandedRowKeys !== this.props.expandedRowKeys) {
            this.actions.sizeTable();
        }
        if (prevProps.data !== this.props.data) {
            this.actions.sizeTableCells();
        }
    }

    renderHeader() {
        const {
            columns,
            data
        } = this.props;
        const { scrollLeft } = this.state;
        return (
            <TableHeader
                scrollLeft={scrollLeft}
                columns={columns}
                data={data}
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
            onMouseOver,
            onTouchStart,
            onRowHover,
            scrollTop,
            ...props
        } = this.props;
        const {
            bodyHeight
        } = this.state;
        const { handleBodyScroll } = this.actions;
        return (
            <TableBody
                {...props}
                columns={columns}
                currentHoverKey={currentHoverKey}
                maxHeight={bodyHeight}
                onMouseOver={onMouseOver}
                onTouchStart={onTouchStart}
                onRowHover={onRowHover}
                onScroll={handleBodyScroll}
                scrollTop={scrollTop}
                records={data}
                ref={node => {
                    if (node) {
                        this.tableBody = node;
                    }
                }}
            />
        );
    }

    render() {
        const {
            className,
            showHeader
        } = this.props;
        const { tableHeight } = this.state;
        let customStyles = {
            minHeight: '0%',
            maxHeight: 'none'
        };
        if (tableHeight) {
            customStyles.maxHeight = `${tableHeight}px`;
        }

        return (
            <div
                ref={node => {
                    if (node) {
                        this.table = node;
                    }
                }}
                style={customStyles}
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
