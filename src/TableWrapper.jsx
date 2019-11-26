import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.styl';

const TableWrapper = ({
    children,
    bordered,
    height,
    hoverable,
    isNoData,
    style,
    width,
}) => {
    const tableHeight = !!height ? height : 'auto';
    const tableWidth = !!width ? width : 'auto';
    const tableClassName = cx(
        styles.table,
        { [styles.tableMinimalism]: !bordered },
        { [styles.tableBordered]: bordered },
        { [styles.tableNoData]: isNoData },
        { [styles.tableHover]: hoverable }
    );
    const tableStyle = {
        height: tableHeight,
        width: tableWidth,
        ...style
    };

    return (
        <div
            className={tableClassName}
            style={tableStyle}
        >
            { children }
        </div>
    );
};

TableWrapper.propTypes = {
    bordered: PropTypes.bool,
    height: PropTypes.number,
    hoverable: PropTypes.bool,
    isNoData: PropTypes.bool,
    width: PropTypes.number.isRequired,
};

export default TableWrapper;
