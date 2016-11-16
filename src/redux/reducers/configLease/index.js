import { combineReducers } from 'redux'

import areaReducer from './area'
import roomReducer from './room'
import roomAddSchemaReducer from './roomAddSchema'
import roomEditReducer from './roomEdit'

import classLineReducer from './classLine'
import classLineEditReducer from './classLineEdit'

import policyReducer from './policy'
import policyEditReducer from './policyEdit'

import accountManagerReducer from './accountManager'
import accountManagerEditReducer from './accountManagerEdit'

import contractTplReducer from './contractTpl'
import contractTplEditReducer from './contractTplEdit'

import auditPersonReducer from './auditPerson'

export default combineReducers({
    areaData: areaReducer,
    roomData: roomReducer,
    roomAddSchema: roomAddSchemaReducer,
    roomEdit: roomEditReducer,
    classLineData: classLineReducer,
    classLineEdit: classLineEditReducer,    
    policyData: policyReducer,
    policyEdit: policyEditReducer,
    accountManagerData: accountManagerReducer,
    accountManagerEdit: accountManagerEditReducer,
    contractTplData: contractTplReducer,
    contractTplEdit: contractTplEditReducer,
    auditPersonData: auditPersonReducer
})
