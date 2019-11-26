
import React from 'react';
import styles from './index.styl';

const TableBody = ({
    children,
    style,
}) => {
    return (
        <div
            className={styles.tbody}
            style={style}
        >
            { children }
        </div>
    );
};

export default TableBody;
