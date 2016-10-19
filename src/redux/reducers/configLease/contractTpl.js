import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/contractTpl'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '模板名称',
            dataIndex: 'modelname',
            key: 'modelname'
        },
        {
            title: '修改时间',
            dataIndex: 'inputdate',
            key: 'inputdate'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

