# react-table [![build status](https://travis-ci.org/trendmicro-frontend/react-table.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-table) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-table/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-table?branch=master)

[![NPM](https://nodei.co/npm/@trendmicro/react-table.png?downloads=true&stars=true)](https://nodei.co/npm/@trendmicro/react-table/)

React Table

Demo: https://trendmicro-frontend.github.io/react-table

## Version 1.x is no longer maintained by 2019/12/06
[Friendly reminder] Please migrate to 2+ asap.

## Installation

1. Install the latest version of [react](https://github.com/facebook/react) and [react-table](https://github.com/trendmicro-frontend/react-table):

  ```
  npm install --save react @trendmicro/react-table @trendmicro/react-paginations
  ```

2. At this point you can import `@trendmicro/react-table` and its styles in your application as follows:

  ```js
  import TableTemplate, { TableWrapper, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '@trendmicro/react-table';
  ```

## Usage

### Table Template

```js
<TableTemplate
    hoverable
    useFixedHeader
    columns={columns}
    data={data}
    width={500}
/>
```

### Custom render

```js
<TableWrapper
    columns={columns}
    data={data}
    width={800}
    height={320}
>
    {({ cells, data, loader, emptyBody, tableWidth }) => {
        return (
            <Fragment>
                <TableHeader>
                    <TableRow>
                        {
                            cells.map((cell, index) => {
                                const key = `table_header_cell_${index}`;
                                const {
                                    title,
                                    width: cellWidth,
                                } = cell;
                                return (
                                    <TableHeaderCell
                                        key={key}
                                        width={cellWidth}
                                    >
                                        { title }
                                    </TableHeaderCell>
                                );
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Scrollbars
                        style={{
                            width: tableWidth
                        }}
                    >
                        {
                            data.map((row, index) => {
                                const rowKey = `table_row${index}`;
                                return (
                                    <TableRow key={rowKey}>
                                        {
                                            cells.map((cell, index) => {
                                                const key = `${rowKey}_cell${index}`;
                                                const cellValue = _get(row, cell.dataKey);
                                                return (
                                                    <TableCell
                                                        key={key}
                                                        width={cell.width}
                                                    >
                                                        { typeof cell.render === 'function' ? cell.render(cellValue, row, index) : cellValue }
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            })
                        }
                    </Scrollbars>
                </TableBody>
            </Fragment>
        );
    }}
</TableWrapper>
```

## API

### Properties

#### TableWrapper
Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
minimalist          | Boolean                           | false   | Specify whether the table should not be bordered.
columns             | Object[]                          | []      | The columns config of table, see Column below for details.
data                | Object[]                          | []      | Data record array to be rendered.
emptyRender         | Function                          | () => { return 'No Data'; } | Empty content render function.
emptyText           | String                            | 'No Data' | The text when data is null.
height              | Number                            |         | The height of the table.
loading             | Boolean                           | false   | Whether table is loading.
loaderRender        | Function                          |         | Loading content render function.
width               | Number(required)                  |         | The width of the table.

#### TableHeaderCell
Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
width               | Number(required)                  |         | The width of the table.

#### TableCell
Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
width               | Number(required)                  |         | The width of the table.


#### TableTemplate

Name                | Type                              | Default | Description
:---                | :---                              | :------ | :----------
minimalist          | Boolean                           | false   | Specify whether the table should not be bordered.
columns             | Object[]                          | []      | The columns config of table, see Column below for details.
data                | Object[]                          | []      | Data record array to be rendered.
emptyRender         | Function                          | () => { return 'No Data'; } | Empty content render function.
emptyText           | String                            | 'No Data' | The text when data is null.
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
