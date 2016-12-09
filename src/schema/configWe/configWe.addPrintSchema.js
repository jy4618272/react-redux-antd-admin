// 定义【水电配置-单价倍率配置】表的addSchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'checkdate',
        title: '核算年月',
        modalType: true,
        dataType: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
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
    },
    {
        key: 'readingdate',
        title: '水表抄表日期',
        modalType: true, 
        dataType: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择水表抄表日期',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'object', message: '请选择水表抄表日期' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'readingdate1',
        title: '电表抄表日期',
        modalType: true,        
        dataType: 'datetime',
        format:'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择电表抄表日期',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'object', message: '请选择电表抄表日期' }
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'memo',
        title: '交款单备注',
        modalType: true,    
        showType: 'full',    
        dataType: 'varchar',
        placeholder: '请输入交款单备注',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入交款单备注' }
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    }
]