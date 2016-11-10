import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiFinance/list'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '文件名',
            dataIndex: 'filename',
            key: 'filename'
        },
        {
            title: '操作人',
            dataIndex: 'inputman',
            key: 'inputman'
        },
        {
            title: '金额',
            dataIndex: 'balancesuccessamount',
            key: 'balancesuccessamount'
        },
        {
            title: '缴款单数量',
            dataIndex: 'financecollectioncount',
            key: 'financecollectioncount'
        },
        {
            title: '流水数量',
            dataIndex: 'totalcount',
            key: 'totalcount'
        },
        {
            title: '生成日期',
            dataIndex: 'inputdate',
            key: 'inputdate'
        },
        {
            title: '提交日期',
            dataIndex: 'submitdate',
            key: 'submitdate'
        },
        {
            title: '提交人',
            dataIndex: 'submitman',
            key: 'submitman'
        },
        {
            title: '来源',
            dataIndex: 'source',
            key: 'source'
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

