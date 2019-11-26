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
    style,
    children
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
            ref={refSetter}
            style={{ ...style, overflow: 'hidden' }}
            onScroll={onScroll}
        >
            {children}
        </Scrollbars>
    );
};

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
    <CustomScrollbars {...props} forwardedRef={ref} />
));

class Selection extends Component {
    constructor(props) {
        super(props);

        this.scrollbarRef = React.createRef();
        this.state = {
            selectedIdList: [],
        };
    }

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

    render() {
        const columns = [
            { title: this.renderHeaderCheckbox, dataKey: 'id', render: this.renderCheckbox, width: 38 },
            { title: 'Event Type', dataKey: 'eventType' },
            { title: 'Affected Devices', dataKey: 'affectedDevices' },
            { title: 'Detections', dataKey: 'detections' }
        ];

        return (
            <Table
                columns={columns}
                data={data}
                width={800}
            >
                {({ cells }) => {
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
                                    width={800}
                                    outerRef={this.scrollbarRef}
                                    outerElementType={CustomScrollbarsVirtualList}
                                >
                                    {({ data, index: rowIndex, style }) => {
                                        const rowData = data[rowIndex];
                                        const checked = _includes(this.state.selectedIdList, rowData.id);
                                        let rowClassName = null;
                                        if (checked) {
                                            rowClassName = 'tr-active';
                                        }
                                        return (
                                            <TableRow
                                                className={rowClassName}
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
        );
    }
}

export default Selection;
