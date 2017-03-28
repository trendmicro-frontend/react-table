import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import { Button } from '@trendmicro/react-buttons';
import orderBy from 'lodash.orderby';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Section from './Section';
import Table from '../src';
import styles from './index.styl';

class App extends Component {
    state = {
        sortColumnKey: 'eventType',
        sortOrder: 'asc',
        pagination: {
            page: 1,
            pageLength: 10
        }
    };
    actions = {
        fetchRecords: ({ page, pageLength }) => {
            console.log(`page=${page}, pageLength=${pageLength}`);
        },
        toggleSortOrder: (key, event) => {
            let sortColumnKey = key;
            let sortOrder = (this.state.sortOrder === 'desc') ? 'asc' : 'desc';
            if (this.state.sortColumnKey !== sortColumnKey) {
                sortOrder = 'desc';
            }
            this.setState({ sortColumnKey, sortOrder });
        }
    };

    columns = [
        {
            title: 'Event Type',
            key: 'eventType',
            render: (value, row, index) => {
                return row.eventType;
            }
        },
        {
            title: 'Affected Devices',
            key: 'affectedDevices',
            render: (value, row, index) => {
                return row.affectedDevices;
            }
        },
        {
            title: 'Detections',
            key: 'detections',
            render: (value, row, index) => {
                return row.detections;
            }
        }
    ];
    bigColumns = [
        {
            title: 'Event Type',
            key: 'eventType',
            width: '800px',
            render: (value, row, index) => {
                return row.eventType;
            }
        },
        {
            title: 'Affected Devices',
            key: 'affectedDevices',
            width: '130px',
            render: (value, row, index) => {
                return row.affectedDevices;
            }
        },
        {
            title: 'Detections',
            key: 'detections',
            width: '130px',
            render: (value, row, index) => {
                return row.detections;
            }
        }
    ];
    data = [
        { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
        { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
        { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
        { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
        { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
        { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
    ];
    bigData = [
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
        { id: 17, eventType: 'Test long long long long long long long long long long long long long long long long long long long long long long long long long long content', affectedDevices: 11, detections: 345 },
        { id: 18, eventType: 'Computer Status', affectedDevices: 90, detections: 466 },
        { id: 19, eventType: 'Mobile Devices', affectedDevices: 100, detections: 234 },
        { id: 20, eventType: 'Desktops', affectedDevices: 102, detections: 477 },
        { id: 21, eventType: 'Servers', affectedDevices: 33, detections: 235 }
    ];

    sortableColumns(columns) {
        return (
            columns.map((column, index) => {
                return {
                    ...column,
                    onClick: this.actions.toggleSortOrder,
                    sortOrder: column.key === this.state.sortColumnKey ? this.state.sortOrder : ''
                };
            })
        );
    }

    render() {
        const name = 'React Table';
        const url = 'https://github.com/trendmicro-frontend/react-table';
        const columns = this.columns;
        const bigColumns = this.bigColumns;
        const data = this.data;
        const bigData = this.bigData;
        const sortableColumns = this.sortableColumns(columns);
        const sortableBigColumns = this.sortableColumns(bigColumns);
        const sortableData = orderBy(data, [this.state.sortColumnKey], [this.state.sortOrder]);
        const sortableBigData = orderBy(bigData, [this.state.sortColumnKey], [this.state.sortOrder]);
        const { page, pageLength } = this.state.pagination;
        const totalRecords = columns.length;

        return (
            <div>
                <Navbar name={name} url={url} />
                <div className="container-fluid" style={{ padding: '20px 20px 0' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <Section className="row-md-11">
                                <h3>Types</h3>
                                <div className={styles.sectionGroup}>
                                    <h5>Standard Table</h5>
                                    <p>A standard table includes column and row borders. Useful for presenting multiple table columns.</p>
                                    <Table
                                        bordered={true}
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>Plain Table</h5>
                                    <p>A plain table reduces visual clutter.</p>
                                    <Table
                                        bordered={false}
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                    />
                                </div>
                            </Section>
                        </div>
                        <div className="col-md-12">
                            <Section className="row-md-22">
                                <h3>Display and Functionalities</h3>
                                <div className={styles.sectionGroup}>
                                    <h5>Row Hover</h5>
                                    <Table
                                        hoverable={true}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>Row Selection</h5>
                                    <Table
                                        hoverable={true}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                        onRowClick={(record, index, event) => {
                                        }}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>Sortable Header</h5>
                                    <Table
                                        hoverable
                                        sortable
                                        rowKey={record => record.id}
                                        columns={sortableColumns}
                                        data={sortableData}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>Loader</h5>
                                    <Table
                                        loading={true}
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>No Data</h5>
                                    <Table
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={[]}
                                        emptyText={() => 'No data to display'}
                                    />
                                </div>
                            </Section>
                        </div>
                        <div className="col-md-12">
                            <Section className="row-md-20">
                                <h3>Fixed Header</h3>
                                <p>A fixed header remains visible as the table body is scrolled. This is useful for larger amounts of data.</p>
                                <div className={styles.sectionGroup}>
                                    <Table
                                        hoverable
                                        sortable
                                        fixedHeader
                                        height={180}
                                        rowKey={record => record.id}
                                        columns={sortableColumns}
                                        data={sortableBigData}
                                    />
                                    <br />
                                    <Table
                                        hoverable
                                        sortable
                                        fixedHeader
                                        height={180}
                                        rowKey={record => record.id}
                                        columns={sortableBigColumns}
                                        data={sortableBigData}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>No Header</h5>
                                    <Table
                                        hoverable
                                        sortable
                                        showHeader={false}
                                        height={180}
                                        rowKey={record => record.id}
                                        columns={sortableBigColumns}
                                        data={sortableBigData}
                                    />
                                </div>
                                <div className={styles.sectionGroup}>
                                    <h5>Pagination</h5>
                                    <Table
                                        hoverable
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                        height={180}
                                        title={() => (
                                            <Table.Toolbar>
                                                <Button btnStyle="flat">
                                                    Export
                                                </Button>
                                                <Table.Pagination
                                                    page={page}
                                                    pageLength={pageLength}
                                                    totalRecords={totalRecords}
                                                    onPageChange={({ page, pageLength }) => {
                                                        this.actions.fetchRecords({ page, pageLength });
                                                    }}
                                                    prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                                    nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                                />
                                            </Table.Toolbar>
                                        )}
                                    />
                                    <br />
                                    <Table
                                        fixedHeader
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                        height={200}
                                        title={() => (
                                            <Table.Toolbar>
                                                <Button btnStyle="flat">
                                                    Export
                                                </Button>
                                                <Table.Pagination
                                                    page={page}
                                                    pageLength={pageLength}
                                                    totalRecords={totalRecords}
                                                    onPageChange={({ page, pageLength }) => {
                                                        this.actions.fetchRecords({ page, pageLength });
                                                    }}
                                                    prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                                    nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                                />
                                            </Table.Toolbar>
                                        )}
                                        footer={() => (
                                            <Table.Toolbar>
                                                <Button btnStyle="flat">
                                                    Export
                                                </Button>
                                                <Table.Pagination
                                                    page={page}
                                                    pageLength={pageLength}
                                                    totalRecords={totalRecords}
                                                    onPageChange={({ page, pageLength }) => {
                                                        this.actions.fetchRecords({ page, pageLength });
                                                    }}
                                                    prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                                    nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                                />
                                            </Table.Toolbar>
                                        )}
                                    />
                                </div>
                            </Section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
