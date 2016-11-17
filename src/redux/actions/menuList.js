import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

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

const fetchMenuList = () => {
	return dispatch => {
		dispatch(requestMenuList())
		xhr('post', paths.financePath + '/maincs/getSysFuncInfo', {}, function (res) {
			const hide = message.loading('正在获取菜单...', 0)
			console.log('导航', res)
			if (res.result === 'success') {
				hide()
				const list = []
				res.data.map(item1 => {
					const obj = {}
					const listSec = []
					if (item1.funcname.indexOf('业务中心') > -1) {
						obj.key = 'busi'
						obj.icon = 'home'
					} else if (item1.funcname.indexOf('配置中心') > -1) {
						obj.key = 'config'
						obj.icon = 'home'
					}
					obj.name = item1.funcname
					if (item1.sysUrlList) {
						item1.sysUrlList.map(item2 => {
							listSec.push({
								key: item2.urllink,
								name: item2.urlname
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
				// window.location.href = 'http://myportaltest.tf56.com/myportal/logincs/login'
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