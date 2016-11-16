import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/home'

const initialState = {
    loading: true,
    data: {}
}

export default createReducer(initialState, ACTION_HANDLERS)
