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
    columns={columns}
    data={data}
    width={500}
/>
```

## API

### Properties

#### Table

Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
bordered            | Boolean                           | false   | Specify whether the table should be bordered.
columns             | Object[]                          | []      | The columns config of table, see Column below for details.
data                | Object[]                          | []      | Data record array to be rendered.
emptyRender         | Function                          | () => { return 'No Data'; } | Empty content render function.
height              | Number                            |         | The height of the table.
hideHeader          | Boolean                           | false   | Whether table head is hiden.
hoverable           | Boolean                           | false   | Whether use row hover style.
loading             | Boolean                           | false   | Whether table is loading.
loaderRender        | Function                          |         | Loading content render function.
useFixedHeader      | Boolean                           | false   | Whether table head is fixed.
width               | Number(required)                  |         | The width of the table.

#### Column

Name            | Type    | Default | Description
:---            | :-----  | :------ | :----------
title           | React Node or Function(): React Node |         | Title of this column.
dataKey         | String  |         | Display field of the data record.
width           | String or Number  | 150        | Width of the specific proportion calculation according to the width of the columns.
render          | Function(value, record, rowIndex) |         | The render function of cell, has two params: the text of this cell, the record of this row, it's return a react node.

## License

MIT
