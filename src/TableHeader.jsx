import Anchor from '@trendmicro/react-anchor';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';

class TableHeader extends PureComponent {
    static propTypes = {
        columns: PropTypes.array,
        scrollLeft: PropTypes.number
    };

    componentDidUpdate(prevProps, prevState) {
        const { scrollLeft } = this.props;
        if (this.header.scrollLeft !== scrollLeft) {
            this.header.scrollLeft = scrollLeft;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.columns.some((obj, index, array) => (typeof obj.title === 'function'))
            ||
            nextProps.scrollLeft !== this.props.scrollLeft
            ||
            nextProps.columns !== this.props.columns
        );
    }

    renderColumns(columns) {
        return columns.map(column => {
            const { title = '', sortOrder, onClick } = { ...column };
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
                        onClick={onClick}
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
            const key = `table_header_cell_${index}`;
            return (
                <div
                    key={key}
                    className={classNames(
                        styles.th,
                        column.className,
                        column.headerClassName
                    )}
                    style={{
                        ...column.style,
                        ...column.headerStyle
                    }}
                >
                    <div className={styles.thContent}>
                        {typeof column.title === 'function' ? column.title() : column.title}
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

export default TableHeader;
