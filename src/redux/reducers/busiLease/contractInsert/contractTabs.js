/**
 * 合同新增-合同模板
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractInsert/contractTabs'

const initialState = [
    {
        key: 'pactcode',
        title: '合同号',
        dataType: 'varchar',
        placeholder: "请输入合同号",
        disabled: true,
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, message: '请选择合同模板' },
                ]
            }
        ]
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
        dataType: 'int',
        placeholder: "请选择合同房间",
        disabled: true,
        feedBackShow: true,
        validate: [
            {
                rules: [
                    { required: true, type: 'number', message: '请选择合同房间' },
                ]
            }
        ]
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
        placeholder: "请选择客户经理",
        options: []
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

export default createReducer(initialState, ACTION_HANDLERS)