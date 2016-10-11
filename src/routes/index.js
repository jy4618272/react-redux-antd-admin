import React from 'react'
import {
	Router,
	Route,
	IndexRoute,
	hashHistory
} from 'react-router'

// 路由指向
import {
	Layout,
	Home,
	Err,
	Busi,
	RoomState,
	Finance,
	FinanceDetail,
	ConfigBase,
	ConfigRights,
	ConfigLease
} from 'CONTAINER'

/* react router 2.x 必须配置 browserHistory */
const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />
			
			<Route path="busi">
				<IndexRoute path="busi" component={Finance}/>
				<Route path="busi_lease" tableName="busi" component={RoomState} />,
				<Route path="busi_finance" tableName="busi" component={Finance} />
				<Route path="busi_finance/:id" component={FinanceDetail} />
			</Route>

			<Route path="config">
				<Route path="config_base" component={ConfigBase}/>
				<Route path="config_rights" component={ConfigRights} />,
				<Route path="config_lease" component={ConfigLease} />
			</Route>
		</Route>

		<Route path="*" component={Err}/>
	</Router>
);

export default routes;