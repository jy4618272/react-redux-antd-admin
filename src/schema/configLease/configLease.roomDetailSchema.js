// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    form: [
        {
            key: 'type',  // 传递给后端的字段名
            title: '区域',  // 前端显示的名称
            dataType: 'varchar'
        },
        {
            key: 'build',
            title: '楼号',
            dataType: 'varchar'
        },
        {
            key: 'room',
            title: '房间号',
            dataType: 'varchar'
        },
        {
            key: 'roomarea',
            title: '面积',
            dataType: 'varchar'
        },
        {
            key: 'money',
            title: '金额',
            dataType: 'varchar'
        },
        {
            key: 'status',
            title: '状态',
            dataType: 'varchar'
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注'
        }
    ]
}
