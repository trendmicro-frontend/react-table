import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './index.styl';
import TableCell from './TableCell';

export default class extends Component {
    static propTypes = {
        columns: PropTypes.array,
        currentHoverKey: PropTypes.any,
        expandedRowKeys: PropTypes.array,
        expandedRowRender: PropTypes.func,
        hoverKey: PropTypes.any,
        onHover: PropTypes.func,
        onRowClick: PropTypes.func,
        record: PropTypes.object,
        rowClassName: PropTypes.func
    };

    static defaultProps = {
        columns: [],
        expandedRowKeys: [],
        expandedRowRender: () => {},
        onHover: () => {},
        onRowClick: () => {},
        record: {},
        rowClassName: () => {
            return '';
        }
    };

    actions = {
        handleRowClick: (e) => {
            const { onRowClick, record, hoverKey } = this.props;
            onRowClick(record, hoverKey, e);
        },
        handleRowMouseLeave: () => {
            const { hoverKey, onHover } = this.props;
            onHover(false, hoverKey);
        },
        handleRowMouseOver: () => {
            const { hoverKey, onHover } = this.props;
            onHover(true, hoverKey);
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidMount() {
        const { handleRowMouseOver, handleRowMouseLeave } = this.actions;
        this.row.addEventListener('mouseenter', handleRowMouseOver);
        this.row.addEventListener('mouseleave', handleRowMouseLeave);
    }

    componentWillUnmount() {
        const { handleRowMouseOver, handleRowMouseLeave } = this.actions;
        this.row.removeEventListener('mouseenter', handleRowMouseOver);
        this.row.addEventListener('mouseleave', handleRowMouseLeave);
    }

    isRowExpanded (record, key) {
        const rows = this.props.expandedRowKeys.filter((i) => {
            return i === key;
        });
        return rows[0];
    }

    render() {
        const {
            columns,
            currentHoverKey,
            expandedRowRender,
            hoverKey,
            record,
            rowClassName
        } = this.props;
        const { handleRowClick } = this.actions;
        const className = rowClassName(record, hoverKey);
        const isRowExpanded = this.isRowExpanded(record, hoverKey);
        let expandedRowContent;
        if (expandedRowRender && isRowExpanded) {
            expandedRowContent = expandedRowRender(record, hoverKey);
        }
        return (
            <div
                className={classNames(
                    styles.tr,
                    className,
                    { [styles['tr-hover']]: (currentHoverKey === hoverKey) }
                )}
                ref={node => {
                    this.row = node;
                }}
                onClick={handleRowClick}
            >
                {
                    columns.map((column, i) => {
                        return <TableCell key={`${hoverKey}_${i}`} column={column} record={record} />;
                    })
                }
                { isRowExpanded &&
                    <section className={styles['tr-expand']}>
                        { expandedRowContent }
                    </section>
                }
            </div>
        );
    }
}
