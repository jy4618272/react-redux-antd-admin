import { default as rateListActionCreators } from './rateList'
import { default as roomListActionCreators } from './roomList'
import { default as printListActionCreators } from './printList'

export default {
  ...rateListActionCreators,
  ...roomListActionCreators,
  ...printListActionCreators
}
