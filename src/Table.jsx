import cx from 'classnames';
import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import styles from './index.styl';
import TableTemplate from './TableTemplate';
import TableWrapper from './TableWrapper';

class Table extends Component {
    static propTypes = {
        bordered: PropTypes.bool,
        columns: PropTypes.array,
        data: PropTypes.array,
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
        columns: [],
        data: [],
        height: 0,
        emptyRender: () => {
            return 'No Data';
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
        const defaultLoader = () => {
            return (
                <div className={styles.loaderOverlay}>
                    <span className={cx(styles.loader, styles.loaderLarge)} />
                </div>
            );
        };
        const loader = loaderRender || defaultLoader;
        return loader();
    };

    renderEmptyBody = () => {
        const { emptyRender } = this.props;
        return (
            <div className={styles.tablePlaceholder}>
                { emptyRender() }
            </div>
        );
    };

    render() {
        const {
            thisColumns,
        } = this.state;
        const {
            bordered,
            children,
            data,
            height,
            hideHeader,
            hoverable,
            loading,
            style,
            useFixedHeader,
            width,
        } = this.props;
        const loader = this.renderLoader();
        const emptyBody = this.renderEmptyBody();

        if (typeof children === 'function') {
            return (
                <TableWrapper
                    bordered={bordered}
                    height={height}
                    hoverable={hoverable}
                    isNoData={!data || data.length === 0}
                    style={style}
                    width={width}
                >
                    {
                        children({
                            cells: thisColumns,
                            loader: loader,
                            emptyBody: emptyBody
                        })
                    }
                </TableWrapper>
            );
        }

        return (
            <TableTemplate
                bordered={bordered}
                columns={thisColumns}
                data={data}
                emptyBody={emptyBody}
                height={height}
                hideHeader={hideHeader}
                hoverable={hoverable}
                loading={loading}
                loader={loader}
                useFixedHeader={useFixedHeader}
                width={width}
            />
        );
    }
}

export default Table;
