import { combineReducers } from 'redux'
import contractDataReducer from './contractData'
import contractFromReducer from './contractInsert/contractFrom'
import contractTabsReducer from './contractInsert/contractTabs'
import contractRenewReducer from './contractRenew'
import contractApprovalReducer from './contractApproval'
import contractApprovalShowReducer from './contractApproval/show'

import changeHistoryReducer from './contractChange/changeHistory'

import contractPayReducer from './contractPay'
import payShowReducer from './contractPay/payShow'
import workFlowReducer from './contract/workFlow'

import contractOrganizationReducer from './contractInsert/contractOrganization'
import notContractDataReducer from './notContractData'
import bondDataReducer from './bondData'
import roomStateReducer from './roomState'

export default combineReducers({
    contractData: contractDataReducer,
    contractFrom: contractFromReducer,
    contractOrganization: contractOrganizationReducer,
    contractTabs: contractTabsReducer,
    contractRenew: contractRenewReducer,
    contractApproval: contractApprovalReducer,
    contractApprovalShow: contractApprovalShowReducer,

    changeHistory: changeHistoryReducer,
    
    contractPay: contractPayReducer,
    contractPayShow: payShowReducer,
    contractWorkFlow: workFlowReducer,
    notContractData: notContractDataReducer,
    bondData: bondDataReducer,
    roomState: roomStateReducer
})