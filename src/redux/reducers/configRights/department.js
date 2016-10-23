import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configRights/department'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '部门名称',
            dataIndex: '1',
            key: '1'
        },
        {
            title: '所属公路港',
            dataIndex: '2',
            key: '2'
        },
        {
            title: '创建日期',
            dataIndex: '3',
            key: '3'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

