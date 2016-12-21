import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configWe/list/rateList'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '类别',
            dataIndex: 'metertype',
            key: 'metertype',
            width:'15%'
        },
        {
            title: '单价',
            dataIndex: 'meterprice',
            key: 'meterprice',
            width:'15%'
        },
        {
            title: '表倍率',
            dataIndex: 'meterrate',
            key: 'meterrate',
            width:'15%'
        },
        {
            title: '计费类型',
            dataIndex: 'chargetype',
            key: 'chargetype',
            width:'15%'
        },
        {
            title: '创始人',
            dataIndex: 'createman',
            key: 'createman',
            width:'20%'
        },
        {
            title: '创建日期',
            dataIndex: 'createdate',
            key: 'createdate',
            width:'20%'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)