import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configRights/post'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '岗位名称',
            dataIndex: '1',
            key: '1'
        },
        {
            title: '所属部门',
            dataIndex: '4',
            key: '4'
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

