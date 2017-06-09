# react-table [![build status](https://travis-ci.org/trendmicro-frontend/react-table.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-table) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-table/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-table?branch=master)

[![NPM](https://nodei.co/npm/@trendmicro/react-table.png?downloads=true&stars=true)](https://nodei.co/npm/@trendmicro/react-table/)

React Table

Demo: https://trendmicro-frontend.github.io/react-table

## Installation

1. Install the latest version of [react](https://github.com/facebook/react) and [react-table](https://github.com/trendmicro-frontend/react-table):

  ```
  npm install --save react @trendmicro/react-table @trendmicro/react-paginations
  ```

2. At this point you can import `@trendmicro/react-table` and its styles in your application as follows:

  ```js
  import Table from '@trendmicro/react-table';
  import { TablePagination } from '@trendmicro/react-paginations';

  // Be sure to include styles at some point, probably during your bootstraping
  import '@trendmicro/react-table/dist/react-table.css';
  import '@trendmicro/react-paginations/dist/react-paginations.css';
  ```

## Usage

### Pagination

```js
<Table
    bordered
    hoverable
    sortable
    rowKey={record => record.id}
    columns={columns}
    data={data}
    title={() => (
        <div className={styles.tableToolbar}>
            <Button btnStyle="flat">
                Export
            </Button>
            <TablePagination
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
```


### Sortable Table

```js
import React, { Component } from 'react';
import Table from '@trendmicro/react-table';

class SortableTable extends Component {
    static propTypes = {
        columns: Table.PropTypes.columns,
        data: Table.PropTypes.data
    };
    state = {
        sortColumnKey: '',
        sortOrder: 'asc'
    };

    toggleSortOrder = (column) => (event) => {
        this.setState(state => ({
            sortColumnKey: column.key
            sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc';
        }));
    };
    
    render() {
        const { sortColumnKey, sortOrder } = this.state;
        const { columns, data } = this.props;
        
        return (
            <Table
                sortable
                rowKey={record => record.id}
                columns={columns.map(column => ({
                    ...column,
                    onClick: this.toggleSortOrder(column),
                    sortOrder: (column.key === sortColumnKey) ? sortOrder : ''
                }))
                data={data}
            />
        );
    }
}

export default SortableTable;
```

### Expanded Row

```js
const actions = {
    handleExpandedRowRender: (record, key) => {
        return (
            <div style={{ padding: '16px' }}>
                Sub content
            </div>
        );
    },
    handleToggleDetails: (record) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rowIndex = this.state.expandedRowKeys.indexOf(record.id);
        const expanded = (rowIndex >= 0);
        let data = [];
        // Only display one detail view at one time
        if (expanded) {
            data = [];
        } else {
            data = [record.id];
        }
        this.setState({ expandedRowKeys: data });
    },
    handleRenderActionColumn: (text, record) => {
        const expandedRowKeys = this.state.expandedRowKeys;
        const expanded = (expandedRowKeys.indexOf(record.id) >= 0);
        let className = styles.expandIcon;
        if (expanded) {
            className += ' ' + styles.rowExpanded;
        } else {
            className += ' ' + styles.rowCollapsed;
        }
        return (
            <i
                className={className}
                onClick={this.actions.handleToggleDetails(record)}
            />
        );
    }
};
const columns = [
    { title: '', key: 'detail', dataIndex: 'detail', render: actions.handleRenderActionColumn, width: 40 },
    { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
    { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices' },
    { title: 'Detections', key: 'detections', dataIndex: 'detections', width: 300 }
];

<Table
    hoverable
    averageColumnsWidth={false}
    maxHeight={320}
    rowKey="id"
    columns={columns}
    data={data}
    expandedRowRender={this.actions.handleExpandedRowRender}
    expandedRowKeys={this.state.expandedRowKeys}
    useFixedHeader={true}
/>
```


### Fixed Columns

#### Fixed Header

```js
<Table
    averageColumnsWidth={false}
    hoverable
    maxHeight={180}
    useFixedHeader={true}
    rowKey={record => record.id}
    columns={this.columns2}
    data={data}
/>
```

#### Fix left columns

```js
const columns = [
    { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
    { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices', fixed: true },
    { title: 'Detections', key: 'detections', dataIndex: 'detections', width: 800 }
];
<Table
    averageColumnsWidth={false}
    hoverable={false}
    maxHeight={180}
    useFixedHeader={true}
    rowKey="id"
    columns={columns}
    data={data}
/>
```


### Row selection

```js
const actions = {
    handleClickRow: (record, index, event) => {
        const checked = record.checked;
        const data = this.state.selectionData.map(item => {
            if (record.id === item.id) {
                return {
                    ...item,
                    checked: !checked
                };
            }
            return item;
        });

        this.setState({
            selectionData: data
        }, () => {
            // Change elements status
            const selectedItems = _.filter(data, { 'checked': true });
            const selectedLength = selectedItems.length;
            const dataLength = data.length;
            if (selectedLength === dataLength) {
                this.headerCheckbox.checked = true;
            } else {
                this.headerCheckbox.checked = false;
            }
            if (selectedLength > 0 && selectedLength < dataLength) {
                elementClass(this.headerCheckbox).add('checkbox-partial');
            } else {
                elementClass(this.headerCheckbox).remove('checkbox-partial');
            }
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
        const checkbox = e.target;
        const data = this.state.selectionData.map((item, i) => {
            return {
                ...item,
                checked: checkbox.checked
            };
        });
        this.setState({
            selectionData: data
        }, () => {
            elementClass(this.headerCheckbox).remove('checkbox-partial');
        });
    }
};
const renderHeaderCheckbox = (row) => {
    let className = 'input-checkbox';
    const selectedItems = _.filter(this.state.selectionData, { 'checked': true });
    const selectedLength = selectedItems.length;
    const dataLength = this.state.selectionData.length;
    if (selectedLength > 0 && selectedLength < dataLength) {
        className += ' checkbox-partial';
    }
    return (
        <div className="checkbox">
            <input
                type="checkbox"
                id="headerCheckbox"
                className={className}
                onChange={actions.handleHeaderCheckbox}
                ref={e => {
                    this.headerCheckbox = e;
                }}
            />
            <label htmlFor="headerCheckbox" />
        </div>
    );
};
const renderCheckbox = (value, row) => {
    return (
        <div className="checkbox">
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
};
const columns = [
    { title: renderHeaderCheckbox(), key: 'checked', dataIndex: 'checked', render: renderCheckbox, width: 38 },
    { title: 'Event Type', key: 'eventType', dataIndex: 'eventType' },
    { title: 'Affected Devices', key: 'affectedDevices', dataIndex: 'affectedDevices' },
    { title: 'Detections', key: 'detections', dataIndex: 'detections' }
];

<Table
    rowKey="id"
    columns={columns}
    data={data}
    rowClassName={actions.handleRowClassName}
    onRowClick={actions.handleClickRow}
/>
```

## API

### Properties

#### Table

Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
averageColumnsWidth | Boolean                           | true    | Whether average table cell width.
bordered            | Boolean                           | true    | Whether table border is shown.
columns             | Object[]                          | []      | The columns config of table, see table below.
data                | Object[]                          | []      | Data record array to be rendered.
emptyText           | Function                          | () => { return 'No Data'; } | Display text when data is empty.
expandedRowKeys     | String[]                          |         | Current expanded rows keys.
expandedRowRender   | Function(record, key)             |         | Expanded content render function.
footer              | Function                          |         | Table footer render function.
hoverable           | Boolean                           | true    | Whether use row hover style.
loading             | Boolean                           | false   | Whether table is loading.
maxHeight           | Number                            |         | Table maximum height.
onRowClick          | Function(record, key)             |         | Handle rowClick action.
showHeader          | Boolean                           | true    | Whether table head is shown.
sortable            | Boolean                           | false   | Whether use sortting event at table head.
title               | Function                          |         | Table title render function.
useFixedHeader      | Boolean                           | false   | Whether table head is fixed.
rowClassName        | Function(record, key):string      |         | Get row's className.
rowKey              | string or Function(record):string | 'key'   | If rowKey is string, `record[rowKey]` will be used as key. If rowKey is function, the return value of `rowKey(record)` will be use as key.

#### Column Props

Name      | Type                 | Default | Description
:---      | :---                 | :------ | :----------
className | String               |         | class name of the table cell.
key       | String               |         | Key of this column.
title     | React Node           |         | Title of this column.
dataIndex | String               |         | Display field of the data record.
width     | Number               |         | Width of the specific proportion calculation according to the width of the columns.
fixed     | Boolean              |         | This column will be fixed af left side when table scroll horizontally.
render    | Function(value, row) |         | The render function of cell, has two params: the text of this cell, the record of this row, it's return a react node.

## License

MIT
