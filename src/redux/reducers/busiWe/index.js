import { combineReducers } from 'redux'

// 水电业务抄表
import manualMeterInput from './meter/manualMeterInput'
import manualMeterNotConfirmed from './meter/manualMeterNotConfirmed'
import manualMeterConfirmed from './meter/manualMeterConfirmed'
import manualMeterConfirmedDetail from './meter/manualMeterConfirmedDetail'
import intelligentMeter from './meter/intelligentMeter'

export default combineReducers({
    manualMeterInput,
    manualMeterNotConfirmed,
    manualMeterConfirmed,
    manualMeterConfirmedDetail,
    intelligentMeter
})