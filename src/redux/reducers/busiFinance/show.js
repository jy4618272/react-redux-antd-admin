import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiFinance/show'

const initialState = {
    loading: true,
    init: {
        bond: [
            {
                title: '房间号',
                key: 'roomlist',
                dataIndex: 'roomlist'
            },
            {
                title: '金额',
                key: 'marginmoney',
                dataIndex: 'marginmoney'
            },
            {
                title: '备注',
                key: 'memo',
                dataIndex: 'memo'
            }
        ],
        notContract: [
            {
                title: '生效日期',
                key: 'validdate',
                dataIndex: 'validdate'
            },
            {
                title: '失效日期',
                key: 'invaliddate',
                dataIndex: 'invaliddate'
            },
            {
                title: '备注',
                key: 'memo',
                dataIndex: 'memo'
            }
        ]
    },
    data: {}
}

export default createReducer(initialState, ACTION_HANDLERS)
