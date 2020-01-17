import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import TableContext from './context';
import Loader from './Loader';

class Table extends Component {
    static propTypes = {
        minimalist: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.string,
        emptyRender: PropTypes.func,
        height: PropTypes.number,
        loading: PropTypes.bool,
        loaderRender: PropTypes.func,
        width: PropTypes.number.isRequired,
    };

    static defaultProps = {
        columns: [],
        data: [],
        height: 0,
        emptyText: 'No Data',
        loaderRender: () => {
            return (
                <Loader />
            );
        },
    };

    constructor(props) {
        super(props);

        this.state = {
            prevColumns: [],
            thisColumns: [],
        };
    }

    static getDerivedStateFromProps(props, state) {
        const columnsAreChanged = !isEqual(
            props.columns,
            state.prevColumns
        );

        if (columnsAreChanged) {
            const { columns: initColumns, width: tableWidth } = props;
            const columns = initColumns.map(column => {
                let columnWidth = column.width;
                if (typeof columnWidth === 'string') {
                    const lastChar = columnWidth.substr(columnWidth.length - 1);
                    if (lastChar === '%') {
                        columnWidth = tableWidth * (parseFloat(columnWidth) / 100);
                        return {
                            ...column,
                            width: columnWidth
                        };
                    }
                }
                return column;
            });
            const customWidthColumns = columns.filter(column => !!column.width);
            const customWidthColumnsTotalWidth = customWidthColumns.reduce((accumulator, column) => accumulator + column.width, 0);
            let averageWidth = (tableWidth - customWidthColumnsTotalWidth) / (columns.length - customWidthColumns.length);
            averageWidth = averageWidth <= 0 ? 150 : averageWidth;
            const parsedColumns = columns.map(column => {
                if (!!column.width) {
                    return column;
                }
                return {
                    ...column,
                    width: averageWidth
                };
            });

            return {
                prevColumns: props.columns,
                thisColumns: parsedColumns,
            };
        }
        return null;
    }

    renderLoader = () => {
        const { loaderRender } = this.props;
        return loaderRender();
    };

    renderEmptyBody = () => {
        const {
            emptyRender,
            emptyText,
            minimalist,
        } = this.props;
        const defaultEmptyBody = (text) => {
            return (
                <EmptyBodyStyle minimalist={minimalist}>
                    { text }
                </EmptyBodyStyle>
            );
        };
        const emptyBody = emptyRender ? emptyRender() : defaultEmptyBody(emptyText);
        return emptyBody;
    };

    render() {
        const {
            thisColumns,
        } = this.state;
        const {
            minimalist,
            children,
            data,
            height,
            width,
            ...props
        } = this.props;
        const loader = this.renderLoader();
        const emptyBody = this.renderEmptyBody();
        const tableHeight = !!height ? `${height}px` : 'auto';
        const tableWidth = !!width ? `${width}px` : 'auto';

        const context = {
            minimalist,
        };

        return (
            <TableContext.Provider value={context}>
                <WrapperStyle
                    width={tableWidth}
                    height={tableHeight}
                    {...props}
                >
                    { typeof children === 'function'
                        ? children({
                            cells: thisColumns,
                            data: data,
                            loader: loader,
                            emptyBody: emptyBody,
                            tableWidth: width,
                        })
                        : children
                    }
                    { !minimalist && (
                        <React.Fragment>
                            <BorderTop />
                            <BorderRight />
                            <BorderBottom />
                            <BorderLeft />
                        </React.Fragment>
                    )}
                </WrapperStyle>
            </TableContext.Provider>
        );
    }
}

const WrapperStyle = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    line-height: 20px;
    height: ${props => props.height};
    width: ${props => props.width};
    box-sizing: border-box;
    *, *:before, *:after {
        box-sizing: inherit;
    }
`;

const EmptyBodyStyle = styled.div`
    text-align: center;
    padding: 44px 12px;
    color: #999;
`;

const VerticalLine = styled.div`
    border: none;
    border-left: 1px solid #ddd;
    height: 100%;
    width: 1px;
`;

const HorizontalLine = styled.div`
    border: none;
    border-top: 1px solid #ddd;
    height: 1px;
    width: 100%;
`;

const BorderTop = styled(HorizontalLine)`
    position: absolute;
    top: 0;
`;
const BorderRight = styled(VerticalLine)`
    position: absolute;
    top: 0;
    right: 0;
`;
const BorderBottom = styled(HorizontalLine)`
    position: absolute;
    bottom: 0;
`;
const BorderLeft = styled(VerticalLine)`
    position: absolute;
    top: 0;
    left: 0;
`;

export default Table;
