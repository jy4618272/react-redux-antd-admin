import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractPay'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '合同编号',
            dataIndex: 'rentpactcode',
            key: 'rentpactcode'
        },
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '联系方式',
            dataIndex: 'tel',
            key: 'tel'
        },
        {
            title: '房间号',
            dataIndex: 'romelist',
            key: 'romelist'
        },
        {
            title: '交款金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '计划收款时间',
            dataIndex: 'plandate',
            key: 'plandate'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

