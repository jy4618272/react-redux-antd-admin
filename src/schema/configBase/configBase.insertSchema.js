// 定义某个表渲染时的配置
// 如果不需要个性化, 可以不要这个文件, 所有配置项都会使用默认值
// 注意! config/dataSchema/querySchema文件的命名应该遵循CamelCase原则, 不要包含下划线/中划线

module.exports = [
    {
        key: 'site',
        title: '所属基地',
        dataType: 'varchar',
        placeholder: '请输入所属基地',
        disabled: true
    },
    {
        key: 'companytitle',
        title: '公司抬头',
        dataType: 'varchar',
        placeholder: '请输入公司抬头',
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入公司抬头' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'bankname',
        title: '开户行',
        dataType: 'varchar',
        placeholder: '请输入开户行',
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入开户行' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'bankaccount',
        title: '银行账户 ',
        dataType: 'varchar',
        placeholder: '请输入银行账户 ',
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入银行账户 ' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'siteaddress',
        title: '基地地址',
        dataType: 'varchar',
        placeholder: '请输入基地地址',
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入基地地址' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'sitephone',
        title: '基地电话',
        dataType: 'int',
        placeholder: '请输入基地电话',
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入基地电话' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'sitepostcode',
        title: '邮编',
        dataType: 'varchar',
        placeholder: '请输入邮编',
        validate: [
            {
                rules: [
                    { required: true, type: 'string', message: '请输入邮编' },
                ],
                trigger: ['onBlur', 'onChange']
            }
        ]
    },
    {
        key: 'sitefax',
        title: '传真',
        dataType: 'varchar',
        placeholder: '请输入传真'
    },
    {
        key: 'remark',
        title: '备注',
        dataType: 'varchar',
        placeholder: '请输入备注'
    }
]