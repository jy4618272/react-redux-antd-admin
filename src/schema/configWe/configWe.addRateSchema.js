// 定义【水电配置-单价倍率配置】表的addSchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'metertype',
        title: '类别',
        modalType: true,
        showType: 'select',
        options: [
            { key: '水表', value: '水表' },
            { key: '电表', value: '电表' }
        ],
        placeholder: '请选择类别',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请选择类别' }
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'meterprice',
        title: '单价',
        modalType: true, 
        dataType: 'float',
        placeholder: '请输入单价',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入单价' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'meterrate',
        title: '表倍率',
        modalType: true,        
        dataType: 'int',
        placeholder: '请输入表倍率',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入表倍率' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'chargetype',
        title: '计费类型',
        modalType: true,        
        dataType: 'varchar',
        placeholder: '请输入计费类型',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入计费类型' }
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    }
]