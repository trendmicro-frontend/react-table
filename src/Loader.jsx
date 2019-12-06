import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = React.forwardRef((props, ref) => {
    return (
        <LoaderOverlay>
            <LoaderIcon />
        </LoaderOverlay>
    );
});

const spinner = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoaderOverlay = styled.div`
    background-color: rgba(255, 255, 255, .8);
    cursor: wait;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

const LoaderIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 56px;
    height: 56px;
    margin-top: -28px;
    margin-left: -28px;
    text-indent: -9999em;
    border: 2px solid rgba(0, 0, 0, .2);
    border-left-color: rgba(0, 0, 0, .8);
    border-radius: 50%;
    transform: translateZ(0);
    animation: ${spinner} 1s infinite linear;
`;

export default Loader;
