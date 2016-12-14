import { combineReducers } from 'redux'

// 水电配置列表
import rateList from './list/rateList'
import roomList from './list/roomList'
import printList from './list/printList'

// 水电配置抄表
import manualMeter from './meter/manualMeter'
import intelligentMeter from './meter/intelligentMeter'

export default combineReducers({
    rateList,
    roomList,
    printList,
    manualMeter,
    intelligentMeter
})