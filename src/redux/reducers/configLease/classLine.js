import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/classLine'

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
            title: '班线名称',
            dataIndex: 'linename',
            key: 'linename'
        },
        {
            title: '班线价格',
            dataIndex: 'linefee',
            key: 'linefee'
        },
        {
            title: '输入人',
            dataIndex: 'inputman',
            key: 'inputman'
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

