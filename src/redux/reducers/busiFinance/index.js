import { combineReducers } from 'redux'

import homeReducer from './home'
import listReducer from './list'

export default combineReducers({
    home: homeReducer,
    list: listReducer
})
