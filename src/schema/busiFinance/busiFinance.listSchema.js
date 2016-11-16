// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'frominputdate',
        keyEnd: 'toinputdate',
        title: '生成日期',
        dataType: 'datetime',
        showType: 'between',
        format: 'YYYY-MM-DD'
    },
    {
        key: 'fromsubmitdate',
        keyEnd: 'tosubmitdate',
        title: '提交日期',
        dataType: 'datetime',
        showType: 'between',
        format: 'YYYY-MM-DD'
    },
    {
        key: 'status',
        title: '提交状态',
        dataType: 'varchar',
        showType: 'select',
        options: [
            { key: '', value: '全部' }
        ]
    }
]
