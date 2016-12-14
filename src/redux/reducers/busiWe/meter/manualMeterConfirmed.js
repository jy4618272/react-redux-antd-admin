import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/manualMeterConfirmed'

const initialState = {
    tableLoading: true,
    tableColumns: [
        {
            title: '核算年月',
            dataIndex: '1',
            key: '1'
        },
        {
            title: '交款单号',
            dataIndex: '2',
            key: '2'
        },
        {
            title: '客户名称',
            dataIndex: '3',
            key: '3'
        },
        {
            title: '总金额',
            dataIndex: '4',
            key: '4'
        },
        {
            title: '提交人',
            dataIndex: '5',
            key: '5'
        },
        {
            title: '提交日期',
            dataIndex: '6',
            key: '6'
        },
        {
            title: '收款状态',
            dataIndex: '7',
            key: '7'
        },
        {
            title: '收款人',
            dataIndex: '8',
            key: '8'
        },
        {
            title: '收款日期',
            dataIndex: '9',
            key: '9'
        }
    ],
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)