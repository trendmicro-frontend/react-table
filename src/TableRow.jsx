import cx from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import styles from './index.styl';
import TableCell from './TableCell';

class TableRow extends Component {
    static propTypes = {
        columns: PropTypes.array,
        expandedRowRender: PropTypes.func,
        hoverable: PropTypes.bool,
        isExpanded: PropTypes.bool,
        isSelected: PropTypes.bool,
        onRowClick: PropTypes.func,
        record: PropTypes.object,
        rowIndex: PropTypes.number,
        rowKey: PropTypes.any,
    };

    static defaultProps = {
        expandedRowRender: () => {},
        onRowClick: () => {},
        record: {},
    };

    shouldComponentUpdate(nextProps, nextState) {
        const recordEqual = isEqual(nextProps.record, this.props.record);
        return (
            this.props.isExpanded !== nextProps.isExpanded ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.className !== nextProps.className ||
            !recordEqual
        );
    }

    handleRowClick = (event) => {
        const { onRowClick, record, rowIndex } = this.props;
        onRowClick(record, rowIndex, event);
    };

    render() {
        const {
            columns,
            expandedRowRender,
            rowKey,
            rowIndex,
            record,
            className,
            isExpanded,
        } = this.props;

        return (
            <Fragment>
                <div
                    className={cx(
                        styles.tr,
                        className,
                    )}
                    role="presentation"
                    onClick={this.handleRowClick}
                >
                    {
                        columns.map((column, index) => {
                            const key = `${rowKey}_${index}`;
                            const cellValue = get(record, column.dataKey);
                            const cell = (typeof column.render === 'function' ? column.render(cellValue, record, rowIndex) : cellValue);

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
                </div>
                { isExpanded && (
                    <div className={styles['tr-expand']}>
                        { expandedRowRender(record, rowIndex) }
                    </div>
                )}
            </Fragment>
        );
    }
}

export default TableRow;
