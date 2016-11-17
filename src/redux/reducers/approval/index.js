import { combineReducers } from 'redux'

import listReducer from './list'
import workFlowReducer from './workFlow'
import opinionsReducer from './opinions'

export default combineReducers({
    list: listReducer,
    workFlow: workFlowReducer,    
    opinions: opinionsReducer,
})
