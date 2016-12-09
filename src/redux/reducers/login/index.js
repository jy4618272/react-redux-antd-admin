import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/login'

const initialState = {
    loading: false,
    loadingText: '登录',
    data: {}
}

export default createReducer(initialState, ACTION_HANDLERS) 