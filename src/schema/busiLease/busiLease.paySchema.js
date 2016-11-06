// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    notConfirmed: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入合同号或客户名称或联系方式或房间号'
        },
        {
            key: 'status',
            title: '状态',
            dataType: 'varchar',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '未提交', value: '未提交' },
                { key: '已提交', value: '已提交' }
            ]
        },
        {
            key: 'plandate',
            title: '计划收款时间',
            dataType: 'varchar',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '30', value: '30' },
                { key: '60', value: '60' },
                { key: '90', value: '90' }
            ]
        }
    ],
    confirmed: [
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入合同号或客户名称或联系方式或房间号'
        }
    ]
}