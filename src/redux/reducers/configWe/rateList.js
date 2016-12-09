import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/rateList'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '类别',
            dataIndex: 'metertype',
            key: 'metertype'
        },
        {
            title: '单价',
            dataIndex: 'meterprice',
            key: 'meterprice'
        },
        {
            title: '表倍率',
            dataIndex: 'meterrate',
            key: 'meterrate'
        },
        {
            title: '计费类型',
            dataIndex: 'chargetype',
            key: 'chargetype'
        },
        {
            title: '创始人',
            dataIndex: 'createman',
            key: 'createman'
        },
        {
            title: '创建日期',
            dataIndex: 'createdate',
            key: 'createdate'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)