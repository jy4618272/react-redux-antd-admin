import { message } from 'antd'
import { hashHistory } from 'react-router'
import cookie from 'react-cookie'

import xhr from 'SERVICE'
import { rootPaths, errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MENU_LIST = 'REQUEST_MENU_LIST'
const RECEIVE_MENU_LIST = 'RECEIVE_MENU_LIST'

// ================================
// Action Creator
// ================================
const requestMenuList = () => ({
	type: REQUEST_MENU_LIST
})

const receiveMenuList = (res) => ({
	type: RECEIVE_MENU_LIST,
	payload: res
})

const menuName = (obj, txt) => {
	if(obj === txt){
		return 
	}
}
const fetchMenuList = () => {
	return dispatch => {
		dispatch(requestMenuList())
		xhr('post', paths.financePath + '/maincs/getSysFuncInfo', {}, function (res) {
			const hide = message.loading('正在获取菜单...', 0)
			console.log('左侧菜单返回数据：', res)
			if (res.result === 'success') {
				hide()
				const list = []
				res.data.map(item1 => {
					const obj = {}
					const listSec = []
					if (item1.funcname === '业务中心') {
						obj.key = 'busi'
					} else if (item1.funcname === '园区通配置中心' ) {
						item1.funcname = '配置中心';
						obj.key = 'config';
					}
					obj.name = item1.funcname
					if (item1.sysUrlList && item1.sysUrlList.length) {
						item1.sysUrlList.map(item2 => {
							let icon = ''
							switch(item2.urllink){
								case 'busi_lease': 			// 租赁业务
									icon = 'lease'; 
									break;
								case 'busi_finance':  		// 财务业务
									icon = 'finance-money';
									break;
								case 'busi_asset':  		// 资产业务
									icon = 'assets';
									break;
								
								case 'config_base':  		// 基地配置
									icon = 'base-config';
									break;
								case 'config_lease':  		// 租赁配置
									icon = 'lease-config';
									break;
								case 'config_asset':  		// 资产配置
									icon = 'assets-config';
									break;

								default:
									icon = 'lease'
									break;
							}

							listSec.push({
								key: item2.urllink,
								name: item2.urlname,
								icon: icon
							})
						})
					}
					obj.child = listSec
					list.push(obj)
				})
				console.log('$$$', list)

				dispatch(receiveMenuList(list))
			} else {
				hide()
				if(res.code == '1'){
					hashHistory.push('login')
					// cookie.remove('session_key')
					// window.location.href = rootPaths.configPath + '/myportal/logincs/login'
				}
				errHandler(res.msg)
			}
		})
	}
}

/* default 导出所有 Action Creators */
export default {
	fetchMenuList
}

// ================================
// Action handlers for Reducer
// 本来更新 state 是 Reducer 的责任
// 但要把 ActionType 导出又引入实在太麻烦
// 且在 Reducer 中写 switch-case 实在太不优雅
// 故在此直接给出处理逻辑
// ================================
export const ACTION_HANDLERS = {
	[RECEIVE_MENU_LIST]: (menuList, { payload: res}) => ({
			...menuList,
		loading: false,
		data: res
	})
}


// 