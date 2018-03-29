import cx from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styles from './index.styl';

class TableCell extends Component {
    static propTypes = {
        column: PropTypes.object,
        record: PropTypes.object
    };

    static defaultProps = {
        column: {},
        record: {}
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { column: currentColumn, record: currentRecord } = this.props;
        const { column: nextColumn, record: nextRecord } = nextProps;
        const nextRender = nextColumn.render;
        const currentDataKey = (typeof currentColumn.dataKey !== 'undefined')
            ? currentColumn.dataKey
            : currentColumn.dataIndex;
        const nextDataKey = (typeof nextColumn.dataKey !== 'undefined')
            ? nextColumn.dataKey
            : nextColumn.dataIndex;

        if (typeof nextRender === 'function') {
            return true;
        }

        if (nextColumn !== currentColumn) {
            return true;
        }

        if ((nextRecord !== currentRecord) && (get(currentRecord, currentDataKey) !== get(nextRecord, nextDataKey))) {
            return true;
        }

        return false;
    }

    render() {
        const { column, record } = this.props;
        const render = column.render;
        // dataKey is an alias for dataIndex
        const dataKey = (typeof column.dataKey !== 'undefined') ? column.dataKey : column.dataIndex;
        const text = get(record, dataKey);

        return (
            <div
                className={cx(
                    styles.td,
                    column.className,
                    column.cellClassName
                )}
                style={{
                    ...column.style,
                    ...column.cellStyle
                }}
            >
                <div
                    className={cx(
                        styles.tdContent,
                        column.cellContentClassName
                    )}
                    style={column.cellContentStyle}
                >
                    {typeof render === 'function' ? render(text, record) : text}
                </div>
            </div>
        );
    }
}

export default TableCell;
