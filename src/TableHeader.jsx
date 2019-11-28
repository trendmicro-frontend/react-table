import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './index.styl';

const TableHeader = React.forwardRef(({
    children,
    className,
    ...props
}, ref) => {
    return (
        <div
            {...props}
            ref={ref}
            className={cx(
                styles.thead,
                className,
            )}
        >
            { children }
        </div>
    );
});

TableHeader.propTypes = {
    width: PropTypes.number,
};

export default TableHeader;
