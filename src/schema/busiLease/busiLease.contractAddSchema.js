module.exports = {
    organization: [
        {
            key: 'organization',  // 传递给后端的字段名
            title: '客户名称',  // 前端显示的名称
            dataType: 'varchar',
            placeholder: "请输入客户名称",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, message: '必填，请输入客户名称' },
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ],
            disabled: true
        },
        {
            key: 'operationrange',
            title: '经营范围',
            dataType: 'varchar',
            placeholder: '请输入经营范围',
            disabled: true
        },
        {
            key: 'idcard',
            title: '身份证',
            dataType: 'varchar',
            placeholder: '请输入身份证',
            disabled: true
        },
        {
            key: 'address',
            title: '身份证地址',
            dataType: 'varchar',
            placeholder: '请输入身份证地址',
            disabled: true
        },
        {
            key: 'telephone',
            title: '联系电话',
            dataType: 'varchar',
            placeholder: '请输入联系电话',
            disabled: true
        },
        {
            key: 'legalperson',
            title: '公司法人',
            dataType: 'varchar',
            placeholder: '请输入公司法人',
            disabled: true
        },
        {
            key: 'bankname',
            title: '开户银行',
            dataType: 'varchar',
            placeholder: '请输入开户银行',
            disabled: true
        },
        {
            key: 'bankaccount',
            title: '银行账号',
            dataType: 'varchar',
            placeholder: '请输入银行账号',
            disabled: true
        }
    ],
    room: {
        topButtons: {
            left: [
                {
                    key: 'addRoom',
                    title: '新增房间'
                }
            ],
            right: []
        },
        columns: [
            {
                title: '区域',
                dataIndex: 'area',
                key: 'area'
            },
            {
                title: '楼号',
                dataIndex: 'build',
                key: 'build'
            },
            {
                title: '房间号',
                dataIndex: 'room',
                key: 'room'
            },
            {
                title: '面积',
                dataIndex: 'romearea',
                key: 'romearea'
            },
            {
                title: '金额',
                dataIndex: 'money',
                key: 'money'
            },
            {
                title: '流程状态',
                dataIndex: 'status',
                key: 'status'
            }
        ]
    },
    line: {
        topButtons: {
            left: [
                {
                    key: 'addLine',
                    title: '新增班线'
                }
            ],
            right: []
        },
        columns: [
            {
                title: '班线名称',
                dataIndex: 'linename',
                key: 'linename'
            },
            {
                title: '班线价格',
                dataIndex: 'linefee',
                key: 'linefee'
            }
        ]
    },
    policy: {
        topButtons: {
            left: [
                {
                    key: 'addPolicy',
                    title: '新增优惠'
                }
            ],
            right: []
        },
        columns: [
            {
                title: '活动名称',
                dataIndex: 'promotionname',
                key: 'promotionname'
            },
            {
                title: '优惠类型',
                dataIndex: 'promotiontype',
                key: 'promotiontype'
            },
            {
                title: '优惠幅度',
                dataIndex: 'promotionnum',
                key: 'promotionnum'
            },
            {
                title: '范围',
                dataIndex: 'area',
                key: 'area'
            }
        ]
    },
    contractBond: {
        topButtons: {
            left: [
                {
                    key: 'addBond',
                    title: '新增保证金'
                }
            ],
            right: []
        },
        columns: [
            {
                title: '履约保证金金额',
                dataIndex: 'marginmoney',
                key: 'marginmoney'
            }
        ]
    },
    attachment: {
        topButtons: {
            left: [
                {
                    key: 'selectDoc',
                    title: '选择文件'
                }
            ],
            right: []
        },
        columns: [
            {
                title: '文件名称',
                dataIndex: 'filename',
                key: 'filename'
            }
        ]
    },
    stages: {
        form: [
            {
                key: 'totalstages',
                title: '分期付款',
                showType: 'select',
                options: [
                    { key: '1', value: '第1期' },
                    { key: '2', value: '第2期' },
                    { key: '3', value: '第3期' },
                    { key: '4', value: '第4期' },
                    { key: '5', value: '第5期' },
                    { key: '6', value: '第6期' },
                    { key: '7', value: '第7期' },
                    { key: '8', value: '第8期' },
                    { key: '9', value: '第9期' },
                    { key: '10', value: '第10期' },
                    { key: '11', value: '第11期' },
                    { key: '12', value: '第12期' },
                    { key: '13', value: '第13期' },
                    { key: '14', value: '第14期' },
                    { key: '15', value: '第15期' },
                    { key: '16', value: '第16期' },
                    { key: '17', value: '第17期' },
                    { key: '18', value: '第18期' },
                    { key: '19', value: '第19期' },
                    { key: '20', value: '第20期' },
                    { key: '21', value: '第21期' },
                    { key: '22', value: '第22期' },
                    { key: '23', value: '第23期' },
                    { key: '24', value: '第24期' },
                    { key: '25', value: '第25期' },
                    { key: '26', value: '第26期' },
                    { key: '27', value: '第27期' },
                    { key: '28', value: '第28期' },
                    { key: '29', value: '第29期' },
                    { key: '30', value: '第30期' },
                    { key: '31', value: '第31期' },
                    { key: '32', value: '第32期' },
                    { key: '33', value: '第33期' },
                    { key: '34', value: '第34期' },
                    { key: '35', value: '第35期' },
                    { key: '36', value: '第36期' },
                ],
                placeholder: "请选择分期数",
                feedBackShow: true,
                validate: [
                    {
                        rules: [
                            { required: true, type:'string', message: '请选择分期数' },
                        ],
                        trigger: ['onChange']
                    }
                ]
            },
        ],
        buttons: [
            {
                key: 'makeDefault',
                type: 'default',
                title: '生成默认明细'
            }
        ]
    }
}