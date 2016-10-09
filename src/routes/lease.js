export default {
	path: 'lease',

	indexRoute: {
		component: require('CONTAINER/RoomState').default
	},

	childRoutes: [
		{path: 'room_state', component: require('CONTAINER/RoomState').default }
	]
}

/**
 * 【拓展】
 * 在 msg 的路由中，Reducer 是在 布局基页 中注入
 * 而在这里就可以在 indexRoute 中注入
 * 这主要取决于 Reducer 的作用范围
 */
