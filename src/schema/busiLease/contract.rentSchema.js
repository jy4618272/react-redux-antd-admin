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
            key: 'room',
            title: '房间号',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'rea',
            title: '退租原因',
            dataType: 'varchar',
            showType: 'select',
            options: [
                { key: '利润薄', value: '利润薄' },
                { key: '主动节约', value: '主动节约' },
                { key: '期满解约', value: '期满解约' },
                { key: '其他', value: '其他' }
            ]
        },
        {
            key: 'reason',
            title: '具体原因',
            dataType: 'varchar',
            showType: 'two',
            placeholder: '请输入具体原因'
        }
    ],
    tableColumns:[
        {
            key:'1',
            dataIndex:'1',
            title:'费用名称'
        },
        {
            key:'2',
            dataIndex:'2',
            title:'金额'
        },
        {
            key:'3',
            dataIndex:'3',
            title:'确认人'
        }
    ]
}