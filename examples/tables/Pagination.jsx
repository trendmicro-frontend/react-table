import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import { Button } from '@trendmicro/react-buttons';
import { TablePagination } from '@trendmicro/react-paginations';
import React, { Component } from 'react';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

export default class extends Component {

    state = {
        pagination: {
            page: 1,
            pageLength: 10
        }
    };

    columns = [
        { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
        { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices' },
        { title: 'Detections', key: 'detections', dataIndex: 'detections' }
    ];

    data = [
        { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
        { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
        { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
        { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
        { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
        { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
    ];

    actions = {
        fetchRecords: ({ page, pageLength }) => {
            //console.log(`page=${page}, pageLength=${pageLength}`);
        }
    };

    render() {
        const columns = this.columns;
        const data = this.data;
        const { page, pageLength } = this.state.pagination;
        const totalRecords = columns.length;

        return (
            <div className="col-md-12">
                <Section className="row-md-9">
                    <h3>Pagination</h3>
                    <div className={styles.sectionGroup}>
                        <Table
                            hoverable
                            rowKey={record => record.id}
                            columns={columns}
                            data={data}
                            height={180}
                            title={() => (
                                <div className={styles.tableToolbar}>
                                    <Button btnStyle="flat">
                                        Export
                                    </Button>
                                    <TablePagination
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0
                                        }}
                                        page={page}
                                        pageLength={pageLength}
                                        totalRecords={totalRecords}
                                        onPageChange={({ page, pageLength }) => {
                                            this.actions.fetchRecords({ page, pageLength });
                                        }}
                                        prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                        nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                    />
                                </div>
                            )}
                        />
                        <br />
                        <Table
                            hoverable={false}
                            rowKey={record => record.id}
                            columns={columns}
                            data={data}
                            height={200}
                            useFixedHeader={true}
                            title={() => (
                                <div className={styles.tableToolbar}>
                                    <Button btnStyle="flat">
                                        Export
                                    </Button>
                                    <TablePagination
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0
                                        }}
                                        page={page}
                                        pageLength={pageLength}
                                        totalRecords={totalRecords}
                                        onPageChange={({ page, pageLength }) => {
                                            this.actions.fetchRecords({ page, pageLength });
                                        }}
                                        prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                        nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                    />
                                </div>
                            )}
                            footer={() => (
                                <div className={styles.tableToolbar}>
                                    <Button btnStyle="flat">
                                        Export
                                    </Button>
                                    <TablePagination
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0
                                        }}
                                        page={page}
                                        pageLength={pageLength}
                                        totalRecords={totalRecords}
                                        onPageChange={({ page, pageLength }) => {
                                            this.actions.fetchRecords({ page, pageLength });
                                        }}
                                        prevPageRenderer={() => <i className="fa fa-angle-left" />}
                                        nextPageRenderer={() => <i className="fa fa-angle-right" />}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </Section>
            </div>
        );
    }

}
