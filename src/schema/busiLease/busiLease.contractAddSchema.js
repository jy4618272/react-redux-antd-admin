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
            ]
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

    contractInfo: [
        {
            key: 'pactCode',
            title: '合同号',
            dataType: 'varchar',
            placeholder: "请输入合同号"
        },
        {
            key: 'signDate',
            title: '合同签订时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: "请输入合同签订时间"
        },
        {
            key: 'startsate',
            title: '合同开始时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: "请输入合同开始时间"
        },
        {
            key: 'enddate',
            title: '合同结束时间',
            dataType: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: "请输入合同结束时间"
        },
        {
            key: 'roomList',
            title: '合同房间',
            dataType: 'varchar',
            placeholder: "请输入合同房间"
        },
        {
            key: 'roomMoney',
            title: '房间租金',
            dataType: 'varchar',
            placeholder: "请输入房间租金"
        },
        {
            key: 'lineList',
            title: '合同班线',
            dataType: 'varchar',
            placeholder: "请输入合同班线"
        },
        {
            key: 'lineMoney',
            title: '班线费用',
            dataType: 'varchar',
            placeholder: "请输入班线费用"
        },
        {
            key: 'standardMoney',
            title: '合同标准金额',
            dataType: 'varchar',
            placeholder: "请输入合同标准金额"
        },
        {
            key: 'money',
            title: '合同金额',
            dataType: 'varchar',
            placeholder: "请输入合同金额"
        },
        {
            key: 'marginMoney',
            title: '履约保证金',
            dataType: 'varchar',
            placeholder: "请输入履约保证金"
        },
        {
            key: 'marginMoneyOffset',
            title: '履约保证金冲抵',
            dataType: 'varchar',
            placeholder: "请输入履约保证金冲抵"
        },
        {
            key: 'freestartdate',
            keyEnd:'freeenddate',
            title: '优惠租期',
            dataType: 'datetime',
            showType: 'between',
            format: 'YYYY-MM-DD HH:mm:ss',
             placeholderBegin: '租期开始',
            placeholderEnd: '租期结束',
            feedBackShow: true,
            help:"必填，请选择优惠租期",
            validate: [
                {
                    rules: [
                        { required: true},
                    ],
                    trigger: ['onBlur', 'onChange']
                }
            ]
        },
        {
            key: 'pactcode',
            title: '优惠金额',
            dataType: 'varchar',
            placeholder: "请输入优惠金额"
        },
        {
            key: 'totalOffsetMoney',
            title: '冲抵总额',
            dataType: 'varchar',
            placeholder: "请输入冲抵总额"
        },
        {
            key: 'saler',
            title: '客户经理',
            dataType: 'varchar',
            placeholder: "请输入客户经理"
        },
        {
            key: 'manager',
            title: '委托代理人',
            dataType: 'varchar',
            placeholder: "请输入委托代理人"
        },
        {
            key: 'memo',
            title: '备注',
            dataType: 'varchar',
            placeholder: "请输入备注"
        }
    ]
}