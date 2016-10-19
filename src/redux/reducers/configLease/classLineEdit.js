import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/classLineEdit'

const initialState = {
    loading: true,
    data: {}
}
export default createReducer(initialState, ACTION_HANDLERS)