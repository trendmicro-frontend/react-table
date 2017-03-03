import { ColumnGroup, Column } from 'rc-table';
import Table from './Table';
import TableToolbar from './TableToolbar';
import TablePagination from './TablePagination';

export { ColumnGroup, Column };

Table.Toolbar = TableToolbar;
Table.Pagination = TablePagination;
Table.ColumnGroup = ColumnGroup;
Table.Column = Column;

module.exports = Table;
