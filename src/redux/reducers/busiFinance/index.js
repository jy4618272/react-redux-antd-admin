import { combineReducers } from 'redux'

import homeReducer from './home'
import paymentReducer from './payment'
import listReducer from './list'

export default combineReducers({
    home: homeReducer,
    payment: paymentReducer,
    list: listReducer
})
