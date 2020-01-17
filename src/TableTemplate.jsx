import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import styled, { css } from 'styled-components';
import TableWrapper from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TableHeaderCell from './TableHeaderCell';

class TableTemplate extends Component {
    static propTypes = {
        minimalist: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyText: PropTypes.string,
        emptyRender: PropTypes.func,
        height: PropTypes.number,
        hideHeader: PropTypes.bool,
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        loaderRender: PropTypes.func,
        useFixedHeader: PropTypes.bool,
        width: PropTypes.number.isRequired,
    };

    static defaultProps = {
        data: [],
    };

    constructor(props) {
        super(props);
        this.tableHeaderRef = React.createRef();
    }

    onScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        if (!!this.tableHeaderRef && this.tableHeaderRef.current.scrollLeft !== scrollLeft) {
            this.tableHeaderRef.current.scrollLeft = scrollLeft;
        }
    };

    renderHeader = ({ cells: columns }) => {
        return (
            <TableHeader ref={this.tableHeaderRef}>
                <TableRow>
                    {
                        columns.map((column, index) => {
                            const key = `table_header_cell_${index}`;
                            const {
                                title,
                                width: cellWidth,
                            } = column;
                            return (
                                <TableHeaderCell
                                    key={key}
                                    width={cellWidth}
                                >
                                    { typeof title === 'function' ? title(column) : title }
                                </TableHeaderCell>
                            );
                        })
                    }
                </TableRow>
            </TableHeader>
        );
    };

    renderBody = ({ cells: columns, data, emptyBody }) => {
        const {
            hoverable,
        } = this.props;
        const showEmpty = (data.length === 0);

        return (
            <TableBody>
                { showEmpty && emptyBody }
                {
                    data.map((row, index) => {
                        const rowKey = `table_row${index}`;
                        return (
                            <StyledTableRow
                                key={rowKey}
                                hoverable={hoverable}
                            >
                                {
                                    columns.map((column, index) => {
                                        const key = `${rowKey}_cell${index}`;
                                        const cellValue = _get(row, column.dataKey);
                                        const cell = (typeof column.render === 'function' ? column.render(cellValue, row, index) : cellValue);
                                        return (
                                            <StyledTableCell
                                                key={key}
                                                width={column.width}
                                            >
                                                { cell }
                                            </StyledTableCell>
                                        );
                                    })
                                }
                            </StyledTableRow>
                        );
                    })
                }
            </TableBody>
        );
    };

    render() {
        const {
            data,
            minimalist,
            height,
            hideHeader,
            loading,
            useFixedHeader,
            width,
            columns,
            ...props
        } = this.props;

        return (
            <TableWrapper
                columns={columns}
                data={data}
                minimalist={minimalist}
                height={height}
                width={width}
                {...props}
            >
                {
                    ({ cells, data, emptyBody, loader }) => {
                        return (
                            <React.Fragment>
                                { !hideHeader && useFixedHeader && this.renderHeader({ cells, data }) }
                                <Scrollbars
                                    autoHeight={!height}
                                    autoHeightMax="100%"
                                    onScroll={this.onScroll}
                                >
                                    { !hideHeader && !useFixedHeader && this.renderHeader({ cells, data }) }
                                    <div style={{ flex: '1 1 auto', position: 'relative' }}>
                                        { this.renderBody({ cells, data, emptyBody }) }
                                        { loading && loader }
                                    </div>
                                </Scrollbars>
                            </React.Fragment>
                        );
                    }
                }
            </TableWrapper>
        );
    }
}

const StyledTableCell = styled(TableCell)``;

const StyledTableRow = styled(TableRow)`
    ${props => props.hoverable && css`
        &:hover {
            ${StyledTableCell} {
                background-color: #e6f4fc;
            }
        }
    `}
`;

export default TableTemplate;
