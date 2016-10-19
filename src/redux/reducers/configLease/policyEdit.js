import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/configLease/policyEdit'

const initialState = {
    loading: true,
    data: {}
}
export default createReducer(initialState, ACTION_HANDLERS)