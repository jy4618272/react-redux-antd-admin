import { default as roomActionCreators } from './room'
import { default as classLineActionCreators } from './classLine'
import { default as policyActionCreators } from './policy'
import { default as accountManagerActionCreators } from './accountManager'
import { default as contractTplActionCreators } from './contractTpl'
import { default as leaseAddActionCreators } from './leaseAdd'


export default {
  ...roomActionCreators,
  ...classLineActionCreators,
  ...policyActionCreators,
  ...accountManagerActionCreators,
  ...contractTplActionCreators,
  ...leaseAddActionCreators
}
