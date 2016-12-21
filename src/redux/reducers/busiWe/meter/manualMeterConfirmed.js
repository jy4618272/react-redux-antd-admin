import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/manualMeterConfirmed'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '核算年月',
            dataIndex: 'checkdate',
            key: 'checkdate'
        },
        {
            title: '交款单号',
            dataIndex: 'businessnumber',
            key: 'businessnumber'
        },
        {
            title: '客户名称',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: '总金额',
            dataIndex: 'currentmoney',
            key: 'currentmoney'
        },
        {
            title: '提交人',
            dataIndex: 'commitman',
            key: 'commitman'
        },
        {
            title: '提交日期',
            dataIndex: 'commitdate',
            key: 'commitdate'
        },
        {
            title: '收款状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '收款人',
            dataIndex: 'sureman',
            key: 'sureman'
        },
        {
            title: '收款日期',
            dataIndex: 'suredate',
            key: 'suredate'
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0,
    printPayment: {
        tableLoading: true,
        tableData: [],
        count: 0
    }
}

export default createReducer(initialState, ACTION_HANDLERS)