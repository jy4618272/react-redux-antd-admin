import { default as contractActionCreators } from './contract'
import { default as contractFromActionCreators } from './contractInsert/contractFrom'
import { default as organizationActionCreators } from './organization'
import { default as contractInfoActionCreators } from './contractInsert/contractInfo'
import { default as contractTabsActionCreators } from './contractInsert/contractTabs'

import { default as changeHistoryActionCreators } from './contractChange/changeHistory'

import { default as contractRenewActionCreators } from './contractRenew'

import { default as contractPayActionCreators } from './contractPay'
import { default as payMentActionCreators } from './payMent'
import { default as contractworkFlowActionCreators } from './contract/workFlow'

import { default as notContractActionCreators } from './notContract'
import { default as bondActionCreators } from './bond'
import { default as roomStateActionCreators } from './roomState'


export default {
  ...contractActionCreators,
  ...contractFromActionCreators,
  ...organizationActionCreators,
  ...contractInfoActionCreators,
  ...contractTabsActionCreators,
  ...changeHistoryActionCreators,
  ...contractRenewActionCreators,
  ...contractPayActionCreators,
  ...payMentActionCreators,

  ...contractworkFlowActionCreators,
  
  ...notContractActionCreators,
  ...bondActionCreators,
  ...roomStateActionCreators
}
