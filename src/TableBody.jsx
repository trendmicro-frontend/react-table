import React from 'react';
import styled from 'styled-components';

const TableBody = React.forwardRef(({
    children,
    ...props
}, ref) => {
    return (
        <BodyStyle
            ref={ref}
            {...props}
        >
            { children }
        </BodyStyle>
    );
});

const BodyStyle = styled.div`
    flex: 1 1 auto;
`;

export default TableBody;
