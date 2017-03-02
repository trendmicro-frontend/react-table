import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Table from 'rc-table';
import styles from './index.styl';

export default class extends Component {
    static propTypes = {
        ...Table.propTypes,
        bordered: PropTypes.bool,
        hoverable: PropTypes.bool
    };
    static defaultProps = {
        ...Table.defaultProps,
        bordered: true,
        hoverable: true
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    render() {
        const {
            bordered,
            hoverable,
            className,
            ...props
        } = this.props;

        return (
            <Table
                {...props}
                className={classNames(
                    className,
                    styles.table,
                    { [styles.tableBordered]: bordered },
                    { [styles.tableMinimalism]: !bordered },
                    { [styles.tableNoData]: !props.data || props.data.length === 0 },
                    { [styles.tableHover]: hoverable }
                )}
            />
        );
    }
}
