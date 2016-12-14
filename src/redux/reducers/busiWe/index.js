import { combineReducers } from 'redux'

// 水电业务抄表
import manualMeterNotConfirmed from './meter/manualMeterNotConfirmed'
import manualMeterConfirmed from './meter/manualMeterConfirmed'
import intelligentMeter from './meter/intelligentMeter'

export default combineReducers({
    manualMeterNotConfirmed,
    manualMeterConfirmed,
    intelligentMeter
})