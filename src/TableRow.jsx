import cx from 'classnames';
import React from 'react';
import styles from './index.styl';

const TableRow = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            {...props}
            className={cx(
                styles.tr,
                className,
            )}
        >
            { children }
        </div>
    );
};

export default TableRow;
