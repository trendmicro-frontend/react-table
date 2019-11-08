import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.styl';

class TableHeader extends Component {
    static propTypes = {
        columns: PropTypes.array,
        scrollLeft: PropTypes.number,
        width: PropTypes.number,
    };

    componentDidUpdate(prevProps, prevState) {
        const { scrollLeft } = this.props;
        if (scrollLeft !== prevProps.scrollLeft) {
            this.header.scrollLeft = scrollLeft;
        }
    }

    render() {
        const {
            columns,
            width: tableWidth,
        } = this.props;

        return (
            <div
                className={styles.thead}
                ref={node => {
                    this.header = node;
                }}
                style={{
                    width: tableWidth,
                }}
            >
                <div className={styles.tr}>
                    {
                        columns.map((column, index) => {
                            const key = `table_header_cell_${index}`;
                            const {
                                onClick,
                                title,
                                width: cellWidth,
                            } = column;
                            return (
                                <div
                                    key={key}
                                    className={styles.th}
                                    onClick={onClick}
                                    role="presentation"
                                    style={{
                                        width: cellWidth,
                                    }}
                                >
                                    { typeof title === 'function' ? title(column) : title }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default TableHeader;
