// 定义【水电业务-手工抄表-水电录入】的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    from: {
        query: [
            {
                key: 'checkdate',
                title: '核算年月',
                dataType: 'monthtime',
                format: 'YYYY-MM',
                placeholder: '请选择核算年月',
                feedBackShow: true,
                validate: [
                    {
                        rules: [
                            { required: true, type: 'object', message: '请选择核算年月' }
                        ],
                        trigger: ['onChange']
                    }
                ]
            }
        ],
        buttons:[
            {
                key: 'makeBill',
                type: 'default',
                icon:'bars',
                title: '生成账单'
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
            key: 'room',
            title: '房间',
            dataType: 'varchar',
            placeholder: '请输入'
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
        }
    ]
}

