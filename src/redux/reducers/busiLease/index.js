import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractAddReducer from './contractAdd'
import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractAdd: contractAddReducer,
    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})