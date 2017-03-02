import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Section from './Section';
import Table from '../src';
import styles from './index.styl';

class App extends Component {
    columns = [
        {
            title: 'Event Type',
            key: 'name',
            render: (value, row, index) => {
                return row.eventType;
            }
        },
        {
            title: 'Affected Devices',
            key: 'type',
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

    render() {
        const name = 'React Table';
        const url = 'https://github.com/trendmicro-frontend/react-table';
        const columns = this.columns;
        const data = this.state.data;

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
                            <Section className="row-md-30">
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
                                            console.log('###', record, index);
                                        }}
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
