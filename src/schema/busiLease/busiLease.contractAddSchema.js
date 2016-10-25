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
            key: '2',
            title: '经营范围',
            dataType: 'varchar',
            placeholder: '请输入经营范围',
            disabled: true
        },
        {
            key: '3',
            title: '身份证',
            dataType: 'varchar',
            placeholder: '请输入身份证',
            disabled: true
        },
        {
            key: '4',
            title: '身份证地址',
            dataType: 'varchar',
            placeholder: '请输入身份证地址',
            disabled: true
        },
        {
            key: '5',
            title: '联系电话',
            dataType: 'varchar',
            placeholder: '请输入联系电话',
            disabled: true
        },
        {
            key: '6',
            title: '公司法人',
            dataType: 'varchar',
            placeholder: '请输入公司法人',
            disabled: true
        },
        {
            key: '7',
            title: '开户银行',
            dataType: 'varchar',
            placeholder: '请输入开户银行',
            disabled: true
        },
        {
            key: '8',
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
            center: [],
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
            center: [],
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
            center: [],
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
            center: [],
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
            center: [],
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
    stages:{
        columns:[
             {
                title: '分期数',
                dataIndex: 'linename',
                key: 'linename'
            },
            {
                title: '交款日期',
                dataIndex: 'linefee',
                key: 'linefee'
            },
            {
                title: '失效日期',
                dataIndex: 'linename',
                key: 'linename'
            },
            {
                title: '交款金额',
                dataIndex: 'linefee',
                key: 'linefee'
            },
            {
                title: '备注',
                dataIndex: 'linename',
                key: 'linename'
            }
        ]
    }
}