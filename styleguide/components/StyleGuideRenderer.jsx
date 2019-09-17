import PropTypes from 'prop-types';
import React from 'react';
import GitHubCorner from 'react-github-corner';
import styled from 'styled-components';
import pkg from '../../package.json';

const Root = styled.div`
    min-height: 100vh;
    background-color: #fff;
    padding-left: 240px;
`;

const Main = styled.main`
    padding: 16px 32px;
    margin: 0 auto;
    display: block;
`;

const Sidebar = styled.div`
    background-color: #f5f5f5;
    border: #e8e8e8 solid;
    border-width: 0 1px 0 0;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
`;

const Block = styled.div``;

const TextBlock = styled(Block)`
    padding: 16px;
    border-bottom: 1px #e8e8e8 solid;
    color: #333;
    margin: 0;
    font-size: 18px;
    font-weight: normal;
`;

const StyleGuideRenderer = ({
    title,
    toc,
    children,
}) => {
    return (
        <Root>
            <GitHubCorner href={pkg.homepage} />
            <Sidebar>
                <TextBlock>
                    {title}
                </TextBlock>
                <Block>
                    {toc}
                </Block>
            </Sidebar>
            <Main id="example">
                {children}
            </Main>
        </Root>
    );
};

StyleGuideRenderer.propTypes = {
    title: PropTypes.string,
    toc: PropTypes.node,
};

export default StyleGuideRenderer;
