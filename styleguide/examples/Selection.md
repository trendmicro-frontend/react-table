```jsx
initialState = {
    selectedIdList: []
};

const data = [];
for (let i = 1; i <= 1000; i++) {
    data.push({
        id: i,
        eventType: `Virus/Malware_${i}`,
        affectedDevices: 20 + i,
        detections: 10 + i
    });
}

const handleClickRow = (record, index, e) => {
    const { selectedIdList } = state;
    const isIdInSelectedList = _includes(selectedIdList, record.id);
    const newSelectedList = isIdInSelectedList
        ? _filter(selectedIdList, id => id !== record.id)
        : _concat(selectedIdList, record.id);

    setState({ selectedIdList: newSelectedList });
};

const handleRowClassName = (record, key) => {
    const { selectedIdList } = state;
    const checked = _includes(selectedIdList, record.id);
    if (checked) {
        return 'tr-active';
    } else {
        return null;
    }
};

const handleHeaderCheckbox = (e) => {
    const { checked, indeterminate } = e.target;
    const selectAll = (!checked && indeterminate) || checked;
    const selectedIdList = selectAll ? data.map(item => item.id) : [];
    setState({ selectedIdList: selectedIdList });
};

const handleRowCheckbox = (e) => {
    return false;
};

const renderHeaderCheckbox = () => {
    const { selectedIdList } = state;
    const dataLength = ensureArray(data).length;
    const selectedLength = selectedIdList.length;
    const isSelectedAll = selectedLength > 0 && selectedLength === dataLength;
    const isChecked = (selectedLength > 0 && selectedLength < dataLength) || isSelectedAll;
    const isIndeterminate = selectedLength > 0 && selectedLength < dataLength;
    return (
        <Checkbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            onClick={handleHeaderCheckbox}
        />
    );
};

const renderCheckbox = (value, row) => {
    const checked = _includes(state.selectedIdList, row.id);
    return (
        <Checkbox
            checked={checked}
            onClick={handleRowCheckbox}
        />
    );
};

const columns = [
    { title: renderHeaderCheckbox, dataKey: 'id', render: renderCheckbox, width: 38 },
    { title: 'Event Type', dataKey: 'eventType' },
    { title: 'Affected Devices', dataKey: 'affectedDevices' },
    { title: 'Detections', dataKey: 'detections' }
];

<FormGroup>
    <Table
        useFixedHeader
        rowKey="id"
        columns={columns}
        data={data}
        rowClassName={handleRowClassName}
        onRowClick={handleClickRow}
        selectedRowKeys={state.selectedIdList}
        height={400}
        width={800}
    />
</FormGroup>
```