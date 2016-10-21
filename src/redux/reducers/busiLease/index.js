import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractAddCustomReducer from './contractAddCustom'
import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractAddCustom: contractAddCustomReducer,
    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})