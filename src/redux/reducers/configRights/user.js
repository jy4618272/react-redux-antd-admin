import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configRights/user'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '账户名',
            dataIndex: '1',
            key: '1'
        },
        {
            title: '手机号',
            dataIndex: '2',
            key: '2'
        },
        {
            title: '邮箱',
            dataIndex: '3',
            key: '3'
        },
        {
            title: '所属岗位',
            dataIndex: '4',
            key: '4'
        },
        {
            title: '角色名称',
            dataIndex: '5',
            key: '5'
        },
        {
            title: '账号状态',
            dataIndex: '6',
            key: '6'
        }
    ],
    tableData: [],
    skipCount: 1,      // 默认是第 0 页
    pageSize: 10,      // 默认每页显示 10 条记录
    count: 0            // 总共有多少条数据
}

export default createReducer(initialState, ACTION_HANDLERS)

