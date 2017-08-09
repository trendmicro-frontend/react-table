import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import styles from './index.styl';

class TableCell extends PureComponent {
    static propTypes = {
        column: PropTypes.object,
        record: PropTypes.object
    };

    static defaultProps = {
        column: {},
        record: {}
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (typeof nextProps.column.render === 'function')
            ||
            nextProps.column !== this.props.column
            ||
            nextProps.record !== this.props.record
        );
    }

    render() {
        const { column, record } = this.props;
        const render = column.render;
        // dataKey is an alias for dataIndex
        const dataKey = (typeof column.dataKey !== 'undefined') ? column.dataKey : column.dataIndex;
        const text = get(record, dataKey);

        return (
            <div
                className={classNames(
                    styles.td,
                    column.className,
                    column.cellClassName
                )}
                style={{
                    ...column.style,
                    ...column.cellStyle
                }}
            >
                <div className={styles.tdContent}>
                    {typeof render === 'function' ? render(text, record) : text}
                </div>
            </div>
        );
    }
}

export default TableCell;
