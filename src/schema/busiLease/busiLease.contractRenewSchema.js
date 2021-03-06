module.exports = {
    contractFrom: [
        {
            key: 'modelname',
            title: '合同模板',
            dataType: 'varchar',
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
            placeholder: '请输入经营范围'
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
                title: '面积/平方米',
                dataIndex: 'romearea',
                key: 'romearea'
            },
            {
                title: '金额/元',
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
    tabsData: [
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
            placeholder: "请选择合同签订时间",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择合同签订时间' },
                    ]
                }
            ]
        },
        {
            key: 'startdate',
            title: '合同开始时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            placeholder: "请选择合同开始时间",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择合同开始时间' },
                    ]
                }
            ]
        },
        {
            key: 'enddate',
            title: '合同结束时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD',
            placeholder: "请选择合同结束时间",
            feedBackShow: true,
            validate: [
                {
                    rules: [
                        { required: true, type: 'object', message: '请选择合同结束时间' },
                    ]
                }
            ]
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
            dataType: 'float',
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
            placeholder: "请选择履约保证金",
            disabled: true
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
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholderBegin: '租期开始',
            placeholderEnd: '租期结束',
            disabled: true
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
            showType: 'varchar',
            placeholder: "请选择客户经理",
            disabled: true
        },
        {
            key: 'manager',
            title: '委托代理人',
            dataType: 'varchar',
            placeholder: "请输入委托代理人",
            disabled: true
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            placeholder: "请输入备注"
        }
    ],
    stages: {
        form: [
            {
                key: 'totalstages',
                title: '分期付款',
                showType: 'select',
                options: [
                    { key: '1', value: '1期' },
                    { key: '2', value: '2期' },
                    { key: '3', value: '3期' },
                    { key: '4', value: '4期' },
                    { key: '5', value: '5期' },
                    { key: '6', value: '6期' },
                    { key: '7', value: '7期' },
                    { key: '8', value: '8期' },
                    { key: '9', value: '9期' },
                    { key: '10', value: '10期' },
                    { key: '11', value: '11期' },
                    { key: '12', value: '12期' },
                    { key: '13', value: '13期' },
                    { key: '14', value: '14期' },
                    { key: '15', value: '15期' },
                    { key: '16', value: '16期' },
                    { key: '17', value: '17期' },
                    { key: '18', value: '18期' },
                    { key: '19', value: '19期' },
                    { key: '20', value: '20期' },
                    { key: '21', value: '21期' },
                    { key: '22', value: '22期' },
                    { key: '23', value: '23期' },
                    { key: '24', value: '24期' },
                    { key: '25', value: '25期' },
                    { key: '26', value: '26期' },
                    { key: '27', value: '27期' },
                    { key: '28', value: '28期' },
                    { key: '29', value: '29期' },
                    { key: '30', value: '30期' },
                    { key: '31', value: '31期' },
                    { key: '32', value: '32期' },
                    { key: '33', value: '33期' },
                    { key: '34', value: '34期' },
                    { key: '35', value: '35期' },
                    { key: '36', value: '36期' },
                ],
                placeholder: "请选择分期数",
                feedBackShow: true,
                validate: [
                    {
                        rules: [
                            { required: true, type: 'string', message: '请选择分期数' },
                        ],
                        trigger: ['onBlur', 'onChange']
                    }
                ]
            },
        ],
        buttons: [
            {
                key: 'makeDefault',
                type: 'default',
                icon:'bars',
                title: '生成默认明细'
            }
        ]
    }
}