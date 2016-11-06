import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contract/workFlow'

const initialState = {
    loading: true,
    data: []
}

export default createReducer(initialState, ACTION_HANDLERS)

