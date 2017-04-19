import Anchor from '@trendmicro/react-anchor';
import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './index.styl';

export default class extends Component {
    static propTypes = {
        columns: PropTypes.array,
        scrollLeft: PropTypes.number,
        sortable: PropTypes.bool
    };

    static defaultProps = {
        columns: [],
        sortable: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        const { scrollLeft } = this.props;
        if (this.header.scrollLeft !== scrollLeft) {
            this.header.scrollLeft = scrollLeft;
        }
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
                        <span className={styles.overflowEllipsis}>{title}</span>
                        {columnSortStyle &&
                        <i className={columnSortStyle} />
                        }
                    </Anchor>
                )
            };
        });
    }

    renderCell() {
        const { columns } = this.props;
        const customColumns = this.renderColumns(columns);
        return customColumns.map((column, index) => {
            return (
                <div key={index} className={styles.th}>
                    <div className={styles.tdContent}>
                        {column.title}
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div
                className={styles.thead}
                ref={node => {
                    this.header = node;
                }}
            >
                <div className={styles.tr}>
                    {this.renderCell()}
                </div>
            </div>
        );
    }
}
