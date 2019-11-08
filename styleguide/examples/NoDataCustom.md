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

<FormGroup>
    <Table
        columns={columns}
        data={[]}
        emptyText={() => 'No data to display'}
        width={800}
    />
</FormGroup>
```