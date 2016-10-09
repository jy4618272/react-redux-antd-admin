/**
 * 业务中心 */
// import createContainer from 'UTIL/createContainer'

export default {
	path: 'busi',

	indexRoute: {
		component: require('CONTAINER/Busi').default
	},

	childRoutes: [
		{ path: 'busi_lease', tableName: 'busi', component: require('CONTAINER/Busi/RoomState').default },
		{ path: 'busi_finance', tableName: 'busi', component: require('CONTAINER/Busi/Finance').default }
	]
}


/**
 * 【拓展】
 * 在 msg 的路由中，Reducer 是在 布局基页 中注入
 * 而在这里就可以在 indexRoute 中注入
 * 这主要取决于 Reducer 的作用范围
 */
