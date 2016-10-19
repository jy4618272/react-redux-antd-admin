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
	BusiFinance,
	BusiFinanceDetail,
	BusiLease,
	ConfigBase,
	ConfigRights,
	ConfigLease,
	ConfigLeaseAdd,
	ConfigLeaseEdit,	
	ConfigLeaseRoomDetail,
	ConfigLeaseClassLineDetail,
	ConfigLeasePolicyDetail,
	ConfigLeaseManagerDetail,
	ConfigLeaseContractDetail,
	ConfigLeaseAuditDetail,
} from 'CONTAINER'

/* react router 2.x 必须配置 browserHistory */
const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />

			<Route path="busi">
				<IndexRoute path="busi" component={BusiLease} />
				<Route path="busi_lease" tableName="busiLease" component={BusiLease} />,
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/:id" component={BusiFinanceDetail} />
			</Route>

			<Route path="config">
				<Route path="config_base" tableName="configBase" component={ConfigBase} />
				<Route path="config_rights" tableName="configRights" component={ConfigRights} />,
				<Route path="config_lease" tableName="configLease" component={ConfigLease} />
				<Route path="config_lease/add" tableName="configLease" component={ConfigLeaseAdd} />
				<Route path="config_lease/edit/:id" tableName="configLease" component={ConfigLeaseEdit} />				
				<Route path="config_lease/room/:id" tableName="configLease" component={ConfigLeaseRoomDetail} />
				<Route path="config_lease/line/:id" component={ConfigLeaseClassLineDetail} />
				<Route path="config_lease/policy/:id" component={ConfigLeasePolicyDetail} />
				<Route path="config_lease/manager/:id" component={ConfigLeaseManagerDetail} />
				<Route path="config_lease/contract/:id" component={ConfigLeaseContractDetail} />
				<Route path="config_lease/audit/:id" component={ConfigLeaseAuditDetail} />
			</Route>
		</Route>

		<Route path="*" component={Err} />
	</Router>
);

export default routes;