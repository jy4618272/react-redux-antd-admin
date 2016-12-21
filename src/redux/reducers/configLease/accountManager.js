import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/accountManager'

const initialState = {
    area: [],
    tableLoading: false,
    tableColumns: [
        {
            title: '所属基地',
            dataIndex: 'site',
            key: 'site'
        },
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '工号',
            dataIndex: 'jobcard',
            key: 'jobcard'
        },
        {
            title:'电话号码',
            dataIndex:'tel',
            key:'tel'
        },
        {
            title: '创建人',
            dataIndex: 'createman',
            key: 'createman'
        },
        {
            title: '创建日期',
            dataIndex: 'createdate',
            key: 'createdate'
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

