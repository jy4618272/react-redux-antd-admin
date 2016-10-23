import { combineReducers } from 'redux'

import departmentReducer from './department'

import postReducer from './post'

import roleReducer from './role'

import userReducer from './user'

export default combineReducers({
    departmentData: departmentReducer,
    postData: postReducer,
    roleData: roleReducer,
    userData: userReducer
})
