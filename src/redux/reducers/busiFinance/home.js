import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiFinance/home'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '业务类型',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: '交款单号',
            dataIndex: 'financebusinessnumber',
            key: 'financebusinessnumber'
        },
        {
            title: '交款方式',
            dataIndex: 'smalltype',
            key: 'smalltype'
        },
        {
            title: '客户名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '资产名称',
            dataIndex: 'assetname',
            key: 'assetname'
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '收退款',
            dataIndex: 'paytype',
            key: 'paytype'
        },
        {
            title: '提交人',
            dataIndex: 'inputman',
            key: 'inputman'
        },
        {
            title: '提交日期',
            dataIndex: 'collectiondate',
            key: 'collectiondate'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

