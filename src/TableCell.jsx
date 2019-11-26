import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.styl';

const TableCell = ({
    children,
    className,
    style,
    width,
}) => {
    return (
        <div
            className={cx(
                styles.td,
                className,
            )}
            style={{
                width: width,
                ...style
            }}
        >
            { children }
        </div>
    );
};

TableCell.propTypes = {
    width: PropTypes.number.isRequired,
};

export default TableCell;
