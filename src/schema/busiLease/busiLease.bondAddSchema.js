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
        key: 'roomlist',
        title: '房间号',
        dataType: 'varchar',
        placeholderBegin: "请输入房间号"
    },
    {
        key: 'marginmoney',
        title: '金额/元',
        dataType: 'float',
        placeholder: "请输入金额",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required:true, type: 'number', message: '金额必须是数字' },
                ]
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
