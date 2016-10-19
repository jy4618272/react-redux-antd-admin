// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    classLine: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入班线名称/班线价格'
        }
    ],
    policy: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入区域/活动名称/优惠类型'
        }
    ],
    accountManager: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入姓名/工号'
        }
    ],
    contractTpl: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入模版名称'
        }
    ],
    auditPerson: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入流程名称'
        }
    ]
}
