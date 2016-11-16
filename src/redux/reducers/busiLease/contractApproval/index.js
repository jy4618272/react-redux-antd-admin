import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractApproval'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '业务',
            dataIndex: 'flowname',
            key: 'flowname'
        },
        {
            title: '任务',
            dataIndex: 'nodename',
            key: 'nodename'
        },
        {
            title: 'ID',
            dataIndex: 'formurl',
            key: 'formurl'
        },
        {
            title: '发起人/执行人',
            dataIndex: 'inputman',
            key: 'inputman'
        },
        {
            title: '流程状态',
            dataIndex: 'nodestatus',
            key: 'nodestatus'
        },
        {
            title: '创建时间',
            dataIndex: 'inputdate',
            key: 'inputdate'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)
