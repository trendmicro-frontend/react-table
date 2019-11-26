```jsx
initialState = {
    data: [
        { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
        { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
        { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
        { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
        { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
        { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
    ]
};

const handleClickDelete = (row) => (e) => {
    const { data } = state;
    const index = data.findIndex(o => o.id === row.id);
    data.splice(index, 1);
    setState({ data });
};

const renderEventTypeCell = () => {
    const { data } = state;
    return `Event Type (${data.length})`;
};

const renderActionCell = (value, row) => {
    return (
        <button onClick={handleClickDelete(row)}>
            X
        </button>
    );
};

const columns = [
    { title: renderEventTypeCell, dataKey: 'eventType', width: '30%' },
    { title: 'Affected Devices', dataKey: 'affectedDevices' },
    { title: 'Detections', dataKey: 'detections' },
    { title: 'Delete', render: renderActionCell, width: 64 }
];

<Table
    bordered
    hoverable
    rowKey="id"
    columns={columns}
    data={state.data}
    width={500}
/>
```