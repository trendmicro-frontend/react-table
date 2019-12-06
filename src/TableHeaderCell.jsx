import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { useTableContext } from './context';

const TableHeaderCell = React.forwardRef(({
    children,
    width,
    ...props
}, ref) => {
    const {
        minimalist,
    } = useTableContext();

    return (
        <HeaderCellStyle
            ref={ref}
            minimalist={minimalist}
            width={width}
            {...props}
        >
            { children }
        </HeaderCellStyle>
    );
});

TableHeaderCell.propTypes = {
    width: PropTypes.number.isRequired,
};

const HeaderCellStyle = styled.div`
    padding: 8px 12px;
    flex: 1 0 auto;
    color: #777;
    font-weight: bold;
    width: ${props => props.width}px;

    ${props => !props.minimalist && css`
        background-color: #EEEEEE;
        border-right: 1px solid #ddd;
        border-bottom: 2px solid #ccc;
        &:first-child {
            border-left: 1px solid #ddd;
        }
    `}

    ${props => props.minimalist && css`
        border-bottom: 2px solid #ccc;
    `}
`;

export default TableHeaderCell;
