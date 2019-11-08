```jsx
initialState = {
    pagination: {
        page: 1,
        pageLength: 10
    }
};

const columns = [
    { title: 'Event Type', dataKey: 'eventType' },
    { title: 'Affected Devices', dataKey: 'affectedDevices' },
    { title: 'Detections', dataKey: 'detections' }
];

const data = [
    { id: 1, eventType: 'Virus/Malware', affectedDevices: 20, detections: 634 },
    { id: 2, eventType: 'Spyware/Grayware', affectedDevices: 20, detections: 634 },
    { id: 3, eventType: 'URL Filtering', affectedDevices: 15, detections: 598 },
    { id: 4, eventType: 'Web Reputation', affectedDevices: 15, detections: 598 },
    { id: 5, eventType: 'Network Virus', affectedDevices: 15, detections: 497 },
    { id: 6, eventType: 'Application Control', affectedDevices: 0, detections: 0 }
];

const fetchRecords = ({ page, pageLength }) => {
    // fetching data
};

<FormGroup>
    <div
        style={{
            position: 'relative',
            backgroundColor: '#f8f8f8',
            border: '1px solid #ddd',
            borderBottom: 'none',
            padding: '8px 16px',
            width: 602,
            boxSizing: 'border-box'
        }}
    >
        <Button btnStyle="flat">
            Export
        </Button>
        <TablePagination
            style={{
                position: 'absolute',
                right: 0,
                top: 0
            }}
            page={state.page}
            pageLength={state.pageLength}
            totalRecords={data.length}
            onPageChange={fetchRecords}
        />
    </div>
    <Table
        bordered
        hoverable
        rowKey="id"
        columns={columns}
        data={data}
        width={600}
        height={180}
    />
</FormGroup>
```
