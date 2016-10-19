import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/roomState'

const initialState = {
    Loading: true,
    roomStateData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)