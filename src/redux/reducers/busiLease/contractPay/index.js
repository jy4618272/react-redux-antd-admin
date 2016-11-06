import { combineReducers } from 'redux'

import confirmedReducer from './confirmed'
import notConfirmedReducer from './notConfirmed'

export default combineReducers({
    confirmedData: confirmedReducer,
    notConfirmedData: notConfirmedReducer
})
