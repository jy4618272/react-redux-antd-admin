/**
 * 配置中心 
 */
// import createContainer from 'UTIL/createContainer'

export default {
	path: 'config',

	indexRoute: {
		component: require('CONTAINER/Config/Base').default
	},

	childRoutes: [
		{ path: 'config_base', tableName: 'test', component: require('CONTAINER/Config/Base').default },
		{ path: 'config_rights', tableName: 'test', component: require('CONTAINER/Config/Rights').default },
		{ path: 'config_lease', tableName: 'test', component: require('CONTAINER/Config/Lease').default }
	]
}
