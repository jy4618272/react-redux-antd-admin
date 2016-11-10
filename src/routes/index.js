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
import BusiFinanceList from 'CONTAINER/BusiFinance/FinanceList'
import BusiFinanceShow from 'CONTAINER/BusiFinance/FinanceShow'

import BusiLease from 'CONTAINER/BusiLease'
import ContractAdd from 'CONTAINER/BusiLease/ContractAdd'
import ContractRenew from 'CONTAINER/BusiLease/ContractRenew'
import ContractChange from 'CONTAINER/BusiLease/ContractChange'
import ContractRent from 'CONTAINER/BusiLease/ContractRent'

import ContractApproval from 'CONTAINER/BusiLease/contractApproval'
import ContractApprovalShow from 'CONTAINER/BusiLease/contractApprovalShow'

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
				{/* 财务-财务详情*/}				
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/finance_list" tableName="busiFinance" component={BusiFinanceList} />
				<Route path="busi_finance/:id" tableName="busiFinance" commonName="common" component={BusiFinanceShow} />

				{/* 新增合同 */}				
				<Route path="busi_lease/contract/add" tableName="busiLease" component={ContractAdd} />
				{/* 续租合同 */}				
				<Route path="busi_lease/contract/renew/:id" tableName="busiLease" component={ContractRenew} />
				
				{/* 变更合同/编辑合同 */}				
				<Route path="busi_lease/contract/change/:id" tableName="busiLease" component={ContractChange} />
				{/* 退租合同 */}
				<Route path="busi_lease/contract/rent/:id" tableName="busiLease" component={ContractRent} />

				{/* 审批合同 */}
				<Route path="busi_lease/contract/approval" tableName="busiLease" component={ContractApproval} />
				<Route path="busi_lease/contract/approval/:id" tableName="busiLease" commonName="common" component={ContractApprovalShow} />

				{/* 合同交款 */}
				<Route path="busi_lease/contract/pay" tableName="busiLease" component={ContractPay} />
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