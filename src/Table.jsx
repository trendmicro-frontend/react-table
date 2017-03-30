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
        sortable: PropTypes.bool,
        fixedHeader: PropTypes.bool,
        height: PropTypes.number
    };
    static defaultProps = {
        ...Table.defaultProps,
        bordered: true,
        hoverable: true,
        loading: false,
        sortable: false,
        fixedHeader: false
    };

    table = null;

    state = this.getDefaultState();

    actions = {
        fixScrollHeadPosition: () => {
            const left = Math.max(this.scrollBodyContainer.scrollLeft, document.documentElement.scrollLeft);
            let scrollHeader = this.scrollHeaderContainer.getElementsByClassName('rc-table-content')[0];
            if (scrollHeader) {
                scrollHeader.scrollLeft = left;
            }
        },
        setScrollHeadWidth: () => {
            const { loading } = this.props;
            const tableContainer = this.scrollBodyContainer;
            const headerContainer = this.scrollHeaderContainer;
            if (!loading && headerContainer) {
                //Using the <col> tag manage table styling for all rows, please refer https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
                const tableHeader = tableContainer.getElementsByTagName('th');
                let scrollHeader = headerContainer.getElementsByTagName('col');
                for (let i = 0; i < tableHeader.length; i++) {
                    const th = tableHeader[i];
                    let scrollTh = scrollHeader[i];
                    if (scrollTh) {
                        let width = th.getBoundingClientRect().width.toFixed(2);
                        scrollTh.style.width = `${width}px`;
                    }
                }
                let lastTh = scrollHeader[scrollHeader.length - 1];
                if (tableContainer.scrollHeight > tableContainer.clientHeight) {
                    // Scrollbar is shown
                    const scrollbarWidth = tableContainer.offsetWidth - tableContainer.clientWidth;
                    lastTh.style.width = `${scrollbarWidth}px`;
                } else {
                    lastTh.style.width = '0';
                }
            }
        },
        setScrollBodyHeight: () => {
            const { fixedHeader, height } = this.props;
            const header = this.scrollBodyContainer.getElementsByTagName('thead')[0];
            let tableHeight = 0;
            let headerHeight = 0;
            if (fixedHeader && header) {
                headerHeight = parseInt(header.getBoundingClientRect().height.toFixed(0), 10);
            }
            if (height) {
                tableHeight = (height - headerHeight);
            }
            this.setState({
                tableHeight,
                headerHeight
            }, this.actions.setScrollHeadWidth);
        }
    };

    getDefaultState () {
        return {
            tableHeight: 0,
            headerHeight: 0
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    componentDidMount() {
        const { fixScrollHeadPosition, setScrollHeadWidth, setScrollBodyHeight } = this.actions;
        if (this.scrollHeaderContainer) {
            this.scrollBodyContainer.addEventListener('scroll', fixScrollHeadPosition);
            window.addEventListener('resize', setScrollHeadWidth);
        }
        setScrollBodyHeight();
    }
    componentWillUnmount() {
        const { fixScrollHeadPosition, setScrollHeadWidth } = this.actions;
        if (this.scrollHeaderContainer) {
            this.scrollBodyContainer.removeEventListener('scroll', fixScrollHeadPosition);
            window.removeEventListener('resize', setScrollHeadWidth);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { setScrollBodyHeight } = this.actions;
        setScrollBodyHeight();
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
    renderScrollHeader() {
        const {
            columns,
            bordered,
            sortable,
            className,
            title
        } = this.props;
        if (columns.length > 0) {
            let cloneColumns = this.renderColumns(columns);
            cloneColumns = cloneColumns.slice(0);
            cloneColumns.push({
                key: 'thScrollBar',
                title: '',
                className: styles.thScrollBar
            });
            return (
                <div
                    className={styles.scrollHeader}
                    ref={(node) => {
                        this.scrollHeaderContainer = node;
                    }}
                >
                    <Table
                        title={title}
                        columns={cloneColumns}
                        className={classNames(
                            className,
                            styles.table,
                            { [styles.tableBordered]: bordered },
                            { [styles.tableSortable]: sortable }
                        )}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
    renderTable() {
        const {
            columns,
            bordered,
            hoverable,
            loading,
            sortable,
            className,
            fixedHeader,
            height,
            ...props
        } = this.props;

        const {
            tableHeight,
            headerHeight
        } = this.state;

        let customStyles = {
            maxHeight: 'none',
            marginTop: 'auto'
        };

        if (fixedHeader) {
            delete props.title;
            delete props.footer;
        }

        if (tableHeight) {
            customStyles.maxHeight = `${tableHeight}px`;
        }

        if (headerHeight) {
            customStyles.marginTop = `${0 - headerHeight}px`;
        }

        // Set min-height to fix IE9 Hover Bug, please refer http://blog.brianrichards.net/post/6721471926/ie9-hover-bug-workaround
        return (
            <div
                style={{ minHeight: '0%', maxHeight: customStyles.maxHeight }}
                className={classNames(
                    styles.scrollBody,
                    { [styles.tableContainer]: loading },
                    { [styles.tableScrollable]: height }
                )}
                ref={(node) => {
                    this.scrollBodyContainer = node;
                }}
            >
                <Table
                    ref={node => {
                        if (!node) {
                            return;
                        }
                        this.table = node;
                    }}
                    {...props}
                    style={{ marginTop: customStyles.marginTop }}
                    columns={this.renderColumns(columns)}
                    className={classNames(
                        className,
                        styles.table,
                        { [styles.tableBordered]: bordered },
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
    renderFooter () {
        const { footer } = this.props;
        if (footer) {
            return (
                <div className={styles.scrollFooter}>
                    <Table footer={footer} />
                </div>
            );
        } else {
            return null;
        }
    }
    render() {
        const {
            bordered,
            fixedHeader,
            showHeader
        } = this.props;
        return (
            <div
                className={classNames(
                    styles.tableWrapper,
                    { [styles.tableMinimalism]: !bordered }
                )}
                ref={(node) => {
                    this.tableWrapper = node;
                }}
            >
                { showHeader && fixedHeader && this.renderScrollHeader() }
                { this.renderTable() }
                { showHeader && fixedHeader && this.renderFooter() }
            </div>
        );
    }
}
