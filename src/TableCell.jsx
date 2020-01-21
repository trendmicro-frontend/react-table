import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { useTableContext } from './context';

const TableCell = React.forwardRef(({
    children,
    width,
    ...props
}, ref) => {
    const {
        minimalist,
    } = useTableContext();

    return (
        <CellStyle
            ref={ref}
            minimalist={minimalist}
            width={width}
            {...props}
        >
            { children }
        </CellStyle>
    );
});

TableCell.propTypes = {
    width: PropTypes.number.isRequired,
};

const CellStyle = styled.div`
    padding: 8px 12px;
    flex: 1 0 auto;
    width: ${props => props.width}px;

    ${props => !props.minimalist && css`
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    `}

    ${props => props.minimalist && css`
        border-bottom: 1px solid #ddd;
    `}
`;

export default TableCell;
