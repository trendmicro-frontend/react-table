import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { Component } from 'react';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

export default class extends Component {
    columns = [
        {
            title: 'Event Type',
            render: (value, row, index) => {
                return row.eventType;
            }
        },
        {
            title: 'Affected Devices',
            render: (value, row, index) => {
                return row.affectedDevices;
            }
        },
        {
            title: 'Detections',
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

    render() {
        const columns = this.columns;
        const data = this.data;

        return (
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
        );
    }
}
