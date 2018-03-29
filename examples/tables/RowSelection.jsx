import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Checkbox from '@trendmicro/react-checkbox';
import Table from '../../src';
import Section from '../Section';
import styles from '../index.styl';

const bigData = [];
for (let i = 1; i <= 10000; i++) {
    bigData.push({
        id: i,
        checked: false,
        eventType: `Virus/Malware_${i}`,
        affectedDevices: 20,
        detections: 10
    });
}

export default class extends Component {
    state = {
        data: bigData
    };
    node = {
        checkbox: null
    };

    toggleAll = () => {
        if (!this.node.checkbox) {
            return;
        }

        const node = ReactDOM.findDOMNode(this.node.checkbox);
        const checked = node.checked;
        this.setState(state => ({
            data: state.data.map(item => ({
                ...item,
                checked: !checked
            }))
        }));
    };

    renderHeaderCheckbox = () => {
        const dataLength = this.state.data.length;
        const selectedLength = this.state.data.filter(data => !!data.checked).length;
        const checked = selectedLength > 0;
        const indeterminate = selectedLength > 0 && selectedLength < dataLength;

        return (
            <Checkbox
                ref={node => {
                    this.node.checkbox = node;
                }}
                checked={checked}
                indeterminate={indeterminate}
                onChange={event => {
                    const checkbox = event.target;
                    const checked = indeterminate || !!checkbox.checked;

                    this.setState(state => ({
                        data: state.data.map(item => ({
                            ...item,
                            checked: checked
                        }))
                    }));
                }}
            />
        );
    };

    getRowClassName = (record, key) => {
        const checked = record.checked;
        if (checked) {
            return styles.active;
        } else {
            return null;
        }
    };

    columns = [
        {
            title: this.renderHeaderCheckbox,
            dataKey: 'checked',
            render: (value, row) => (
                <Checkbox
                    id={row.id}
                    className="input-checkbox"
                    checked={row.checked}
                    onChange={event => {
                        const checked = event.target.checked;

                        this.setState(state => ({
                            data: state.data.map(item => {
                                if (row.id === item.id) {
                                    return {
                                        ...item,
                                        checked: checked
                                    };
                                }

                                return item;
                            })
                        }));
                    }}
                />
            ),
            width: 38
        },
        {
            title: '#',
            dataKey: 'id'
        },
        {
            title: 'Event Type',
            dataKey: 'eventType'
        },
        {
            title: 'Affected Devices',
            dataKey: 'affectedDevices'
        },
        {
            title: 'Detections',
            dataKey: 'detections'
        }
    ];

    render() {
        //const data = this.state.selectionData;

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
                            fixedHeader={true}
                            justified={false}
                            rowKey="id"
                            columns={this.columns}
                            data={this.state.data}
                            rowClassName={this.getRowClassName}
                            maxHeight={400}
                            onRowsRendered={({ startIndex, stopIndex }) => {
                                console.log(`startIndex=${startIndex}, stopIndex=${stopIndex}`);
                            }}
                        />
                    </div>
                </Section>
            </div>
        );
    }
}
