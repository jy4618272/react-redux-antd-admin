module.exports = [
    {
        key: 'site',
        title: '所属公路港',
        dataType: 'varchar',
        placeholder: '请输入所属公路港',
        disabled: true
    },
    {
        key: 'businessnumber',
        title: '交款单号',
        dataType: 'varchar',
        placeholder: "请输入交款单号",
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入交款单号' },
                ]
            }
        ]
    },
    {
        key: 'organization',
        title: '客户名称',
        dataType: 'varchar',
        placeholder: '请输入客户名称',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入客户名称' },
                ]
            }
        ]
    },
    {
        key: '3',
        title: '房间',
        dataType: 'varchar',
        placeholder: '请输入房间',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入房间' },
                ]
            }
        ]
    },
    {
        key: '4',
        title: '金额',
        dataType: 'float',
        placeholder: '请输入金额',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请输入金额' },
                ]
            }
        ]
    },
    {
        key: 'memo',
        title: '备注',
        dataType: 'varchar',
        placeholder: '请输入备注',
        showType: 'full'
    }
]