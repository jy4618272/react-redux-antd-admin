import { default as listActionCreators } from './list'
import { default as workFlowActionCreators } from './workFlow'
import { default as opinionsActionCreators } from './opinions'

export default {
  ...listActionCreators,
  ...workFlowActionCreators,
  ...opinionsActionCreators
}
