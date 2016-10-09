import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/layout'

const initialState = {
    'slideBar': true
}

export default createReducer(initialState, ACTION_HANDLERS)

