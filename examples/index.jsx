import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import { Button } from '@trendmicro/react-buttons';
import { TablePagination } from '@trendmicro/react-paginations';
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
    data = [
        { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
        { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
        { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
        { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
        { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
        { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
    ]

    render() {
        const name = 'React Table';
        const url = 'https://github.com/trendmicro-frontend/react-table';
        const columns = this.columns;
        const data = this.data;
        const sortableColumns = this.columns.map((column, index) => {
            return {
                ...column,
                onClick: this.actions.toggleSortOrder,
                sortOrder: column.key === this.state.sortColumnKey ? this.state.sortOrder : ''
            };
        });
        const sortableData = orderBy(data, [this.state.sortColumnKey], [this.state.sortOrder]);
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
                            <Section className="row-md-27">
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
                                <div className={styles.sectionGroup}>
                                    <h5>Pagination</h5>
                                    <Table
                                        hoverable={false}
                                        rowKey={record => record.id}
                                        columns={columns}
                                        data={data}
                                        title={() => (
                                            <Table.Toolbar>
                                                <Button btnStyle="flat">
                                                    Export
                                                </Button>
                                                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                                                    <TablePagination
                                                        page={page}
                                                        pageLength={pageLength}
                                                        totalRecords={totalRecords}
                                                        onPageChange={({ page, pageLength }) => {
                                                            //actions.fetchRecords({ page, pageLength });
                                                        }}
                                                        prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                                        nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                                    />
                                                </div>
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
