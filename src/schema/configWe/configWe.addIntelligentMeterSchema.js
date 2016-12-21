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
        key: '2',
        title: '品牌选择',
        modalType: true,
        showType: 'select',
        options: [
            { key: '大华', value: '大华' },
            { key: '德力西', value: '德力西' },
            { key: '广发伟业', value: '广发伟业' }
        ],
        placeholder: '请选择品牌选择',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请选择品牌选择' }
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
        title: '一级阀值/度',
        modalType: true,        
        dataType: 'int',
        placeholder: '请输入一级阀值/度',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入一级阀值/度' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: '6',
        title: '二级阀值/度',
        modalType: true,        
        dataType: 'int',
        placeholder: '请输入二级阀值/度',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入二级阀值/度' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: '7',
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
        key: '8',
        title: '',
        memo:'开启余量不足通知，每小时判断是否低于阀值。',
        modalType: true,      
        showType: 'checkboxChoose'
    }
]