// 定义【水电业务-手工抄表-提交财务】的querySchema
// schema的结构和含义参考下面的例子
// 注意: 所有的key不能重复

module.exports = [
    {
        key: 'checkdate',
        title: '核算年月',
        dataType: 'monthtime',
        format: 'YYYY-MM',
        placeholder: '请选择核算年月'
    },
    {
        key: 'organization',
        title: '客户名称',
        dataType: 'varchar',
        placeholder: '请输入客户名称'
    }
]