import Anchor from '@trendmicro/react-anchor';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Table from 'rc-table';
import styles from './index.styl';

export default class extends Component {
    static propTypes = {
        ...Table.propTypes,
        bordered: PropTypes.bool,
        hoverable: PropTypes.bool,
        loading: PropTypes.bool,
        sortable: PropTypes.bool
    };
    static defaultProps = {
        ...Table.defaultProps,
        bordered: true,
        hoverable: true,
        loading: false,
        sortable: false
    };

    table = null;

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    renderColumns(columns) {
        return columns.map(column => {
            const { key, title = '', sortOrder, onClick } = { ...column };
            const clickable = (typeof onClick === 'function');

            if (!clickable) {
                return column;
            }

            const columnSortStyle = {
                'asc': styles.columnSortAsc,
                'desc': styles.columnSortDesc
            }[sortOrder];
            const isSortColumn = !!columnSortStyle;

            return {
                ...column,
                title: (
                    <Anchor
                        className={classNames(
                            styles.clickableColumn,
                            { [styles.columnSort]: isSortColumn }
                        )}
                        onClick={(event) => {
                            onClick(key, event);
                        }}
                    >
                        {title}
                        {columnSortStyle &&
                        <i className={columnSortStyle} />
                        }
                    </Anchor>
                )
            };
        });
    }
    render() {
        const {
            columns,
            bordered,
            hoverable,
            loading,
            sortable,
            className,
            ...props
        } = this.props;

        return (
            <div className={classNames({ [styles.tableContainer]: loading })}>
                <Table
                    ref={node => {
                        if (!node) {
                            return;
                        }
                        this.table = node;
                    }}
                    {...props}
                    columns={this.renderColumns(columns)}
                    className={classNames(
                        className,
                        styles.table,
                        { [styles.tableBordered]: bordered },
                        { [styles.tableMinimalism]: !bordered },
                        { [styles.tableNoData]: !props.data || props.data.length === 0 },
                        { [styles.tableHover]: hoverable },
                        { [styles.tableSortable]: sortable }
                    )}
                />
                {loading &&
                <div className={styles.loaderOverlay}>
                    <span className={classNames(styles.loader, styles.loaderLarge)} />
                </div>
                }
            </div>
        );
    }
}
