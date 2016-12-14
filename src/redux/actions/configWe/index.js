// 水电配置列表
import { default as rateListActionCreators } from './list/rateList'
import { default as roomListActionCreators } from './list/roomList'
import { default as printListActionCreators } from './list/printList'

// 水电配置抄表
import { default as manualMeterActionCreators } from './meter/manualMeter'
import { default as intelligentMeterActionCreators } from './meter/intelligentMeter'

export default {
  ...rateListActionCreators,
  ...roomListActionCreators,
  ...printListActionCreators,

  ...manualMeterActionCreators,
  ...intelligentMeterActionCreators
}
