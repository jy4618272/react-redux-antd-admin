/**
 * 合同续租
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractRenew'

const initialState = {
    loading: true,
    data: {}
}

export default createReducer(initialState, ACTION_HANDLERS)