import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import store from 'STORE'
import layout from 'REDUCER/layout'
import userInfo from 'REDUCER/userInfo'
import menuList from 'REDUCER/menuList'

// ================================
// 同步的 Reducers（即应用初始化所必需的）
// ================================
const syncReducers = {
  router: routerReducer,
  layout: layout,
  userInfo: userInfo,
  menuList: menuList
}

// ================================
// 异步加载的 Reducers（Code Splitting 按需加载的）
// ================================
const asyncReducers = {}

/**
 * @return {Function} rootReducer
 */
export function createRootReducer() {
  return combineReducers({
    ...syncReducers,
    ...asyncReducers
  })
}

/**
 * 按需加载时，立即注入对应的 Reducer
 * @param  {String}   key
 * @param  {Function} reducer
 */
export function injectReducer(key, reducer) {
  asyncReducers[key] = reducer
  store.replaceReducer(createRootReducer()) // 替换当前的 rootReducer
}
