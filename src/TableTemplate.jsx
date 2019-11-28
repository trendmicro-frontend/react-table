import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import TableWrapper from './TableWrapper';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableCell from './TableCell';

class TableTemplate extends Component {
    static propTypes = {
        bordered: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
        emptyBody: PropTypes.element,
        height: PropTypes.number,
        hideHeader: PropTypes.bool,
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        loader: PropTypes.element,
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

    renderHeader = (cells) => {
        const columns = cells;
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
                                <TableCell
                                    key={key}
                                    width={cellWidth}
                                >
                                    { typeof title === 'function' ? title(column) : title }
                                </TableCell>
                            );
                        })
                    }
                </TableRow>
            </TableHeader>
        );
    };

    renderBody = (cells) => {
        const columns = cells;
        const {
            data,
            emptyBody,
            loading,
        } = this.props;
        const showEmpty = (data.length === 0) && !loading;

        return (
            <TableBody>
                { showEmpty && emptyBody }
                {
                    data.map((row, index) => {
                        const rowKey = `table_row${index}`;
                        return (
                            <TableRow key={rowKey}>
                                {
                                    columns.map((column, index) => {
                                        const key = `${rowKey}_cell${index}`;
                                        const cellValue = _get(row, column.dataKey);
                                        const cell = (typeof column.render === 'function' ? column.render(cellValue, row, index) : cellValue);
                                        return (
                                            <TableCell
                                                key={key}
                                                width={column.width}
                                            >
                                                { cell }
                                            </TableCell>
                                        );
                                    })
                                }
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        );
    };

    render() {
        const {
            data,
            bordered,
            height,
            hideHeader,
            hoverable,
            loading,
            loader,
            useFixedHeader,
            width,
            columns,
        } = this.props;
        const isNoData = (data.length === 0) && !loading;

        if (!useFixedHeader) {
            return (
                <TableWrapper
                    bordered={bordered}
                    height={height}
                    hoverable={hoverable}
                    isNoData={isNoData}
                    width={width}
                >
                    <Scrollbars
                        autoHeight={!height}
                        autoHeightMax="100%"
                    >
                        { !hideHeader && this.renderHeader(columns) }
                        <div style={{ flex: '1 1 auto', position: 'relative' }}>
                            { this.renderBody(columns) }
                            { loading && loader }
                        </div>
                    </Scrollbars>
                </TableWrapper>
            );
        }

        return (
            <TableWrapper
                bordered={bordered}
                height={height}
                hoverable={hoverable}
                isNoData={isNoData}
                width={width}
            >
                <React.Fragment>
                    { !hideHeader && this.renderHeader(columns) }
                    <Scrollbars
                        autoHeight={!height}
                        autoHeightMax="100%"
                        onScroll={this.onScroll}
                    >
                        { this.renderBody(columns) }
                        { loading && loader }
                    </Scrollbars>
                </React.Fragment>
            </TableWrapper>
        );
    }
}

export default TableTemplate;
