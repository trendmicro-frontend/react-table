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
    emptyRender={() => (
        <div
            style={{
                textAlign: 'center',
                fontSize: 24,
                padding: 50,
                borderLeft: '1px solid #ddd',
                borderRight: '1px solid #ddd',
            }}
        >
            ~ No data to display ~
        </div>
    )}
    width={800}
/>
```