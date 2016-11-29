module.exports = {
    contract: [
        {
            key: 'flowtype',
            title: '流程类型',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '作废', value: '作废' },
                { key: '新增', value: '新增' },
                { key: '续租', value: '续租' },
                { key: '退租', value: '退租' },
                { key: '变更', value: '变更' }

            ],
            placeholder: "请选择流程类型"
        },
        {
            key: 'flowstatus',
            title: '流程状态',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '草稿', value: '草稿' },
                { key: '审批中', value: '审批中' },
                { key: '审批通过', value: '审批通过' },
                { key: '审批退回', value: '审批退回' }
            ],
            placeholder: "请选择流程状态"
        },
        {
            key: 'fistatus',
            title: '财务状态',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '未提交', value: '未提交' },
                { key: '待财务确认', value: '待财务确认' },
                { key: '有效', value: '有效' },
                { key: '已退', value: '已退' }
            ],
            placeholder: "请选择业余状态"
        },
        {
            key: 'keyword',
            title: '关键字',
            dataType: 'varchar',
            placeholder: "请输入客户名称"
        }
    ],
    bond: [
        {
            key: 'businessnumber',
            title: '交款单号',
            showType: 'varchar',
            placeholder: "请输入交款单号"
        },
        {
            key: 'flowtype',
            title: '流程类型',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '作废', value: '作废' },
                { key: '新增', value: '新增' },
                { key: '退款', value: '退款' }
            ],
            placeholder: "请选择流程类型"
        },
        {
            key: 'flowstatus',
            title: '流程状态',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '草稿', value: '草稿' },
                { key: '审批中', value: '审批中' },
                { key: '审批通过', value: '审批通过' },
                { key: '审批退回', value: '审批退回' }
            ],
            placeholder: "请选择流程状态"
        },
        {
            key: 'fistatus',
            title: '财务状态',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '未提交', value: '未提交' },
                { key: '待确认', value: '待确认' },
                { key: '有效', value: '有效' },
                { key: '已冲抵', value: '已冲抵' },
                { key: '已退', value: '已退' }
            ],
            placeholder: "请选择财务状态"
        },
        {
            key: 'organization',
            title: '客户名称',
            dataType: 'varchar',
            placeholder: "请输入客户名称"
        }
    ],
    notContract: [
        {
            key: 'status',
            title: '状态',
            showType: 'select',
            options: [
                { key: '', value: '全部' },
                { key: '作废', value: '作废' },
                { key: '未提交', value: '未提交' },
                { key: '已提交', value: '已提交' },
                { key: '已到账', value: '已到账' },
            ],
            placeholder: "请选择状态"
        }
    ]
}