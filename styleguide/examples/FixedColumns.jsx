import cx from 'classnames';
import React, { Component, Fragment } from 'react';
import Checkbox from '@trendmicro/react-checkbox';
import ensureArray from 'ensure-array';
import _concat from 'lodash/concat';
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import { Scrollbars } from 'react-custom-scrollbars';
import { FixedSizeList as ListTable } from 'react-window';
import Table, { TableHeader, TableBody, TableRow, TableCell } from '../../src';

const data = [];
for (let i = 1; i <= 1000; i++) {
    data.push({
        id: i,
        eventType: `Virus/Malware_${i}`,
        affectedDevices: 20 + i,
        detections: 10 + i
    });
}

const CustomScrollbars = ({
    onScroll,
    forwardedRef,
    children,
    style,
    ...props
}) => {
    const refSetter = React.useCallback(scrollbarsRef => {
        if (scrollbarsRef) {
            forwardedRef(scrollbarsRef);
        } else {
            forwardedRef(null);
        }
    }, [forwardedRef]);

    return (
        <Scrollbars
            {...props}
            ref={refSetter}
            style={{ ...style, overflow: 'hidden' }}
            onScroll={onScroll}
        >
            { children }
        </Scrollbars>
    );
};

const CustomMainTableScrollbarsVirtualList = React.forwardRef((props, ref) => {
    return (
        <CustomScrollbars {...props} forwardedRef={ref} />
    );
});

const CustomLeftTableScrollbarsVirtualList = React.forwardRef((props, ref) => {
    return (
        <CustomScrollbars
            {...props}
            forwardedRef={ref}
            renderTrackVertical={() => <div />}
        />
    );
});

class Selection extends Component {
    constructor(props) {
        super(props);

        this.mainTableHeaderRef = React.createRef();
        this.mainTableScrollbarRef = React.createRef();
        this.leftTableScrollbarRef = React.createRef();
        this.leftTableShadowRef = React.createRef();

        this.state = {
            selectedIdList: [],
            currentHoverKey: null,
        };
    }

    componentDidMount() {
        this.mainTableScrollbarRef.current.view.addEventListener('scroll', this.handleMainTableScroll);
    }

    componentWillUnmount() {
        this.mainTableScrollbarRef.current.view.removeEventListener('scroll', this.handleMainTableScroll);
    }

    handleMainTableScroll = (e) => {
        const mainTable = e.target;
        const scrollTop = mainTable.scrollTop;
        const scrollLeft = mainTable.scrollLeft;

        if (!!this.leftTableScrollbarRef.current && this.leftTableScrollbarRef.current.getScrollTop() !== scrollTop) {
            this.leftTableScrollbarRef.current.scrollTop(scrollTop);
        }
        if (!!this.mainTableHeaderRef && this.mainTableHeaderRef.current.scrollLeft !== scrollLeft) {
            this.mainTableHeaderRef.current.scrollLeft = scrollLeft;

            if (!!this.leftTableShadowRef) {
                if (scrollLeft === 0) {
                    this.leftTableShadowRef.current.style.display = 'none';
                } else {
                    this.leftTableShadowRef.current.style.display = 'block';
                }
            }
        }
    };

    handleLeftTableVerticalScroll = ({ scrollOffset, scrollUpdateWasRequested }) => {
        if (!!this.mainTableScrollbarRef.current && !scrollUpdateWasRequested) {
            this.mainTableScrollbarRef.current.scrollTop(scrollOffset);
        }
    };

    handleRowMouseEnter = ({ hovered, rowKey }) => (event) => {
        if (!hovered) {
            this.setState({ currentHoverKey: rowKey });
        }
    };

    handleRowMouseLeave = ({ hovered, rowKey }) => (event) => {
        if (hovered) {
            this.setState({ currentHoverKey: null });
        }
    };

    handleClickRow = (record, rowIndex) => (e) => {
        e.stopPropagation();
        const { selectedIdList } = this.state;
        const isIdInSelectedList = _includes(selectedIdList, record.id);
        const newSelectedList = isIdInSelectedList
            ? _filter(selectedIdList, id => id !== record.id)
            : _concat(selectedIdList, record.id);

        this.setState({ selectedIdList: newSelectedList });
    };

    handleHeaderCheckbox = (e) => {
        e.stopPropagation();
        const { checked, indeterminate } = e.target;
        const selectAll = (!checked && indeterminate) || checked;
        const selectedIdList = selectAll ? data.map(item => item.id) : [];
        this.setState({ selectedIdList: selectedIdList });
    };

    handleRowCheckbox = (e) => {
        return false;
    };

    renderHeaderCheckbox = (column) => {
        const { selectedIdList } = this.state;
        const dataLength = ensureArray(data).length;
        const selectedLength = selectedIdList.length;
        const isSelectedAll = selectedLength > 0 && selectedLength === dataLength;
        const isChecked = (selectedLength > 0 && selectedLength < dataLength) || isSelectedAll;
        const isIndeterminate = selectedLength > 0 && selectedLength < dataLength;

        return (
            <Checkbox
                checked={isChecked}
                indeterminate={isIndeterminate}
                onClick={this.handleHeaderCheckbox}
            />
        );
    };

    renderCheckbox = (value, row) => {
        const checked = _includes(this.state.selectedIdList, row.id);
        return (
            <Checkbox
                checked={checked}
                onClick={this.handleRowCheckbox}
            />
        );
    };

    renderLeftTable = () => {
        const columns = [
            { title: this.renderHeaderCheckbox, dataKey: 'id', render: this.renderCheckbox, width: 40 },
            { title: 'Event Type', dataKey: 'eventType', width: 200 },
        ];

        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    backgroundColor: '#fff',
                }}
            >
                <Table
                    columns={columns}
                    data={data}
                    width={240}
                >
                    {({ cells, data, tableWidth }) => {
                        return (
                            <Fragment>
                                <TableHeader>
                                    <TableRow>
                                        {
                                            cells.map((cell, index) => {
                                                const key = `table_header_cell_${index}`;
                                                const {
                                                    title,
                                                    width: cellWidth,
                                                } = cell;
                                                return (
                                                    <TableCell
                                                        key={key}
                                                        width={cellWidth}
                                                    >
                                                        { typeof title === 'function' ? title(cell) : title }
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <ListTable
                                        height={150}
                                        itemCount={data.length}
                                        itemData={data}
                                        itemSize={37}
                                        width={tableWidth}
                                        onScroll={this.handleLeftTableVerticalScroll}
                                        outerRef={this.leftTableScrollbarRef}
                                        outerElementType={CustomLeftTableScrollbarsVirtualList}
                                    >
                                        {({ data, index: rowIndex, style }) => {
                                            const rowData = data[rowIndex];
                                            const rowKey = rowData.id;
                                            const checked = _includes(this.state.selectedIdList, rowKey);
                                            const hovered = this.state.currentHoverKey === rowKey;
                                            return (
                                                <TableRow
                                                    className={cx(
                                                        'tr',
                                                        { 'tr-active': checked },
                                                        { 'tr-hover': hovered },
                                                    )}
                                                    style={style}
                                                    onClick={this.handleClickRow(rowData)}
                                                >
                                                    {
                                                        cells.map((cell, cellIndex) => {
                                                            const key = `table_row${rowIndex}_cell${cellIndex}`;
                                                            const { width: cellWidth, render } = cell;
                                                            const cellValue = _get(rowData, cell.dataKey);
                                                            return (
                                                                <TableCell
                                                                    key={key}
                                                                    className="td"
                                                                    width={cellWidth}
                                                                >
                                                                    { typeof render === 'function' ? render(cellValue, rowData) : cellValue }
                                                                </TableCell>
                                                            );
                                                        })
                                                    }
                                                </TableRow>
                                            );
                                        }}
                                    </ListTable>
                                </TableBody>
                            </Fragment>
                        );
                    }}
                </Table>
            </div>
        );
    };

    renderMainTable = () => {
        const columns = [
            { width: 40 },
            { width: 200 },
            { title: 'Affected Devices', dataKey: 'affectedDevices', width: 200 },
            { title: 'Detections', dataKey: 'detections', width: 300 }
        ];

        return (
            <Table
                columns={columns}
                data={data}
                width={600}
            >
                {({ cells, data, tableWidth }) => {
                    return (
                        <Fragment>
                            <TableHeader ref={this.mainTableHeaderRef}>
                                <TableRow>
                                    {
                                        cells.map((cell, index) => {
                                            const key = `table_header_cell_${index}`;
                                            const {
                                                title,
                                                width: cellWidth,
                                            } = cell;
                                            return (
                                                <TableCell
                                                    key={key}
                                                    width={cellWidth}
                                                >
                                                    { title }
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <ListTable
                                    height={150}
                                    itemCount={data.length}
                                    itemData={data}
                                    itemSize={37}
                                    width={tableWidth}
                                    outerRef={this.mainTableScrollbarRef}
                                    outerElementType={CustomMainTableScrollbarsVirtualList}
                                >
                                    {({ data, index: rowIndex, style }) => {
                                        const rowData = data[rowIndex];
                                        const rowKey = rowData.id;
                                        const checked = _includes(this.state.selectedIdList, rowKey);
                                        const hovered = this.state.currentHoverKey === rowKey;
                                        return (
                                            <TableRow
                                                className={cx(
                                                    'tr',
                                                    { 'tr-active': checked },
                                                    { 'tr-hover': hovered },
                                                )}
                                                style={style}
                                                onClick={this.handleClickRow(rowData)}
                                                onMouseEnter={this.handleRowMouseEnter({ hovered, rowKey })}
                                                onMouseLeave={this.handleRowMouseLeave({ hovered, rowKey })}
                                            >
                                                {
                                                    cells.map((cell, cellIndex) => {
                                                        const key = `table_row${rowIndex}_cell${cellIndex}`;
                                                        const { width: cellWidth } = cell;
                                                        const cellValue = _get(rowData, cell.dataKey);
                                                        return (
                                                            <TableCell
                                                                key={key}
                                                                className="td"
                                                                width={cellWidth}
                                                            >
                                                                { cellValue }
                                                            </TableCell>
                                                        );
                                                    })
                                                }
                                            </TableRow>
                                        );
                                    }}
                                </ListTable>
                            </TableBody>
                        </Fragment>
                    );
                }}
            </Table>
        );
    };

    render() {
        const shadowStyle = {
            position: 'absolute',
            bottom: 0,
            left: 240,
            right: 0,
            width: 12,
            height: '100%',
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
            display: 'none',
        };

        return (
            <div
                style={{
                    position: 'relative',
                }}
            >
                { this.renderMainTable() }
                <div
                    ref={this.leftTableShadowRef}
                    style={shadowStyle}
                />
                { this.renderLeftTable() }
            </div>
        );
    }
}

export default Selection;
