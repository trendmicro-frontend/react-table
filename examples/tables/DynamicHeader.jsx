import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { Component } from 'react';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

export default class extends Component {

    state = {
        data: [
            { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
            { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
            { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
            { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
            { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
            { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
        ]
    };

    renders = {
        renderEventTypeCell: () => {
            const { data } = this.state;
            return `Event Type (${data.length})`;
        },
        renderActionCell: (value, row) => {
            return (
                <i
                    className="fa fa-trash"
                    onClick={(e) => {
                        this.handleClickDelete(row);
                    }}
                />
            );
        }
    }

    columns = [
        { dataIndex: 'eventType', title: this.renders.renderEventTypeCell },
        { dataIndex: 'affectedDevices', title: 'Affected Devices' },
        { dataIndex: 'detections', title: 'Detections' },
        { title: 'Delete', render: this.renders.renderActionCell }
    ];

    handleClickDelete(row) {
        const { data } = this.state;
        const index = data.findIndex((o) => {
            return o.id === row.id;
        });
        data.splice(index, 1);
        this.setState({
            data: data.map(o => o)
        });
    }

    render() {
        const columns = this.columns;
        const data = this.state.data;

        return (
            <div className="col-md-12">
                <Section className="row-md-5">
                    <h3>Dynamic Header</h3>
                    <div className={styles.sectionGroup}>
                        <Table
                            bordered
                            hoverable
                            rowKey="id"
                            columns={columns}
                            data={data}
                        />
                    </div>
                </Section>
            </div>
        );
    }

}
