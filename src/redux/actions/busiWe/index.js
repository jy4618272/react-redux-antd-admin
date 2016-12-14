// 水电业务抄表
import { default as manualMeterNotConfirmedActionCreators } from './meter/manualMeterNotConfirmed'
import { default as manualMeterConfirmedActionCreators } from './meter/manualMeterConfirmed'
import { default as intelligentMeterActionCreators } from './meter/intelligentMeter'

export default {
    ...manualMeterNotConfirmedActionCreators,
    ...manualMeterConfirmedActionCreators,
    ...intelligentMeterActionCreators
}
