module.exports = {
    form: [
        {
            key: 'organization',
            title: '客户名称',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'pactcode',
            title: '合同号',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'roomlist',
            title: '房间号',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'refundreason',
            title: '退租原因',
            dataType: 'varchar',
            disabled: true
        }
    ],
    tableColumns: [
        {
            key: 'itemname',
            dataIndex: 'itemname',
            title: '费用名称'
        },
        {
            key: 'money',
            dataIndex: 'money',
            title: '金额/元'
        },
        {
            key: 'sureman',
            dataIndex: 'sureman',
            title: '确认人'
        },
        {
            key: 'memo',
            dataIndex: 'memo',
            title: '备注'
        }
    ]
}