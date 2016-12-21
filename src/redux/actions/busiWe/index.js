// 水电业务抄表
import { default as manualMeterInputActionCreators } from './meter/manualMeterInput'
import { default as manualMeterNotConfirmedActionCreators } from './meter/manualMeterNotConfirmed'
import { default as manualMeterConfirmedActionCreators } from './meter/manualMeterConfirmed'
import { default as manualMeterConfirmedDetailActionCreators } from './meter/manualMeterConfirmedDetail'
import { default as intelligentMeterActionCreators } from './meter/intelligentMeter'

export default {
    ...manualMeterInputActionCreators,
    ...manualMeterNotConfirmedActionCreators,
    ...manualMeterConfirmedActionCreators,
    ...manualMeterConfirmedDetailActionCreators,
    ...intelligentMeterActionCreators
}
