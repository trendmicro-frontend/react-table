```jsx
initialState = {
    sortColumnKey: 'eventType',
    sortOrder: 'asc'
};

const columns = [
    {
        sortable: true,
        titleText: 'Event Type',
        sortKey: 'eventType',
        render: (value, row) => {
            return (<Anchor>{row.eventType}</Anchor>);
        }
    },
    {
        sortable: true,
        titleText: 'Affected Devices',
        dataKey: 'affectedDevices',
        sortKey: 'affectedDevices'
    },
    {
        sortable: true,
        titleText: 'Detections',
        dataKey: 'detections',
        sortKey: 'detections'
    }
];

const data = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
];

const toggleSortOrder = (column) => (event) => {
    event.stopPropagation();
    event.preventDefault();
    const sortColumnKey = column.sortKey;
    const sortOrder = (state.sortOrder === 'desc') ? 'asc' : 'desc';
    setState({ sortColumnKey, sortOrder });
};

const renderSortableTableHeader = (column) => {
    const { sortColumnKey, sortOrder } = state;
    const isSortingKey = (column.sortKey === sortColumnKey);
    const nextSortOrder = sortOrder === 'desc' ? '↑' : '↓';
    return (
        <div
            style={{ display: 'flex' }}
            onClick={toggleSortOrder(column)}
        >
            <div style={{ flex: 'auto' }}>
                { column.titleText }
            </div>
            {
                isSortingKey &&
                <div>{ nextSortOrder }</div>
            }
        </div>
    );
};

const sortableColumns = columns.map((column, index) => {
    if (column.sortable) {
        return {
            ...column,
            title: renderSortableTableHeader
        };
    }
    return column;
});

const sortableData = _orderBy(data, [state.sortColumnKey], [state.sortOrder]);

<TableTemplate
    columns={sortableColumns}
    data={sortableData}
    width={800}
/>
```