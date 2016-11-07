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

import Busi from 'CONTAINER/Home/Busi'
import BusiFinance from 'CONTAINER/BusiFinance'
import BusiFinanceShow from 'CONTAINER/BusiFinance/FinanceShow'

import BusiLease from 'CONTAINER/BusiLease'
import ContractAdd from 'CONTAINER/BusiLease/ContractAdd'
import ContractRenew from 'CONTAINER/BusiLease/ContractRenew'
import contractApproval from 'CONTAINER/BusiLease/contractApproval'
import contractApprovalShow from 'CONTAINER/BusiLease/contractApprovalShow'
import ContractChange from 'CONTAINER/BusiLease/ContractChange'

import ContractPay from 'CONTAINER/BusiLease/ContractPay'

import ConfigBase from 'CONTAINER/ConfigBase/insert'
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
				<Route path="busi_lease/contract/add" tableName="busiLease" component={ContractAdd} />				
				<Route path="busi_lease/contract/renew/:id" tableName="busiLease" component={ContractRenew} />
				<Route path="busi_lease/contract/approval" tableName="busiLease" component={contractApproval} />		
				<Route path="busi_lease/contract/approval/:id" tableName="busiLease" component={contractApprovalShow} />		
				<Route path="busi_lease/contract/change/:id" tableName="busiLease" component={ContractChange} />			
				<Route path="busi_lease/contract/pay" tableName="busiLease" component={ContractPay} />				
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/:id" component={BusiFinanceShow} />
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