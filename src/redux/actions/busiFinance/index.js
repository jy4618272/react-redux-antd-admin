import { default as homeActionCreators } from './home'
import { default as paymentActionCreators } from './payment'
import { default as listActionCreators } from './list'

export default {
  ...homeActionCreators,
  ...paymentActionCreators,
  ...listActionCreators
}
