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
                <Section className="row-sm-10">
                    <h3>Bordered and Borderless</h3>
                    <div className={styles.sectionGroup}>
                        <h5>Bordered Table</h5>
                        <Table
                            bordered={true}
                            hoverable={false}
                            justified={true}
                            rowKey={record => record.id}
                            columns={columns}
                            data={data}
                        />
                    </div>
                    <div className={styles.sectionGroup}>
                        <h5>Borderless Table</h5>
                        <Table
                            bordered={false}
                            hoverable={false}
                            justified={true}
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
