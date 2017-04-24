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

    render() {
        const { column, record } = this.props;
        const cName = column.dataIndex;
        const render = column.render;
        let text = get(record, cName);
        return (
            <div className={styles.td}>
                <div className={styles.tdContent}>
                    {
                        render ? render(text, record) : text
                    }
                </div>
            </div>
        );
    }
}

export default TableCell;
