module.exports = {
    contractFrom: [
        {
            key: 'modelname',
            title: '合同模板',
            showType: 'select',
            options: [],
            placeholder: "请选择合同模板",
            disabled: true
        },
        {
            key: 'pactkind',
            title: '合同类型',
            dataType: 'varchar',
            placeholder: '请选择模板类型',
            disabled: true
        }
    ],
    organization: [
        {
            key: 'organization',  // 传递给后端的字段名
            title: '客户名称',  // 前端显示的名称
            dataType: 'varchar',
            placeholder: "请输入客户名称",
            disabled: true
        },
        {
            key: 'businessscope',
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
            key: 'tel',
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
                dataIndex: 'roomarea',
                key: 'roomarea'
            },
            {
                title: '金额',
                dataIndex: 'money',
                key: 'money'
            }
        ]
    },
    line: {
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
                title: '优惠范围',
                dataIndex: 'promotionbody',
                key: 'promotionbody'
            }
        ]
    },
    contractBond: {
        columns: [
            {
                title: '履约保证金金额',
                dataIndex: 'marginmoney',
                key: 'marginmoney'
            }
        ]
    },
    attachment: {
        columns: [
            {
                title: '文件名称',
                dataIndex: 'filename',
                key: 'filename'
            }
        ]
    },
    contractTabs: [
        {
            key: 'pactcode',
            title: '合同号',
            dataType: 'varchar',
            placeholder: "请输入合同号",
            disabled: true
        },
        {
            key: 'signdate',
            title: '合同签订时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            disabled: true
        },
        {
            key: 'startdate',
            title: '合同开始时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            disabled: true
        },
        {
            key: 'enddate',
            title: '合同结束时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            disabled: true
        },
        {
            key: 'roomlist',
            title: '合同房间',
            dataType: 'varchar',
            placeholder: "请选择合同房间",
            disabled: true
        },
        {
            key: 'roommoney',
            title: '房间租金',
            dataType: 'int',
            placeholder: "请选择合同房间",
            disabled: true
        },
        {
            key: 'linelist',
            title: '合同班线',
            dataType: 'varchar',
            placeholder: "请选择合同班线",
            disabled: true
        },
        {
            key: 'linemoney',
            title: '班线费用',
            dataType: 'float',
            placeholder: "请选择合同班线",
            disabled: true
        },
        {
            key: 'standardmoney',
            title: '合同标准金额',
            dataType: 'float',
            placeholder: "请选择合同房间和合同班线",
            disabled: true
        },
        {
            key: 'money',
            title: '合同金额',
            dataType: 'float',
            placeholder: "请选择合同房间、合同班线、合同优惠冲抵和履约保证金",
            disabled: true
        },
        {
            key: 'marginmoney',
            title: '履约保证金',
            dataType: 'float',
            disabled: true,
            placeholder: "请选择履约保证金"
        },
        {
            key: 'marginmoneyoffset',
            title: '履约保证金冲抵',
            dataType: 'varchar',
            placeholder: "请选择履约保证金冲抵",
            disabled: true
        },
        {
            key: 'freestartdate',
            keyEnd: 'freeenddate',
            title: '优惠租期',
            dataType: 'datetime',
            showType: 'between',
            disabled: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholderBegin: '租期开始',
            placeholderEnd: '租期结束'
        },
        {
            key: 'promotionmoneyoffset',
            title: '优惠金额',
            dataType: 'float',
            placeholder: "请输入优惠金额",
            disabled: true
        },
        {
            key: 'totaloffsetmoney',
            title: '冲抵总额',
            dataType: 'varchar',
            placeholder: "请输入冲抵总额",
            disabled: true
        },
        {
            key: 'saler',
            title: '客户经理',
            showType: 'select',
            disabled: true,
            placeholder: "请选择客户经理",
            options: []
        },
        {
            key: 'manager',
            title: '委托代理人',
            dataType: 'varchar',
            disabled: true,
            placeholder: "请输入委托代理人"
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            disabled: true,
            placeholder: "请输入备注"
        }
    ],
    stages: {
        form: [
            {
                key: 'totalstages',
                title: '分期付款',
                showType: 'select',
                options: [],
                placeholder: "请选择分期数",
                disabled: true
            },
        ],
        columns: [
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
        showColumns: [
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
    }
}