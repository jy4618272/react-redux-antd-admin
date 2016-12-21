// 定义【水电配置-人工抄表】表的addSchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: '1',
        title: '类型',
        modalType: true,
        showType: 'select',
        options: [
            { key: '水', value: '水' },
            { key: '电', value: '电' }
        ],
        placeholder: '请选择类型',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请选择类型' }
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: '3',
        title: '表名称',
        modalType: true, 
        dataType: 'varchar',
        placeholder: '请输入表名称',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入表名称' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: '4',
        title: '设备编号',
        modalType: true,        
        dataType: 'varchar',
        placeholder: '请输入设备编号',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入设备编号' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: '5',
        title: '计费类型',
        modalType: true,        
        dataType: 'int',
        placeholder: '请输入计费类型',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入计费类型' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: '6',
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
        key: '7',
        title: '初始读数',
        modalType: true,        
        dataType: 'float',
        placeholder: '请输入初始读数',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入初始读数' }
                ],
                trigger: ['onChange']
            }
        ]
    }
]