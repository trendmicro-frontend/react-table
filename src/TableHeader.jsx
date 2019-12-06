import PropTypes from 'prop-types';
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

TableHeader.propTypes = {
    width: PropTypes.number,
};

const HeaderStyle = styled.div`
    flex: 0 0 auto;
    overflow: hidden;
`;

export default TableHeader;
