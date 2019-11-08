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
        width={800}
    />
</FormGroup>
```