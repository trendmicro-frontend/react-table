import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

class TableTemplate extends PureComponent {
    static propTypes = {
        averageColumnsWidth: PropTypes.bool,
        bordered: PropTypes.bool,
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        data: PropTypes.array,
        emptyText: PropTypes.func,
        footer: PropTypes.func,
        height: PropTypes.number,
        hoverable: PropTypes.bool,
        isFixed: PropTypes.bool,
        loading: PropTypes.bool,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        showHeader: PropTypes.bool,
        scrollTop: PropTypes.number,
        title: PropTypes.func
    };

    static defaultProps = {
        averageColumnsWidth: true,
        data: [],
        emptyText: function emptyText() {
            return 'No Data';
        },
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
            const { averageColumnsWidth, columns, loading } = this.props;
            let thsWidth = [];
            if (this.tableHeader) {
                const tHeader = this.tableHeader.header;
                const headerCell = tHeader.getElementsByClassName(styles.th);
                for (let j = 0; j < headerCell.length; j++) {
                    let th = headerCell[j];
                    let thWidth = 0;
                    if (th) {
                        th.style.width = 'auto';
                        thWidth = th.getBoundingClientRect().width;
                    }
                    thsWidth[j] = thWidth;
                }
            }

            const tBody = this.tableBody.body;
            const bodyRows = tBody.getElementsByClassName(styles.tr);
            const totalWidth = tBody.clientWidth;
            let cellTotalWidth = 0;
            let cellsWidth = [];
            let cellWidth = 0;
            let customWidth = { width: 0 };
            const customColumns = columns.filter((column) => {
                return column.width && column.width > 0;
            });
            if (customColumns.length > 0) {
                customWidth = customColumns.reduce((a, b) => {
                    return { width: a.width + b.width };
                });
            }

            if (averageColumnsWidth || loading) {
                cellWidth = (totalWidth - customWidth.width) / (columns.length - customColumns.length);
            }

            let index = -1;
            if (bodyRows.length > 0) {
                for (let i = 0; i < bodyRows.length; i++) {
                    const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
                    cellTotalWidth = 0;
                    index = -1;
                    for (let j = 0; j < bodyCell.length; j++) {
                        const customColumn = columns[j];
                        let td = bodyCell[j];
                        if (customColumn && customColumn.width) {
                            cellsWidth[j] = customColumn.width;
                        } else if (averageColumnsWidth) {
                            cellsWidth[j] = cellWidth;
                        } else {
                            const thWidth = thsWidth[j] || 0;
                            td.style.width = 'auto';
                            const tdWidth = td.getBoundingClientRect().width;
                            cellWidth = cellsWidth[j] || 0;
                            cellsWidth[j] = Math.max(cellWidth, thWidth, tdWidth);
                            index = j;
                        }
                        cellTotalWidth += cellsWidth[j];
                    }
                }
            } else {
                for (let j = 0; j < columns.length; j++) {
                    const customColumn = columns[j];
                    if (customColumn && customColumn.width) {
                        cellsWidth[j] = customColumn.width;
                    } else {
                        cellsWidth[j] = cellWidth;
                    }
                    cellTotalWidth += cellsWidth[j];
                }
            }

            if (totalWidth > cellTotalWidth && index) {
                cellsWidth[index] += (totalWidth - cellTotalWidth);
            }

            return {
                widths: cellsWidth
            };
        },
        getTableRowHeight: () => {
            const tHeader = this.tableHeader ? this.tableHeader.header : null;
            const headerRow = tHeader ? tHeader.getElementsByClassName(styles.tr) : [];
            const tBody = this.tableBody.body;
            const bodyRows = tBody.getElementsByClassName(styles.tr);
            let cellHeight = 0;
            let rowsHeight = [];

            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
                cellHeight = rowsHeight[i] || 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    let td = bodyCell[j];
                    const tdHeight = td.getBoundingClientRect().height;
                    cellHeight = Math.max(cellHeight, tdHeight);
                }
                rowsHeight[i] = cellHeight;
            }

            return {
                heights: rowsHeight,
                headerHeight: headerRow.length > 0 ? headerRow[0].getBoundingClientRect().height : 0
            };
        },
        getFixedTableCellsSize: () => {
            const mainTable = this.table.previousSibling;
            let cellsWidth = [];
            let rowsHeight = [];
            let tHeader;
            let headerRow = [];
            if (mainTable) {
                tHeader = mainTable.getElementsByClassName(styles.thead) || [];
                headerRow = tHeader.length > 0 ? tHeader[0].getElementsByClassName(styles.tr) : [];
                const tBody = mainTable.getElementsByClassName(styles.tbody)[0];
                const bodyRows = tBody.getElementsByClassName(styles.tr);
                for (let i = 0; i < bodyRows.length; i++) {
                    const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
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
        getTableHeight: () => {
            const { height } = this.props;
            const headerHeight = this.tableHeader ? this.tableHeader.header.getBoundingClientRect().height : 0;
            const tableHeight = height;
            let bodyHeight = height ? (height - headerHeight) : 0;
            this.setState({
                tableHeight,
                bodyHeight
            }, this.actions.sizeTableCells);
        },
        sizeTableCells: () => {
            const { isFixed } = this.props;
            let size = {};
            if (isFixed) {
                size = this.actions.getFixedTableCellsSize();
                this.actions.setTableBodyCellWidth(size.widths);
                this.actions.setTableBodyCellHeight(size.heights);
                this.actions.sizeFixedTable();
            } else {
                // Set cells width first
                const cellsWidth = this.actions.getTableCellWidth();
                this.actions.setTableBodyCellWidth(cellsWidth.widths);
                // Then set cells height
                const rowsHeight = this.actions.getTableRowHeight();
                this.actions.setTableBodyCellHeight(rowsHeight.heights);
                size.widths = cellsWidth.widths;
                size.heights = rowsHeight.heights;
                size.headerHeight = rowsHeight.headerHeight;
            }

            if (this.tableHeader) {
                this.actions.sizeTableHeader(size);
            }
        },
        setTableBodyCellWidth: (cellsWidth) => {
            const tBody = this.tableBody.body;
            const bodyRows = tBody.getElementsByClassName(styles.tr);
            let cellWidth;
            let totalWidth = 0;
            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
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
            const bodyRows = tBody.getElementsByClassName(styles.tr);
            let rowHeight = 0;
            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
                rowHeight = rowsHeight[i] || 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    let td = bodyCell[j];
                    td.style.height = `${rowHeight}px`;
                }
            }
        },
        sizeTableHeader: (size) => {
            const { isFixed } = this.props;
            let tHeader = this.tableHeader.header;
            let tBody = this.tableBody.body;
            const headerRows = tHeader.getElementsByClassName(styles.tr);
            const offsetWidth = tBody.getBoundingClientRect().width;
            const clientWidth = tBody.clientWidth;
            const scrollbarWidth = offsetWidth - clientWidth;
            const cellsWidth = size.widths || [];
            const headerHeight = size.headerHeight;
            let totalWidth = 0;

            for (let i = 0; i < headerRows.length; i++) {
                const headerCell = headerRows[i].getElementsByClassName(styles.th);
                totalWidth = 0;
                for (let j = 0; j < headerCell.length; j++) {
                    let cellWidth = cellsWidth[j];
                    let th = headerCell[j];
                    if (th) {
                        if (j === headerCell.length - 1) {
                            cellWidth = isFixed ? cellWidth : (cellWidth + scrollbarWidth);
                        }
                        th.style.width = `${cellWidth}px`;
                        th.style.height = `${headerHeight}px`;
                    }
                    totalWidth += cellWidth;
                }
                headerRows[i].style.width = `${totalWidth}px`;
            }
        },
        sizeFixedTable: () => {
            const { tableHeight } = this.state;
            const mainTable = this.table.previousSibling;
            const mainBody = mainTable.getElementsByClassName(styles.tbody)[0];
            const offsetWidth = mainBody.getBoundingClientRect().width;
            const clientHeight = mainBody.clientHeight;
            const scrollbarHeight = mainBody.getBoundingClientRect().height - clientHeight;
            const tBody = this.tableBody.body;
            const totalWidth = tBody.getElementsByClassName(styles.tr)[0];

            this.table.style.width = `${totalWidth.getBoundingClientRect().width}px`;
            tBody.style.width = `${offsetWidth}px`;
            this.setState({
                tableHeight: (tableHeight - scrollbarHeight),
                bodyHeight: clientHeight
            });
        }
    };

    getInitState() {
        return {
            scrollLeft: 0,
            tableHeight: 0,
            bodyHeight: 0
        };
    }

    componentDidMount() {
        const { getTableHeight } = this.actions;
        window.addEventListener('resize', getTableHeight);
        getTableHeight();
    }
    componentWillUnmount() {
        const { getTableHeight } = this.actions;
        window.removeEventListener('resize', getTableHeight);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            const { getTableHeight } = this.actions;
            getTableHeight();
        }
    }

    renderHeader() {
        const { columns } = this.props;
        const { scrollLeft } = this.state;
        return (
            <TableHeader
                scrollLeft={scrollLeft}
                columns={columns}
                ref={node => {
                    this.tableHeader = node;
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
                    this.tableBody = node;
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
            height: 'none'
        };
        if (tableHeight) {
            customStyles.height = `${tableHeight}px`;
        }

        return (
            <div
                ref={node => {
                    this.table = node;
                }}
                style={{ height: customStyles.height }}
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
