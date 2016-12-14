import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiWe/meter/manualMeterNotConfirmed'

const initialState = {
    tableLoading: true,
    tableData:[],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)