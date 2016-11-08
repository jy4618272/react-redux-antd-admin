import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractChange/changeHistory'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '变更日期',
            dataIndex: 'createdate',
            key: 'createdate'
        },
        // {
        //     title: '变更类型',
        //     dataIndex: 'area',
        //     key: 'area'
        // },
        {
            title: '变更前',
            dataIndex: 'oldvalue',
            key: 'oldvalue'
        },
        {
            title: '变更后',
            dataIndex: 'newvalue',
            key: 'newvalue'
        },
        // {
        //     title: '状态',
        //     dataIndex: 'area',
        //     key: 'area'
        // },
        // {
        //     title: '提交人',
        //     dataIndex: 'area',
        //     key: 'area'
        // },
        // {
        //     title: '审核人',
        //     dataIndex: 'area',
        //     key: 'area'
        // },
        // {
        //     title: '审核日期',
        //     dataIndex: 'area',
        //     key: 'area'
        // },
        {
            title: '标签名',
            dataIndex: 'labelname',
            key: 'labelname'
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

