import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configBase/insert'

const initialState = {
    loading: true,
    data: {}
}

export default createReducer(initialState, ACTION_HANDLERS)

