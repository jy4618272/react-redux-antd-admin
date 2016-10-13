import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/lease/policy'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '所属基地',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '活动名称',
            dataIndex: 'build',
            key: 'build'
        },
        {
            title: '优惠类型',
            dataIndex: 'room',
            key: 'room'
        },
        {
            title: '优惠幅度',
            dataIndex: 'romearea',
            key: 'romearea'
        },
        {
            title: '区域',
            dataIndex: 'money',
            key: 'money'
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

