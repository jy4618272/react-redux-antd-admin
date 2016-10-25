/**
 * 合同新增-合同模板
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractInsert/contractTabs'

const initialState = [
    {
        key: 'pactCode',
        title: '合同号',
        dataType: 'varchar',
        placeholder: "请输入合同号"
    },
    {
        key: 'signdate',
        title: '合同签订时间',
        dataType: 'datetime',
        format: 'YYYY-MM-DD',
        placeholder: "请输入合同签订时间"
    },
    {
        key: 'startdate',
        title: '合同开始时间',
        dataType: 'datetime',
        format: 'YYYY-MM-DD',
        placeholder: "请输入合同开始时间"
    },
    {
        key: 'enddate',
        title: '合同结束时间',
        dataType: 'datetime',
        format: 'YYYY-MM-DD',
        placeholder: "请输入合同结束时间"
    },
    {
        key: 'roomList',
        title: '合同房间',
        dataType: 'varchar',
        placeholder: "请输入合同房间",
        disabled: true
    },
    {
        key: 'roomMoney',
        title: '房间租金',
        dataType: 'varchar',
        placeholder: "请输入房间租金",
        disabled: true
    },
    {
        key: 'lineList',
        title: '合同班线',
        dataType: 'varchar',
        placeholder: "请输入合同班线",
        disabled: true
    },
    {
        key: 'lineMoney',
        title: '班线费用',
        dataType: 'varchar',
        placeholder: "请输入班线费用",
        disabled: true
    },
    {
        key: 'standardMoney',
        title: '合同标准金额',
        dataType: 'varchar',
        placeholder: "请输入合同标准金额",
        disabled:true
    },
    {
        key: 'money',
        title: '合同金额',
        dataType: 'varchar',
        placeholder: "请输入合同金额",
        disabled: true
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
        placeholder: "请输入履约保证金冲抵",
        disabled:true
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
        key: 'pactcode',
        title: '优惠金额',
        dataType: 'varchar',
        placeholder: "请输入优惠金额",
        disabled:true        
    },
    {
        key: 'totalOffsetMoney',
        title: '冲抵总额',
        dataType: 'varchar',
        placeholder: "请输入冲抵总额",
        disabled:true        
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