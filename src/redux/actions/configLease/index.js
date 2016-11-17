import { default as areaActionCreators } from './area'
import { default as roomActionCreators } from './room'
import { default as roomEditActionCreators } from './roomEdit'

import { default as classLineActionCreators } from './classLine'
import { default as classLineEditActionCreators } from './classLineEdit'

import { default as policyActionCreators } from './policy'
import { default as policyEditActionCreators } from './policyEdit'

import { default as accountManagerActionCreators } from './accountManager'
import { default as accountManagerEditActionCreators } from './accountManagerEdit'

import { default as contractTplActionCreators } from './contractTpl/list'
import { default as contractTplEditActionCreators } from './contractTpl/edit'
import { default as contractTplDictionaryActionCreators } from './contractTpl/dictionary'

import { default as leaseAddActionCreators } from './leaseAdd'


export default {
  ...areaActionCreators,
  ...roomActionCreators,
  ...roomEditActionCreators,
  ...classLineActionCreators,
  ...classLineEditActionCreators,
  ...policyActionCreators,
  ...policyEditActionCreators,
  ...accountManagerActionCreators,
  ...accountManagerEditActionCreators,
  ...contractTplActionCreators,
  ...contractTplEditActionCreators,
  ...contractTplDictionaryActionCreators,
  ...leaseAddActionCreators
}
