// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    room: [
        {
            key: 'build',
            title: '房间物品',
            dataType: 'varchar',
            placeholder: '请填写房间物品'
        },
        {
            key: 'room',
            title: '房间号',
            dataType: 'varther',
            placeholder: '请输入房间号'
        },
        {
            key: 'roomarea',
            title: '面积',
            dataType: 'float',
            placeholder: '请输入面积'
        },
        {
            key: 'money',
            title: '金额',
            dataType: 'float',
            placeholder: '请输入金额'
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varther',
            showType: 'full',
            placeholder: '备注',
            feedBackShow: true,
            validate: [{
                rules: [
                    {message: '备注' },
                ],
                trigger: 'onChange',
            }]
        }
    ]
}
