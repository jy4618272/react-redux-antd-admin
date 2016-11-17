import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/approval/workFlow'

const initialState = {
    loading: true,
    data: []
}

export default createReducer(initialState, ACTION_HANDLERS)

