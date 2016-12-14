const formConfig = [
    {
        key: 'assetname',
        title: '资产名称',
        dataType: 'varchar',
        placeholder: '请输入资产名称'
    },
    {
        key: 'parameternumber',
        title: '台账编号',
        dataType: 'varchar',
        placeholder: '请输入台账编号'
    },
    {
        key: 'assettypename2',
        title: '资产分类',
        dataType: 'varchar',
        showType: 'select',
        options: [
            { key: '', value: '全部' },
            { key: '动产', value: '动产' },
            { key: '不动产', value: '不动产' },
            { key: '低值易耗品', value: '低值易耗品' }
        ]
    },
    {
        key: 'flowstatus',  // 传递给后端的字段名
        title: '流程状态',  // 前端显示的名称

        // 数据类型, 前端会根据数据类型展示不同的输入框
        // 目前可用的dataType: int/float/varchar/datetime
        dataType: 'varchar',

        // 显示类型, 一些可枚举的字段, 比如type, 可以被显示为单选框或下拉框
        // 默认显示类型是normal, 就是一个普通的输入框, 这时可以省略showType字段
        // 目前可用的showType: normal/select/radio/between
        // select和radio只能用于int和varchar
        // between只能用于int/float/datetime, 会显示2个输入框, 用于范围查询
        showType: 'select',
        options: [
            { key: '', value: '全部' },
            { key: '新增-待提交', value: '新增-待提交' },
            { key: '调拨-待提交', value: '调拨-待提交' },
            { key: '闲置-待提交', value: '闲置-待提交' },
            { key: '报废-待提交', value: '报废-待提交' },
            { key: '处置-待提交', value: '处置-待提交' },
            { key: '新增-审批中', value: '新增-审批中' },
            { key: '调拨-审批中', value: '调拨-审批中' },
            { key: '报废-审批中', value: '报废-审批中' },
            { key: '处置-审批中', value: '处置-审批中' },
            { key: '报废-审批中', value: '报废-审批中' },
            { key: '审批通过', value: '审批通过' },
            { key: '审批退回', value: '审批退回' }
        ]
    },
    {
        key: 'assetstatus',
        title: '资产状态',
        dataType: 'varchar',
        showType: 'select',
        options: [
            { key: '', value: '全部' },
            { key: '已归档', value: '已归档' },
            { key: '已闲置', value: '已闲置' },
            { key: '已报废', value: '已报废' },
            { key: '已处理', value: '已处理' },
            { key: '处理中', value: '处理中' }
        ]
    }
]

export default formConfig