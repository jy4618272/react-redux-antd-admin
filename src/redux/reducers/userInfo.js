import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/userInfo'

const initialState = {
    name: '张三'
}

export default createReducer(initialState, ACTION_HANDLERS)
