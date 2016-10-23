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
        key: '1',
        title: '公司抬头',
        dataType: 'varchar',
        placeholder: '请输入公司抬头'
    },
    {
        key: '2',
        title: '开户行',
        dataType: 'varchar',
        placeholder: '请输入开户行'
    },
    {
        key: '4',
        title: '基地地址',
        dataType: 'varchar',
        placeholder: '请输入基地地址'
    },
    {
        key: '5',
        title: '基地电话',
        dataType: 'varchar',
        placeholder: '请输入基地电话'
    },
    {
        key: '6',
        title: '邮编',
        dataType: 'varchar',
        placeholder: '请输入邮编'
    },
    {
        key: '7',
        title: '传真',
        dataType: 'varchar',
        placeholder: '请输入传真'
    },
    {
        key: 'memo',
        title: '备注',
        showType:'two',
        dataType: 'varchar',
        placeholder: '请输入备注'
    }
]