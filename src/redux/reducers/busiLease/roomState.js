import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/roomState'

const initialState = {
    loading: true,
    roomStateData: [],
    skipCount: 1,
    pageSize: 24,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)