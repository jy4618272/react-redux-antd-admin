import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractChange/changeHistory'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '变更日期',
            dataIndex: 'createdate',
            key: 'createdate',
            width: '150'
        },
        {
            title: '变更前',
            dataIndex: 'oldvalue',
            key: 'oldvalue',
            width: '200'            
        },
        {
            title: '变更后',
            dataIndex: 'newvalue',
            key: 'newvalue',
            width: '200'                
        },
        {
            title: '标签名',
            dataIndex: 'labelname',
            key: 'labelname',
            width: '150'
        },
        {
            title: '关键字段',
            dataIndex: 'keyfield',
            key: 'keyfield'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

