module.exports = {
    tableColumns: [
        {
            title: '分期数',
            dataIndex: 'stagesnumber',
            key: 'stagesnumber'
        },
        {
            title: '交款日期',
            dataIndex: 'plandate',
            key: 'plandate'
        },
        {
            title: '生效日期',
            dataIndex: 'validdate',
            key: 'validdate'
        },
        {
            title: '失效日期',
            dataIndex: 'invaliddate',
            key: 'invaliddate'
        },
        {
            title: '交款金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableSchema: [
        {
            title: '交款日期',
            key: 'plandate',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            feedBackShow: true,
            help: "请选择交款日期",
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择交款日期' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            title: '生效日期',
            key: 'validdate',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            feedBackShow: true,
            help: "请选择生效日期",
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择生效日期' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            title: '失效日期',
            key: 'invaliddate',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            feedBackShow: true,
            help: "请选择失效日期",
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择失效日期' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            title: '交款金额',
            key: 'money',
            dataType: 'float',
            placeholder: "请填写交款金额",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', min: 1, message: '请填写交款金额' },
                    ]
                }
            ]
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableShowControl: {
        left: [
            {
                key: 'stagesShowInsert',
                title: '新增明细'
            },
            {
                key: 'stagesShowClose',
                title: '关闭明细'
            }
        ],
        center: [],
        right: []
    },
    tableShowColumns: [
        {
            title: '分期阶段',
            dataIndex: 'stagesnumber',
            key: 'stagesnumber'
        },
        {
            title: '交款类型',
            dataIndex: 'itemname',
            key: 'itemname'
        },
        {
            title: '交款金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableShowSchema: [
        {
            title: '交款类型',
            key: 'itemname',
            showType: 'select',
            options: [
                { key: '', value: '请选择' },
                { key: '房屋租金', value: '房屋租金' },
                { key: '履约保证金', value: '履约保证金' },
                { key: '班线费', value: '班线费' },
                { key: '违约金', value: '违约金' },
                { key: '管理费', value: '管理费' },
                { key: '仓位费', value: '仓位费' },
                { key: '业态费', value: '业态费' },
                { key: '履约保证金冲抵', value: '履约保证金冲抵' },
                { key: '优惠折扣', value: '优惠折扣' },
                { key: '优惠减免', value: '优惠减免' },
                { key: '经营管理费', value: '经营管理费' },
                { key: '物业管理费', value: '物业管理费' },
                { key: '其他费用', value: '其他费用' }
            ],
            placeholder: "请选择交款类型",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请选择交款类型' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: '交款金额',
            key: 'money',
            dataType: 'float',
            placeholder: "请填写交款金额",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请填写交款金额' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ]
}