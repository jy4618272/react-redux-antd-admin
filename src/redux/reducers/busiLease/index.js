import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractFromReducer from './contractInsert/contractFrom'
import contractTabsReducer from './contractInsert/contractTabs'
import contractOrganizationReducer from './contractInsert/contractOrganization'

import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractFrom: contractFromReducer,
    contractOrganization: contractOrganizationReducer,
    contractTabs: contractTabsReducer,

    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})