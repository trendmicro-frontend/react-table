import classNames from 'classnames';
import React from 'react';
import styles from './index.styl';

const TableToolbar = ({ className, ...props }) => {
    return (
        <div
            {...props}
            className={classNames(
                className,
                styles.tableToolbar
            )}
        />
    );
};

export default TableToolbar;
