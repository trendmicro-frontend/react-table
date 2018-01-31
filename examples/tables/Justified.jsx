import React, { Component } from 'react';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

const ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
//Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
        },
        {
            title: 'Description',
            dataKey: 'description'
        }
    ];

    data = [
        { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634, description: ipsum },
        { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634, description: ipsum },
        { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598, description: ipsum },
        { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598, description: ipsum },
        { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497, description: ipsum },
        { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0, description: ipsum, width: '40%' }
    ];

    render() {
        const columns = this.columns;
        const data = this.data;

        return (
            <div className="col-md-12">
                <Section className="row-sm-10">
                    <h3>Justified</h3>
                    <div className={styles.sectionGroup}>
                        <Table
                            borderless={true}
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
