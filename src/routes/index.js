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
import BusiApproval from 'CONTAINER/Busi/approval'
import BusiApprovalShow from 'CONTAINER/Busi/approvalDetail'
import BusiFinance from 'CONTAINER/BusiFinance'
import BusiFinanceList from 'CONTAINER/BusiFinance/FinanceList'
import BusiFinanceShow from 'CONTAINER/BusiFinance/FinanceShow'

import BusiLease from 'CONTAINER/BusiLease'
import BusiLeaseInsert from 'CONTAINER/BusiLease/insert'
import BusiLeaseShow from 'CONTAINER/BusiLease/LeaseShow'
import ContractAdd from 'CONTAINER/BusiLease/Contract/insert'
import ContractRenew from 'CONTAINER/BusiLease/Contract/renew'
import ContractChange from 'CONTAINER/BusiLease/Contract/change'
import ContractRent from 'CONTAINER/BusiLease/Contract/rent'
import ContractPay from 'CONTAINER/BusiLease/Contract/pay'

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
				{/* 审批 */}
				<Route path="approval" tableName="busiLease" component={BusiApproval} />
				<Route path="approval/:id" tableName="busiLease" commonName="common" component={BusiApprovalShow} />
				
				{/* 财务-财务详情*/}
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/finance_list" tableName="busiFinance" component={BusiFinanceList} />
				<Route path="busi_finance/:id" tableName="busiFinance" commonName="common" component={BusiFinanceShow} />

				<Route path="busi_lease" tableName="busiLease" component={BusiLease} />
				<Route path="busi_lease/add" tableName="busiLease" component={BusiLeaseInsert} />
				<Route path="busi_lease/:id" tableName="busiLease" commonName="common" component={BusiLeaseShow} />
				{/* 新增合同 */}
				<Route path="busi_lease/contract/add" tableName="busiLease" component={ContractAdd} />
				{/* 续租合同 */}
				<Route path="busi_lease/contract/renew/:id" tableName="busiLease" component={ContractRenew} />

				{/* 变更合同/编辑合同 */}
				<Route path="busi_lease/contract/change/:id" tableName="busiLease" component={ContractChange} />
				{/* 退租合同 */}
				<Route path="busi_lease/contract/rent/:id" tableName="busiLease" component={ContractRent} />

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