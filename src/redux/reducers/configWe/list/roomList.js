import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/list/roomList'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '房间号',
            dataIndex: 'room',
            key: 'room'
        },
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
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '手机号',
            dataIndex: 'tel',
            key: 'tel'
        },
        {
            title: '状态',
            dataIndex: 'meterstatus',
            key: 'meterstatus'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)