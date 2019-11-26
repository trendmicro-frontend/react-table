```jsx
const columns = [
    {
        title: 'Event Type',
        dataKey: 'eventType'
    },
    {
        title: 'Affected Devices',
        dataKey: 'affectedDevices',
    },
    {
        title: 'Detections',
        dataKey: 'detections',
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

const renderLoader = () => (
    <div
        style={{
            backgroundColor: 'rgba(255, 255, 255, .8)',
            cursor: 'wait',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <Text size={16} color="darkcyan">Loading....</Text>
    </div>
);

<Table
    loading
    loaderRender={renderLoader}
    columns={columns}
    data={data}
    width={800}
/>
```