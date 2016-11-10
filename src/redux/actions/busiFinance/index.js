import { default as homeActionCreators } from './home'
import { default as listActionCreators } from './list'

export default {
  ...homeActionCreators,
  ...listActionCreators
}
