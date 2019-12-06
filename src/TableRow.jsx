import React from 'react';
import styled from 'styled-components';

const TableRow = React.forwardRef(({
    children,
    ...props
}, ref) => {
    return (
        <RowStyle
            ref={ref}
            {...props}
        >
            { children }
        </RowStyle>
    );
});

const RowStyle = styled.div`
    display: flex;
`;


export default TableRow;
