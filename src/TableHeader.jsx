import styled from 'styled-components';
import React from 'react';

const TableHeader = React.forwardRef(({
    children,
    ...props
}, ref) => {
    return (
        <HeaderStyle
            ref={ref}
            {...props}
        >
            { children }
        </HeaderStyle>
    );
});

const HeaderStyle = styled.div`
    flex: 0 0 auto;
    overflow: hidden;
`;

export default TableHeader;
