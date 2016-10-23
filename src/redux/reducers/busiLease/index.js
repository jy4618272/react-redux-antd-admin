import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractFromReducer from './contractInsert/contractFrom'
import contractOrganizationReducer from './contractInsert/contractOrganization'
import contractRoomTableReducer from './contractInsert/contractRoomTable'
import contractLineTableReducer from './contractInsert/contractLineTable'
import contractPolicyTableReducer from './contractInsert/contractPolicyTable'
import contractBondTableReducer from './contractInsert/contractBondTable'
import contractAppendicesTableReducer from './contractInsert/contractAppendicesTable'
import contractStagesTableReducer from './contractInsert/contractStagesTable'

import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractFrom: contractFromReducer,
    contractRoomTable: contractRoomTableReducer,
    contractOrganization: contractOrganizationReducer,
    contractLineTable: contractLineTableReducer,
    contractPolicyTable: contractPolicyTableReducer,
    contractBondTable: contractBondTableReducer,
    contractAppendicesTable: contractAppendicesTableReducer,
    contractStagesTable: contractStagesTableReducer,

    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})