```jsx
const columns = [
    {
        title: 'Event Type',
        dataKey: 'eventType'
    },
    {
        title: 'Affected Devices',
        dataKey: 'affectedDevices'
    },
    {
        title: 'Detections',
        dataKey: 'detections'
    }
];

<Table
    columns={columns}
    data={[]}
    emptyRender={() => 'No data to display'}
    width={800}
/>
```