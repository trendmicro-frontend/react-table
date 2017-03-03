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
        <Table.Toolbar>
            <Button btnStyle="flat">
                Export
            </Button>
            <Table.Pagination
                page={page}
                pageLength={pageLength}
                totalRecords={totalRecords}
                onPageChange={({ page, pageLength }) => {
                    this.actions.fetchRecords({ page, pageLength });
                }}
                prevPageRenderer={() => <i className="fa fa-angle-left" />}
                nextPageRenderer={() => <i className="fa fa-angle-right" />}
            />
        </Table.Toolbar>
    )}
/>
```


## API

### Properties

#### Table

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### TableToolbar

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### TablePagination

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

## License

MIT
