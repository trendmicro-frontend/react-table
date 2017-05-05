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
        hoverable: PropTypes.bool,
        isFixed: PropTypes.bool,
        loading: PropTypes.bool,
        maxHeight: PropTypes.number,
        onMouseOver: PropTypes.func,
        onTouchStart: PropTypes.func,
        onScroll: PropTypes.func,
        onRowHover: PropTypes.func,
        showHeader: PropTypes.bool,
        scrollTop: PropTypes.number,
        title: PropTypes.func
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
                            index = j;
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
                // No data
                for (let j = 0; j < columns.length; j++) {
                    const customColumn = columns[j];
                    if (customColumn && customColumn.width) {
                        cellsWidth[j] = customColumn.width;
                        index = j;
                    } else if (cellWidth > 0) {
                        cellsWidth[j] = cellWidth;
                    } else {
                        cellsWidth[j] = thsWidth[j];
                        index = j;
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
            let headerHeight = 0;

            for (let i = 0; i < headerRow.length; i++) {
                const headerCell = headerRow[i].getElementsByClassName(styles.th);
                for (let j = 0; j < headerCell.length; j++) {
                    let th = headerCell[j];
                    th.style.height = 'auto';
                    const thHeight = th.getBoundingClientRect().height;
                    headerHeight = Math.max(headerHeight, thHeight);
                }
            }

            for (let i = 0; i < bodyRows.length; i++) {
                const bodyCell = bodyRows[i].getElementsByClassName(styles.td);
                cellHeight = rowsHeight[i] || 0;
                for (let j = 0; j < bodyCell.length; j++) {
                    let td = bodyCell[j];
                    td.style.height = 'auto';
                    const tdHeight = td.getBoundingClientRect().height;
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
            const { maxHeight } = this.props;
            const headerHeight = this.tableHeader ? this.tableHeader.header.getBoundingClientRect().height : 0;
            const tableHeight = maxHeight;
            let bodyHeight = maxHeight ? (maxHeight - headerHeight) : 0;
            this.setState({
                tableHeight,
                bodyHeight
            }, this.actions.sizeTableCells);
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
        setTableHeaderCellWidth: (cellsWidth) => {
            const { isFixed } = this.props;
            let tHeader = this.tableHeader.header;
            let tBody = this.tableBody.body;
            const headerRows = tHeader.getElementsByClassName(styles.tr);
            const offsetWidth = tBody.getBoundingClientRect().width;
            const clientWidth = tBody.clientWidth;
            const scrollbarWidth = offsetWidth - clientWidth;
            let totalWidth = 0;

            for (let i = 0; i < headerRows.length; i++) {
                const headerCell = headerRows[i].getElementsByClassName(styles.th);
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
            const headerRows = tHeader.getElementsByClassName(styles.tr);

            for (let i = 0; i < headerRows.length; i++) {
                const headerCell = headerRows[i].getElementsByClassName(styles.th);
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
            const mainBody = mainTable.getElementsByClassName(styles.tbody)[0];
            const offsetWidth = mainBody.getBoundingClientRect().width;
            const clientHeight = mainBody.clientHeight;
            const tBody = this.tableBody.body;
            const totalWidth = tBody.getElementsByClassName(styles.tr)[0];

            this.table.style.width = `${totalWidth.getBoundingClientRect().width}px`;
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
        if (prevProps.data !== this.props.data || prevProps.maxHeight !== this.props.maxHeight) {
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
            minHeight: '0%',
            maxHeight: 'none'
        };
        if (tableHeight) {
            customStyles.maxHeight = `${tableHeight}px`;
        }

        return (
            <div
                ref={node => {
                    this.table = node;
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
