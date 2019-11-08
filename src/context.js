import React from 'react';

const context = React.createContext({
    scrollLeft: 0,
    prevColumns: [],
    thisColumns: [],
    setScrollLeft: () => {},
});

export default context;
