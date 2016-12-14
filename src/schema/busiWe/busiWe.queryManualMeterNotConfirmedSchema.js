// 定义【水电业务-智能表】的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    from: {
        query: [
            {
                key: 'checkdate',
                title: '核算年月',
                dataType: 'datetime',
                format: 'YYYY-MM-DD',
                placeholder: '请选择核算年月'
            }
        ],
        buttons:[
            {
                key: 'makeMenu',
                type: 'default',
                icon:'bars',
                title: '生成菜单'
            }
        ]
    },
    query: [
        {
            key: 'organization',
            title: '客户名称',
            dataType: 'varchar',
            placeholder: '请输入客户名称'
        },
        {
            key: 'type',
            title: '类型',
            showType: 'select',
            placeholder: '请选择类型',
            options: [
                { key: '全部', value: '全部' },
                { key: '水', value: '水' },
                { key: '电', value: '电' }
            ]
        },
        {
            key: '3',
            title: '类型',
            showType: 'select',
            placeholder: '请选择类型',
            options: [
                { key: '水', value: '水' },
                { key: '电', value: '电' }
            ]
        }
    ]
}