import { combineReducers } from 'redux'
import contractFromReducer from './contractFrom'
import contractOrganizationReducer from './contractOrganization'
import contractRoomTableReducer from './contractRoomTable'
import contractLineTableReducer from './contractLineTable'
import contractPolicyTableReducer from './contractPolicyTable'
import contractBondTableReducer from './contractBondTable'
import contractAppendicesTableReducer from './contractAppendicesTable'
import contractStagesTableReducer from './contractStagesTable'

export default combineReducers({
    contractFrom: contractFromReducer,
    contractRoomTable: contractRoomTableReducer,
    contractOrganization: contractOrganizationReducer,
    contractLineTable: contractLineTableReducer,
    contractPolicyTable: contractPolicyTableReducer,
    contractBondTable: contractBondTableReducer,
    contractAppendicesTable: contractAppendicesTableReducer,
    contractStagesTable: contractStagesTableReducer
})

