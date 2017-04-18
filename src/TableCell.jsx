import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './index.styl';

export default class extends Component {
    static propTypes = {
        column: PropTypes.object,
        record: PropTypes.object
    };

    static defaultProps = {
        column: {},
        record: {}
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const { column, record } = this.props;
        const cName = column.dataIndex;
        const render = column.render;
        let text = record[cName];
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
