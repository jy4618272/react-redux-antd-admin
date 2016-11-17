module.exports = [
    {
        key: 'site',
        title: '所属公路港',
        dataType: 'varchar',
        placeholder: "请输入所属公路港",
        disabled: true
    },
    {
        key: 'businessnumber',
        title: '交款单号',
        dataType: 'varchar',
        placeholder: "请输入交款单号",
        disabled: true
    },
    {
        key: 'organization',
        title: '客户名称',
        dataType: 'varchar',
        placeholder: "请输入客户名称",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, message: '请输入客户名称' },
                ],
                trigger: ['onChange']
            }
        ],
        readonly: true
    },
    {
        key: 'money',
        title: '金额/元',
        dataType: 'float',
        placeholder: "请输入金额",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '金额必须是数字' },
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'validdate',
        keyEnd: 'invaliddate',
        title: '生效日期',
        dataType: 'datetime',
        showType: 'between',
        placeholderBegin: "请选择生效日期",
        placeholderEnd: "请选择失效日期",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'object', message: '请选择日期' },
                ],
                trigger: ['onChange']
            }
        ]
    },
    {
        key: 'memo',
        title: '备注',
        dataType: 'varchar',
        placeholder: "请输入备注"
    }
]
