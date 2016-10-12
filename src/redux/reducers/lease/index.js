import { combineReducers } from 'redux'
import roomReducer from './room'

export default combineReducers({
    roomData: roomReducer
})
