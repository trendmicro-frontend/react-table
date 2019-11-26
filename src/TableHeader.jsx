import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import styles from './index.styl';

class TableHeader extends Component {
    static propTypes = {
        scrollLeft: PropTypes.number,
        width: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.headerRef = createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { scrollLeft } = this.props;
        if (scrollLeft !== prevProps.scrollLeft) {
            this.headerRef.current.scrollLeft = scrollLeft;
        }
    }

    render() {
        const {
            children,
            style,
        } = this.props;

        return (
            <div
                className={styles.thead}
                ref={this.headerRef}
                style={style}
            >
                { children }
            </div>
        );
    }
}

export default TableHeader;
