```jsx
initialState = {
    expandedRowKeys: []
};

const subData = [];
for (let i = 1; i <= 5; i++) {
    subData.push({
        id: i,
        app: `chrome_${i}`,
        vendor: `google_${i}`
    });
}

const subColumns = [
    { title: 'Application Name', dataKey: 'app' },
    { title: 'Vendor Name', dataKey: 'vendor' }
];

const handleExpandedRowRender = (record, key) => {
    return (
        <div style={{ padding: '16px' }}>
            <div>Sub content</div>
            <Table
                columns={subColumns}
                data={subData}
                height={150}
                width={300}
            />
        </div>
    );
};

const handleToggleDetails = (record) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    setState(state => {
        const rowIndex = state.expandedRowKeys.indexOf(record.id);
        const expanded = (rowIndex >= 0);
        let data = [];
        // Only display one detail view at one time
        if (expanded) {
            data = [];
        } else {
            data = [record.id];
        }

        return {
            expandedRowKeys: data
        };
    });
};

const handleRenderActionColumn = (text, record) => {
    const { expandedRowKeys } = state;
    const expanded = (expandedRowKeys.indexOf(record.id) >= 0);
    let className = 'expand-icon';
    if (expanded) {
        className += ' ' + 'row-expanded';
    } else {
        className += ' ' + 'row-collapsed';
    }
    return (
        <Anchor onClick={handleToggleDetails(record)}>
            <i className={className} />
        </Anchor>
    );
};

const columns = [
    { dataKey: 'id', render: handleRenderActionColumn, width: 40 },
    { title: 'Event Type', dataKey: 'eventType', width: 150 },
    { title: 'Affected Devices', dataKey: 'affectedDevices' },
    { title: 'Detections', dataKey: 'detections' }
];

const data = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 30, detections: 111 },
    { id: 7, eventType: 'Predictive Machine Learning', affectedDevices: 40, detections: 0 },
    { id: 8, eventType: 'Behavior Monitoring', affectedDevices: 22, detections: 333 },
    { id: 9, eventType: 'Device Ontrol', affectedDevices: 9, detections: 555 },
    { id: 10, eventType: 'Ransomware Summary', affectedDevices: 0, detections: 66 },
    { id: 11, eventType: 'Agent Status', affectedDevices: 2, detections: 789 },
    { id: 12, eventType: 'Security Risk Detections Over Time', affectedDevices: 66, detections: 34 },
    { id: 13, eventType: 'Action Center', affectedDevices: 32, detections: 2234 },
    { id: 14, eventType: 'License Status', affectedDevices: 8, detections: 34325 },
    { id: 15, eventType: 'Component Status', affectedDevices: 12, detections: 46465 },
    { id: 16, eventType: 'Outbreak Defense', affectedDevices: 12, detections: 123 },
    { id: 17, eventType: 'Test long long long long long long long long long long long long long long long content', affectedDevices: 11, detections: 345 },
    { id: 18, eventType: 'Computer Status', affectedDevices: 90, detections: 466 },
    { id: 19, eventType: 'Mobile Devices', affectedDevices: 100, detections: 234 },
    { id: 20, eventType: 'Desktops', affectedDevices: 102, detections: 477 },
    { id: 21, eventType: 'Servers', affectedDevices: 33, detections: 235 }
];

<FormGroup>
    <Table
        hoverable
        useFixedHeader
        rowKey="id"
        columns={columns}
        data={data}
        expandedRowRender={handleExpandedRowRender}
        expandedRowKeys={state.expandedRowKeys}
        height={320}
        width={500}
    />
</FormGroup>
```