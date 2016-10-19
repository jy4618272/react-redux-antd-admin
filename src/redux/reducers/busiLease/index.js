import { combineReducers } from 'redux'
import contractReducer from './contract'
import roomStateReducer from './roomState'

export default combineReducers({
    contract: contractReducer,
    roomState: roomStateReducer
})