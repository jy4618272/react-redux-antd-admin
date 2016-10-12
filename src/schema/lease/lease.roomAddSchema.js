// 定义某个表的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = {
    form: [
        {
            key: 'type',  // 传递给后端的字段名
            title: '区域',  // 前端显示的名称

            // 数据类型, 前端会根据数据类型展示不同的输入框
            // 目前可用的dataType: int/float/varchar/datetime
            dataType: 'varchar',

            // 显示类型, 一些可枚举的字段, 比如type, 可以被显示为单选框或下拉框
            // 默认显示类型是normal, 就是一个普通的输入框, 这时可以省略showType字段
            // 目前可用的showType: normal/select/radio/between
            // select和radio只能用于int和varchar
            // between只能用于int/float/datetime, 会显示2个输入框, 用于范围查询
            showType: 'select',
            options: [],
            placeholder: '请选择区域'
        },
        {
            key: 'build',
            title: '楼号',
            dataType: 'varchar',
            showType: 'select',
            options: [],
            placeholder: '请选择楼号'
        },
        {
            key: 'room',
            title: '房间号',
            dataType: 'varchar',
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
            dataType: 'varchar',
            showType: 'full',
            placeholder: '备注'
        }
    ]
}
