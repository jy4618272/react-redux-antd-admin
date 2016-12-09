import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import store from 'STORE'                              // 状态机
import login from 'REDUCER/login'                      // 登录信息
import layout from 'REDUCER/layout'                    // 左侧菜单
import userInfo from 'REDUCER/userInfo'				   // 用户信息
import menuList from 'REDUCER/menuList'				   // 菜单
import home from 'REDUCER/home'						   // 首页
import approval from 'REDUCER/approval'				   // 审批
import busiFinance from 'REDUCER/busiFinance'		   // 财务业务
import busiLease from 'REDUCER/busiLease'			   // 租赁业务
import configLease from 'REDUCER/configLease'		   // 租赁配置
import configBase from 'REDUCER/configBase/insert'     // 基地配置
import configRights from 'REDUCER/configRights'        // 权限配置
import configWe from 'REDUCER/configWe'                // 水电配置

// ================================
// 同步的 Reducers（即应用初始化所必需的）
// ================================
const syncReducers = {
	router: routerReducer,
	login,
	layout,
	userInfo,
	menuList,
	home,
	approval,
	busiFinance,
	busiLease,
	configLease,
	configBase,
	configRights,
	configWe
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
