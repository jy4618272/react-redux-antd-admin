import { combineReducers } from 'redux'

import rateList from './rateList'
import roomList from './roomList'
import printList from './printList'

export default combineReducers({
    rateList,
    roomList,
    printList
})