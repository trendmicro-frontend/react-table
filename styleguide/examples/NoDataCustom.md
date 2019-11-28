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
    emptyRender={() => (
        <div
            style={{
                textAlign: 'center',
                fontSize: 24,
                margin: 50
            }}
        >
            ~ No data to display ~
        </div>
    )}
    width={800}
/>
```