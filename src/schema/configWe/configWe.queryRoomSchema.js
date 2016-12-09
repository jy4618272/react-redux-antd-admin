// 定义【水电配置-单价倍率配置】表的addSchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'organization',
        title: '客户名称',
        dataType: 'varchar',
        placeholder: '请输入客户名称',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入客户名称' }
                ],
                trigger: ['onChange']
            }
        ]
    }
]