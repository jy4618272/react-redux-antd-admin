// 定义【水电业务-智能表】的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'checkdate',
        title: '核算年月',
        dataType: 'monthtime',
        format: 'YYYY-MM',
        placeholder: '请选择核算年月'
    },
    {
        key: 'organization',
        title: '客户名称',
        dataType: 'varchar',
        placeholder: '请输入客户名称'
    },
    {
        key: 'metertype',
        title: '类型',
        showType: 'select',
        placeholder: '请选择类型',
        options: [
            { key: '水', value: '水' },
            { key: '电', value: '电' }
        ]
    },
    {
        key: 'status',
        title: '收款状态',
        showType: 'select',
        placeholder: '请选择收款状态',
        options: [
            { key: '确认收款', value: '确认收款' },
            { key: '未确认收款', value: '未确认收款' }
        ]
    }
]