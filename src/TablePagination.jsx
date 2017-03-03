import { TablePagination } from '@trendmicro/react-paginations';
import React from 'react';

export default ({ style, ...props }) => {
    return (
        <TablePagination
            {...props}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                ...style
            }}
        />
    );
};
