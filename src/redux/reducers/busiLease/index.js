import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractFromReducer from './contractInsert/contractFrom'
import contractTabsReducer from './contractInsert/contractTabs'
import contractRenewReducer from './contractRenew'

import changeHistoryReducer from './contractChange/changeHistory'

import contractPayReducer from './contractPay'
import payMentReducer from './payMent'
import workFlowReducer from './contract/workFlow'

import organizationReducer from './organization'
import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractFrom: contractFromReducer,
    organization: organizationReducer,
    contractTabs: contractTabsReducer,
    contractRenew: contractRenewReducer,

    changeHistory: changeHistoryReducer,
    
    contractPay: contractPayReducer,
    payMent: payMentReducer,
    contractWorkFlow: workFlowReducer,
    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})