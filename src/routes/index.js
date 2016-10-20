import React from 'react'
import {
	Router,
	Route,
	IndexRoute,
	hashHistory
} from 'react-router'

// 路由指向
import Layout from 'CONTAINER/Layout'
import Home from 'CONTAINER/Home'

import Busi from 'CONTAINER/BusiFinance/Home'
import BusiFinance from 'CONTAINER/BusiFinance'
import BusiFinanceDetail from 'CONTAINER/BusiFinance/FinanceDetail'

import BusiLease from 'CONTAINER/BusiLease'
import BusiLeaseContractAdd from 'CONTAINER/BusiLease/ContractAdd'

import ConfigBase from 'CONTAINER/ConfigBase'
import ConfigRights from 'CONTAINER/ConfigRights'
import ConfigLease from 'CONTAINER/ConfigLease'
import ConfigLeaseAdd from 'CONTAINER/ConfigLease/LeaseAdd'
import ConfigLeaseEdit from 'CONTAINER/ConfigLease/LeaseEdit'
import ConfigLeaseDetail from 'CONTAINER/ConfigLease/LeaseDetail'

import Err from 'CONTAINER/Err'

/* react router 2.x 必须配置 browserHistory */
const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />

			<Route path="busi">
				<IndexRoute path="busi" component={Busi} />
				<Route path="busi" tableName="busiLease" component={Busi} />
				<Route path="busi_lease" tableName="busiLease" component={BusiLease} />
				<Route path="busi_lease/add" tableName="busiLease" component={BusiLeaseContractAdd} />				
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/:id" component={BusiFinanceDetail} />
			</Route>

			<Route path="config">
				<Route path="config_base" tableName="configBase" component={ConfigBase} />
				<Route path="config_rights" tableName="configRights" component={ConfigRights} />,
				<Route path="config_lease" tableName="configLease" component={ConfigLease} />
				<Route path="config_lease/add" tableName="configLease" component={ConfigLeaseAdd} />
				<Route path="config_lease/edit/:id" tableName="configLease" component={ConfigLeaseEdit} />				
				<Route path="config_lease/:id" tableName="configLease" component={ConfigLeaseDetail} />
			</Route>
		</Route>

		<Route path="*" component={Err} />
	</Router>
);

export default routes;