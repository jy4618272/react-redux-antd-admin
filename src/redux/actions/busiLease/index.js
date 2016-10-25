import { default as contractActionCreators } from './contract'
import { default as contractFromActionCreators } from './contractInsert/contractFrom'
import { default as contractOrganizationActionCreators } from './contractInsert/contractOrganization'
import { default as contractInfoActionCreators } from './contractInsert/contractInfo'
import { default as contractTabsActionCreators } from './contractInsert/contractTabs'
import { default as notContractActionCreators } from './notContract'
import { default as bondActionCreators } from './bond'
import { default as roomStateActionCreators } from './roomState'


export default {
  ...contractActionCreators,
  ...contractFromActionCreators,
  ...contractOrganizationActionCreators,
  ...contractInfoActionCreators,
  ...contractTabsActionCreators,
  ...notContractActionCreators,
  ...bondActionCreators,
  ...roomStateActionCreators
}
