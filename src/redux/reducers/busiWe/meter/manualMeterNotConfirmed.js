import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/manualMeterNotConfirmed'

const initialState = {
    tableLoading: false,
    tableColumns: [
        {
            title: '核算年月',
            dataIndex: 'checkdate',
            key: 'checkdate',
            width:'20%'
        },
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization',
            width:'20%'
        },
        {
            title: '总金额',
            dataIndex: 'currentmoney',
            key: 'currentmoney',
            width:'15%'
        },
        {
            title: '操作人',
            dataIndex: 'createman',
            key: 'createman',
            width:'18%'
        },
        {
            title: '操作日期',
            dataIndex: 'createdate',
            key: 'createdate',
            width: '20%'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)