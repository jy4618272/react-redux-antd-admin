import { default as contractActionCreators } from './contract'
import { default as roomStateActionCreators } from './roomState'


export default {
  ...contractActionCreators,
  ...roomStateActionCreators
}
