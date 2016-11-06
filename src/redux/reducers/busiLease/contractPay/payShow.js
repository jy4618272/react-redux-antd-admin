import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractPay/payShow'

const initialState = {
    loading: true,
    data: {},
    tableColumns: [
        {
            title: '期数',
            dataIndex: 'stagesnumber',
            key: 'stagesnumber'
        },
        {
            title: '收费项目',
            dataIndex: 'itemname',
            key: 'itemname'
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money'
        },
        {
            title: '计划收款日期',
            dataIndex: 'inputdate',
            key: 'inputdate'
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo'
        }
    ],
}

export default createReducer(initialState, ACTION_HANDLERS)

