import { default as homeActionCreators } from './home'
import { default as showActionCreators } from './show'


export default {
  ...homeActionCreators,
  ...showActionCreators
}
