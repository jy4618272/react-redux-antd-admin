import { combineReducers } from 'redux'

import homeReducer from './home'
import showReducer from './show'

export default combineReducers({
    home: homeReducer,
    show: showReducer
})
