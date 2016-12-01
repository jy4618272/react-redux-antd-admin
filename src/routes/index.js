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
import Approval from 'CONTAINER/Approval/approval'
import ApprovalShow from 'CONTAINER/Approval/ApprovalDetail'

import Busi from 'CONTAINER/Home/Busi'
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

// 资产业务
import AssetList from 'CONTAINER/BusiAsset/assetList'
import AssetOperate from 'CONTAINER/BusiAsset/assetOperate'
import AddAsset from 'CONTAINER/BusiAsset/newAsset'
import CheckAsset from 'CONTAINER/BusiAsset/checkAsset'
import AssetDetail from 'CONTAINER/BusiAsset/assetDetail'
// 资产配置
import ConfigAsset from 'CONTAINER/ConfigAsset/configAsset'

// 打印
import PrintPage from 'CONTAINER/Print/index'

import ConfigBase from 'CONTAINER/ConfigBase/insert'
import ConfigRights from 'CONTAINER/ConfigRights'
import ConfigLease from 'CONTAINER/ConfigLease'
import ConfigLeaseAdd from 'CONTAINER/ConfigLease/LeaseAdd'
import ConfigLeaseEdit from 'CONTAINER/ConfigLease/LeaseEdit'
import ConfigLeaseDictionary from 'CONTAINER/ConfigLease/Dictionary'
import ConfigLeaseDetail from 'CONTAINER/ConfigLease/LeaseDetail'

import NotFound from 'CONTAINER/NotFound'

/* react router 2.x 必须配置 browserHistory */
const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />

			{/* 审批 */}
			<Route path="approval">
				<IndexRoute path="approval" component={Approval} />
				<Route path=":id" commonName="common" component={ApprovalShow} />
			</Route>

			<Route path="busi">
				<IndexRoute path="busi" component={Busi} />

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

				{/* 资产业务 */}
				<Route path="busi_asset" component={AssetList} />
				<Route path="busi_asset/add/:assetType/:id/:isModify" component={AddAsset} />
				<Route path="busi_asset/operate/:assetType/:id/:isModify/:operateType" component={AssetOperate} />
				<Route path="busi_asset/check_asset/:id" component={CheckAsset} />
				<Route path="busi_asset/asset_detail/:id" component={AssetDetail} />

			</Route>

			<Route path="config">
				<Route path="config_base" tableName="configBase" component={ConfigBase} />
				<Route path="config_rights" tableName="configRights" component={ConfigRights} />,
				<Route path="config_lease" tableName="configLease" component={ConfigLease} />
				<Route path="config_lease/add" tableName="configLease" component={ConfigLeaseAdd} />
				<Route path="config_lease/edit/:id" tableName="configLease" component={ConfigLeaseEdit} />
				<Route path="config_lease/dictionary" component={ConfigLeaseDictionary} />
				<Route path="config_lease/:id" tableName="configLease" component={ConfigLeaseDetail} />
				<Route path="config_asset" component={ConfigAsset} />
			</Route>
		</Route>

		{/* 打印页面 */}
		<Route path="print">
			<Route path="printPreview/:id" component={PrintPage}/>	
		</Route>

		<Route path="*" component={NotFound} />
	</Router>
);

export default routes;