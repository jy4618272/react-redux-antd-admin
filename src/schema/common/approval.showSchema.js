// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'nodestatus',
        title: '审核结果',
        dataType: 'varchar',
        showType: 'radio',
        styleType: 'full',
        initialValue: '同意',
        options: [
            { key: '同意', value: '同意' },
            { key: '不同意', value: '不同意' }
        ],
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type:'string', message:'请选择审核'}
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'nodecontent',
        title: '审核内容',
        dataType: 'textarea',
        placeholder: '请填写审核内容',
        showType: 'full'
    }
]