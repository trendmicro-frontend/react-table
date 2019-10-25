import React from 'react';

const context = React.createContext({
    currentHoverKey: null,
    scrollTop: 0,
    scrollLeft: 0,
    prevColumns: [],
    thisColumns: [],
    setCurrentHoverKey: () => {},
    setScrollLeft: () => {},
    setScrollTop: () => {},
});

export default context;
