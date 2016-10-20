import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})