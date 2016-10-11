import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/userInfo'

const initialState = {
    userName: '用户名称'
}

export default createReducer(initialState, ACTION_HANDLERS)
