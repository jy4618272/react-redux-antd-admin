import { combineReducers } from 'redux'
import roomReducer from './room'
import classLineReducer from './classLine'
import policyReducer from './policy'
import accountManagerReducer from './accountManager'
import contractTplReducer from './contractTpl'
import auditPersonReducer from './auditPerson'

export default combineReducers({
    roomData: roomReducer,
    classLineData: classLineReducer,
    policyData: policyReducer,
    accountManagerData: accountManagerReducer,
    contractTplData: contractTplReducer,
    auditPersonData: auditPersonReducer
})
