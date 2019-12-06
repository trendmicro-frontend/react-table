import React from 'react';

const TableContext = React.createContext({
    minimalist: false,
});
export const useTableContext = () => React.useContext(TableContext);

export default TableContext;
