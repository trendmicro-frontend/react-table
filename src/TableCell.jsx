import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.styl';

const TableCell = ({
    children,
    width,
}) => {
    return (
        <div
            className={styles.td}
            style={{ width: width }}
        >
            { children }
        </div>
    );
};

TableCell.propTypes = {
    width: PropTypes.number.isRequired,
};

export default TableCell;
