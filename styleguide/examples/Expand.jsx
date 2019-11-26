import React, { Component, Fragment } from 'react';
import _concat from 'lodash/concat';
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import { Scrollbars } from 'react-custom-scrollbars';
import Anchor from '@trendmicro/react-anchor';
import Table, { TableHeader, TableBody, TableRow, TableCell } from '../../src';

const data = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 30, detections: 111 },
    { id: 7, eventType: 'Predictive Machine Learning', affectedDevices: 40, detections: 0 },
    { id: 8, eventType: 'Behavior Monitoring', affectedDevices: 22, detections: 333 },
    { id: 9, eventType: 'Device Ontrol', affectedDevices: 9, detections: 555 },
    { id: 10, eventType: 'Ransomware Summary', affectedDevices: 0, detections: 66 },
    { id: 11, eventType: 'Agent Status', affectedDevices: 2, detections: 789 },
    { id: 12, eventType: 'Security Risk Detections Over Time', affectedDevices: 66, detections: 34 },
    { id: 13, eventType: 'Action Center', affectedDevices: 32, detections: 2234 },
    { id: 14, eventType: 'License Status', affectedDevices: 8, detections: 34325 },
    { id: 15, eventType: 'Component Status', affectedDevices: 12, detections: 46465 },
    { id: 16, eventType: 'Outbreak Defense', affectedDevices: 12, detections: 123 },
    { id: 17, eventType: 'Test long long long long long long long long long long long long long long long content', affectedDevices: 11, detections: 345 },
    { id: 18, eventType: 'Computer Status', affectedDevices: 90, detections: 466 },
    { id: 19, eventType: 'Mobile Devices', affectedDevices: 100, detections: 234 },
    { id: 20, eventType: 'Desktops', affectedDevices: 102, detections: 477 },
    { id: 21, eventType: 'Servers', affectedDevices: 33, detections: 235 }
];

const subData = [];
for (let i = 1; i <= 5; i++) {
    subData.push({
        id: i,
        app: `chrome_${i}`,
        vendor: `google_${i}`
    });
}

const subColumns = [
    { title: 'Application Name', dataKey: 'app' },
    { title: 'Vendor Name', dataKey: 'vendor' }
];

class Expand extends Component {
    constructor(props) {
        super(props);

        this.scrollbarRef = React.createRef();
        this.state = {
            expandedRowKeys: [],
        };
    }

    handleExpandedRowRender = (record, key) => {
        return (
            <Fragment>
                <div>Sub content</div>
                <Table
                    columns={subColumns}
                    data={subData}
                    height={150}
                    width={300}
                />
            </Fragment>
        );
    };

    handleToggleDetails = (record) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { expandedRowKeys } = this.state;
        const isIdInSelectedList = _includes(expandedRowKeys, record.id);
        const newExpandedRowList = isIdInSelectedList
            ? _filter(expandedRowKeys, id => id !== record.id)
            : _concat(expandedRowKeys, record.id);

        this.setState({ expandedRowKeys: newExpandedRowList });
    };

    handleRenderActionColumn = (text, record) => {
        const { expandedRowKeys } = this.state;
        const expanded = (expandedRowKeys.indexOf(record.id) >= 0);
        let className = 'expand-icon ';
        if (expanded) {
            className += 'row-expanded';
        } else {
            className += 'row-collapsed';
        }

        return (
            <Anchor onClick={this.handleToggleDetails(record)}>
                <i className={className} />
            </Anchor>
        );
    };

    render() {
        const columns = [
            { dataKey: 'id', render: this.handleRenderActionColumn, width: 40 },
            { title: 'Event Type', dataKey: 'eventType', width: 150 },
            { title: 'Affected Devices', dataKey: 'affectedDevices' },
            { title: 'Detections', dataKey: 'detections' }
        ];

        return (
            <Table
                bordered
                columns={columns}
                data={data}
                width={800}
                height={320}
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
                                                    { title }
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Scrollbars
                                    style={{
                                        width: 800
                                    }}
                                >
                                    {
                                        data.map((row, index) => {
                                            const rowKey = `table_row${index}`;
                                            const isExpanded = _includes(this.state.expandedRowKeys, row.id);
                                            return (
                                                <Fragment key={rowKey}>
                                                    <TableRow>
                                                        {
                                                            cells.map((cell, index) => {
                                                                const key = `${rowKey}_cell${index}`;
                                                                const cellValue = _get(row, cell.dataKey);
                                                                return (
                                                                    <TableCell
                                                                        key={key}
                                                                        width={cell.width}
                                                                    >
                                                                        { typeof cell.render === 'function' ? cell.render(cellValue, row, index) : cellValue }
                                                                    </TableCell>
                                                                );
                                                            })
                                                        }
                                                    </TableRow>
                                                    { isExpanded && (
                                                        <div className="tr-expand">
                                                            { this.handleExpandedRowRender(row, index) }
                                                        </div>
                                                    )}
                                                </Fragment>
                                            );
                                        })
                                    }
                                </Scrollbars>
                            </TableBody>
                        </Fragment>
                    );
                }}
            </Table>
        );
    }
}

export default Expand;
