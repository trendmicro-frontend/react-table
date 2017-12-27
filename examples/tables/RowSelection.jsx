import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { Component } from 'react';
import _ from 'lodash';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

const bigData = [];
for (let i = 1; i < 601; i++) {
    bigData.push({
        id: i,
        checked: false,
        eventType: `Virus/Malware_${i}`,
        affectedDevices: 20 + i,
        detections: 10 + i
    });
}

export default class extends Component {
    state = {
        selectionData: bigData
    };

    actions = {
        handleClickRow: (record, index, e) => {
            e.stopPropagation();
            e.preventDefault();

            this.setState(state => {
                const checked = record.checked;
                const data = state.selectionData.map(item => {
                    if (record.id === item.id) {
                        return {
                            ...item,
                            checked: !checked
                        };
                    }
                    return item;
                });

                return {
                    selectionData: data
                };
            });
        },
        handleRowClassName: (record, key) => {
            const checked = record.checked;
            if (checked) {
                return styles['tr-active'];
            } else {
                return null;
            }
        },
        handleHeaderCheckbox: (e) => {
            e.stopPropagation();

            this.setState(state => {
                const checkbox = e.target;
                const data = state.selectionData.map((item, i) => {
                    return {
                        ...item,
                        checked: checkbox.checked
                    };
                });

                return {
                    selectionData: data
                };
            });
        },
        renderHeaderCheckbox: () => {
            let className = 'input-checkbox';
            const selectedItems = _.filter(this.state.selectionData, { 'checked': true });
            const dataLength = this.state.selectionData.length;
            const selectedLength = selectedItems.length;
            const isSelectedAll = selectedLength > 0 && selectedLength === dataLength;
            if (selectedLength > 0 && selectedLength < dataLength) {
                className += ' checkbox-partial';
            }
            return (
                <div className="checkbox" style={{ display: 'inline-block' }}>
                    <input
                        type="checkbox"
                        id="headerCheckbox"
                        checked={isSelectedAll}
                        className={className}
                        onChange={this.actions.handleHeaderCheckbox}
                    />
                    <label htmlFor="headerCheckbox" />
                </div>
            );
        },
        renderCheckbox: (value, row) => {
            return (
                <div className="checkbox" style={{ display: 'inline-block' }}>
                    <input
                        type="checkbox"
                        id={row.id}
                        className="input-checkbox"
                        checked={row.checked}
                        onChange={(e) => {}}
                    />
                    <label />
                </div>
            );
        }
    };

    columns = [
        { title: this.actions.renderHeaderCheckbox, dataIndex: 'checked', render: this.actions.renderCheckbox, width: 38 },
        { title: 'Event Type', dataIndex: 'eventType' },
        { title: 'Affected Devices', dataIndex: 'affectedDevices' },
        { title: 'Detections', dataIndex: 'detections' }
    ];

    render() {
        const columns = this.columns;
        const data = this.state.selectionData;

        return (
            <div className="col-md-12">
                <Section className="row-md-8">
                    <h3>Row selection</h3>
                    <p>Change the color of a table row when it is selected.</p>
                    <ul>
                        <li>
                            Row selection should take effect when the user clicks anywhere in a row,
                            except for table cells that contain hyperlinks. Note the following checkboxes are greyed out for demo purposes.
                        </li>
                    </ul>
                    <div className={styles.sectionGroup}>
                        <Table
                            rowKey="id"
                            columns={columns}
                            data={data}
                            rowClassName={this.actions.handleRowClassName}
                            onRowClick={this.actions.handleClickRow}
                            useFixedHeader={true}
                            maxHeight={400}
                        />
                    </div>
                </Section>
            </div>
        );
    }
}
