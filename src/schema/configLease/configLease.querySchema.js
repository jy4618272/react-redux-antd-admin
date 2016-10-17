// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    classLine: [
        {
            key: 'linename',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入班线名称/班线价格'
        }
    ],
    policy: [
        {
            key: 'area',
            title: '区域',
            dataType: 'varchar',
            showType: 'select',
            options: JSON.parse(sessionStorage.getItem('areaBySite')),
            placeholder: '请输入区域'
        },
        {
            key: 'promotionname',
            title: '活动名称',
            dataType: 'varchar',
            showType:'two',
            placeholder: '请输入活动名称'
        },
        {
            key: 'promotiontype',
            title: '优惠类型',
            dataType: 'varchar',
            showType: 'select',
            options: [
                { key: '减免', value: '减免' },
                { key: '折扣', value: '折扣' }
            ],
            placeholder: '请输入优惠类型'
        }
    ],
    accountManager: [
        {
            key: 'username',
            title: '姓名',
            dataType: 'varchar',
            placeholder: '请输入姓名'
        },
        {
            key: 'jobcard',
            title: '工号',
            dataType: 'varchar',
            placeholder: '请输入工号'
        }
    ],
    contractTpl: [
        {
            key: 'name',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入模版名称'
        }
    ],
    auditPerson: [
        {
            key: 'name',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入流程名称'
        }
    ]
}
