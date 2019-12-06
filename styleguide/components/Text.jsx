import styled, { css } from 'styled-components';

const Text = styled.div`${({
    fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    size = 'inherit',
    color = 'inherit',
    bold
}) => css`
    display: inline-block;
    color: ${color};
    background-color: transparent;
    vertical-align: middle;
    font-family: ${fontFamily};
    font-size: ${Number(size) > 0 ? `${size}px` : size};
    font-weight: ${!!bold ? 'bold' : 'inherit'};
`}`;

export default Text;
