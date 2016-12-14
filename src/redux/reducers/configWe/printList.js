import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/printList'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '核算月份',
            dataIndex: 'checkdate',
            key: 'checkdate'
        },
        {
            title: '水表抄表日期',
            dataIndex: 'readingdate',
            key: 'readingdate'
        },
        {
            title: '电表抄表日期',
            dataIndex: 'readingdate1',
            key: 'readingdate1'
        },
        {
            title: '交款单备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)