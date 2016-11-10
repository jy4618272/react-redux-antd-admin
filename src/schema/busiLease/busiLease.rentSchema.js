module.exports = {
    form: [
        {
            key: 'organization',
            title: '客户名称',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'pactcode',
            title: '合同号',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'roomlist',
            title: '房间号',
            dataType: 'varchar',
            disabled: true
        },
        {
            key: 'refundreason',
            title: '退租原因',
            dataType: 'varchar',
            showType: 'multiSelect',  // 另一种多选
            options: [
                { key: '利润薄', value: '利润薄' },
                { key: '主动节约', value: '主动节约' },
                { key: '期满解约', value: '期满解约' },
                { key: '其他', value: '其他' }
            ],
            // placeholder: "请选择退租原因",
            // feedBackShow: true,
            // validate: [
            //     {
            //         rules: [
            //             { required: true, type: 'string', message: '请选择退租原因' },
            //         ],
            //         trigger: ['onChange']
            //     }
            // ]
        }
    ],
    tableColumns: [
        {
            key: 'itemname',
            dataIndex: 'itemname',
            title: '费用名称'
        },
        {
            key: 'money',
            dataIndex: 'money',
            title: '金额'
        },
        {
            key: 'sureman',
            dataIndex: 'sureman',
            title: '确认人'
        },
        {
            key: 'memo',
            dataIndex: 'memo',
            title: '备注'
        }
    ],
    tableSchema: [
        {
            title: '费用名称',
            key: 'itemname',
            showType: 'select',
            options: [
                { key: '', value: '请选择' },
                { key: '物业费', value: '物业费' },
                { key: '物业服务费', value: '物业服务费' },
                { key: '物业管理费', value: '物业管理费' },
                { key: '经营管理费', value: '经营管理费' },
                { key: '班线费', value: '班线费' },
                { key: '仓位费', value: '仓位费' },
                { key: '其他费用', value: '其他费用' }
            ],
            placeholder: "请选择费用名称",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请选择费用名称' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: '金额',
            key: 'money',
            dataType: 'float',
            placeholder: "请填写金额",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'number', message: '请填写金额' },
                    ],
                    trigger: ['onChange']
                }
            ]
        },
        {
            title: '确认人',
            key: 'sureman',
            dataType: 'varchar',
            placeholder: "请输入确认人",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'string', message: '请输入确认人' },
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