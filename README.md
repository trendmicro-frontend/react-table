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
height              | Number                            |         | Table height.
hoverable           | Boolean                           | true    | Whether use row hover style.
loading             | Boolean                           | false   | Whether table is loading.
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
key       | String               |         | Key of this column.
title     | React Node           |         | Title of this column.
dataIndex | String               |         | Display field of the data record.
width     | Number               |         | Width of the specific proportion calculation according to the width of the columns.
fixed     | Boolean              |         | This column will be fixed af left side when table scroll horizontally.
render    | Function(value, row) |         | The render function of cell, has two params: the text of this cell, the record of this row, it's return a react node.

## License

MIT
