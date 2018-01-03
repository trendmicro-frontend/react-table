import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Bordered from './tables/Bordered';
import AutoFit from './tables/AutoFit';
import Justified from './tables/Justified';
import Displays from './tables/Displays';
import FixedColumns from './tables/FixedColumns';
import Pagination from './tables/Pagination';
import RowSelection from './tables/RowSelection';
import ExpandedRow from './tables/ExpandedRow';
import DynamicHeader from './tables/DynamicHeader';

const App = (props) => {
    const name = 'React Table';
    const url = 'https://github.com/trendmicro-frontend/react-table';

    return (
        <div>
            <Navbar name={name} url={url} />
            <div className="container-fluid" style={{ padding: '20px 20px 0' }}>
                <div className="row">
                    <Bordered />
                    <AutoFit />
                    <Justified />
                    <Displays />
                    <FixedColumns />
                    <Pagination />
                    <RowSelection />
                    <ExpandedRow />
                    <DynamicHeader />
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
