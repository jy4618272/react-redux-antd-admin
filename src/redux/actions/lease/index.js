import { default as roomActionCreators } from './room'
import { default as classLineActionCreators } from './classLine'
import { default as policyActionCreators } from './policy'
import { default as accountManagerActionCreators } from './accountManager'


export default {
  ...roomActionCreators,
  ...classLineActionCreators,
  ...accountManagerActionCreators
}
