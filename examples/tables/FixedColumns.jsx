import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { Component } from 'react';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

export default class extends Component {

    columns1 = [
        { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
        { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices' },
        { title: 'Detections', key: 'detections', dataIndex: 'detections' }
    ];

    columns2 = [
        { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
        { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices' },
        { title: 'Detections', key: 'detections', dataIndex: 'detections', width: 800 }
    ];

    columns3 = [
        { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
        { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices', fixed: true },
        { title: 'Detections', key: 'detections', dataIndex: 'detections', width: 800 }
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
        const data = this.data;

        return (
            <div className="col-md-12">
                <Section className="row-md-11">
                    <h3>Fixed Columns</h3>
                    <div className={styles.sectionGroup}>
                        <h5>Fixed Header</h5>
                        <p>A fixed header remains visible as the table body is scrolled. This is useful for larger amounts of data.</p>
                        <Table
                            justified
                            hoverable
                            maxHeight={180}
                            useFixedHeader={true}
                            rowKey={record => record.id}
                            columns={this.columns1}
                            data={data}
                        />
                        <br />
                        <Table
                            justified={false}
                            hoverable
                            maxHeight={180}
                            useFixedHeader={true}
                            rowKey={record => record.id}
                            columns={this.columns2}
                            data={data}
                        />
                    </div>
                    <div className={styles.sectionGroup}>
                        <h5>Fix left columns</h5>
                        <Table
                            justified={false}
                            hoverable={true}
                            maxHeight={180}
                            useFixedHeader={true}
                            rowKey="id"
                            columns={this.columns3}
                            data={data}
                        />
                    </div>
                </Section>
            </div>
        );
    }

}
