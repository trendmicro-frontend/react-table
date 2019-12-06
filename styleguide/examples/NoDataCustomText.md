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

<TableTemplate
    columns={columns}
    emptyText="No data to display"
    width={800}
/>
```