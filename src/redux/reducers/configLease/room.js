import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/room'

const initialState = {
    room: [
        {
            key: 'area',  // 传递给后端的字段名
            title: '区域',  // 前端显示的名称
            dataType: 'varchar',
            showType: 'select',
            options: []
        },
        {
            key: 'key',
            title: '关键字',
            dataType: 'varchar',
            placeholder: '请输入楼号/房间号'
        }
    ],
    tableLoading: true,
    tableColumns: [
        {
            title: '区域',
            dataIndex: 'area',
            key: 'area'
        },
        {
            title: '楼号',
            dataIndex: 'build',
            key: 'build'
        },
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room'
        },
        {
            title: '面积/平方米',
            dataIndex: 'roomarea',
            key: 'roomarea'
        },
        {
            title: '金额/元',
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

