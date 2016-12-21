import React from 'react'
import {
	Router,
	Route,
	IndexRoute,
	hashHistory
} from 'react-router'
import cookie from 'react-cookie'

/******************** 首页及框架 ********************/
// 架构
import Layout from 'CONTAINER/Layout'
// 首页
import Home from 'CONTAINER/Home'

/******************** 审批 ********************/
import Login from 'CONTAINER/Login/login'

/******************** 审批 ********************/
import Approval from 'CONTAINER/Approval/approval'
import ApprovalShow from 'CONTAINER/Approval/ApprovalDetail'


/******************** 业务 ********************/
import Busi from 'CONTAINER/Home/Busi'
// 财务
import BusiFinance from 'CONTAINER/BusiFinance'
import BusiFinanceList from 'CONTAINER/BusiFinance/FinanceList'
import BusiFinanceShow from 'CONTAINER/BusiFinance/FinanceShow'
// 租赁
import BusiLease from 'CONTAINER/BusiLease'
import BusiLeaseInsert from 'CONTAINER/BusiLease/insert'
import BusiLeaseShow from 'CONTAINER/BusiLease/LeaseShow'
import ContractAdd from 'CONTAINER/BusiLease/Contract/insert'
import ContractRenew from 'CONTAINER/BusiLease/Contract/renew'
import ContractChange from 'CONTAINER/BusiLease/Contract/change'
import ContractRent from 'CONTAINER/BusiLease/Contract/rent'
import ContractPay from 'CONTAINER/BusiLease/Contract/pay'
// 资产
import AssetList from 'CONTAINER/BusiAsset/assetList'
import AssetOperate from 'CONTAINER/BusiAsset/assetOperate'
import AddAsset from 'CONTAINER/BusiAsset/newAsset'
import AssetDetail from 'CONTAINER/BusiAsset/assetDetail'
// 水电
import BusiWeList from 'CONTAINER/BusiWe'
import BusiWeShow from 'CONTAINER/BusiWe/Meter/Detail'
/******************** 配置 ********************/
// 基地
import ConfigBase from 'CONTAINER/ConfigBase/insert'
// 权限
import ConfigRights from 'CONTAINER/ConfigRights'
// 租赁
import ConfigLease from 'CONTAINER/ConfigLease'
import ConfigLeaseAdd from 'CONTAINER/ConfigLease/LeaseAdd'
import ConfigLeaseEdit from 'CONTAINER/ConfigLease/LeaseEdit'
import ConfigLeaseDictionary from 'CONTAINER/ConfigLease/Dictionary'
import ConfigLeaseDetail from 'CONTAINER/ConfigLease/LeaseDetail'
// 资产
import ConfigAsset from 'CONTAINER/ConfigAsset/configAsset'
// 水电
import ConfigWeList from 'CONTAINER/ConfigWe'
import ConfigWeMeter from 'CONTAINER/ConfigWe/Meter'

/******************** 打印 ********************/
import PrintPage from 'CONTAINER/Print/index'


/******************** 404 ********************/
import NotFound from 'CONTAINER/NotFound'

const requireAuth = (nextState, replace) => {
	console.log('nextState', nextState)
	if (!cookie.load('session_key')) {
		replace({
			pathname: 'login',
			state: { nextPathname: nextState.location.pathname.slice(1) }
		})
	}
}
/* react router 2.x 必须配置 browserHistory */
const routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout} onEnter={requireAuth}>
			<IndexRoute component={Home} />

			{/* 审批 */}
			<Route path="approval">
				<IndexRoute path="approval" component={Approval} />
				<Route path=":id" commonName="common" component={ApprovalShow} />
			</Route>

			{/* 业务 */}
			<Route path="busi">
				<IndexRoute path="busi" component={Busi} />
				{/* 财务 */}
				<Route path="busi_finance" tableName="busiFinance" component={BusiFinance} />
				<Route path="busi_finance/finance_list" tableName="busiFinance" component={BusiFinanceList} />
				<Route path="busi_finance/:id" tableName="busiFinance" commonName="common" component={BusiFinanceShow} />
				
				{/* 租赁 */}
				<Route path="busi_lease" tableName="busiLease" component={BusiLease} />
				<Route path="busi_lease/add" tableName="busiLease" component={BusiLeaseInsert} />
				<Route path="busi_lease/:id" tableName="busiLease" commonName="common" component={BusiLeaseShow} />
				<Route path="busi_lease/contract/add" tableName="busiLease" component={ContractAdd} />
				<Route path="busi_lease/contract/renew/:id" tableName="busiLease" component={ContractRenew} />
				<Route path="busi_lease/contract/change/:id" tableName="busiLease" component={ContractChange} />
				<Route path="busi_lease/contract/rent/:id" tableName="busiLease" component={ContractRent} />
				<Route path="busi_lease/contract/pay" tableName="busiLease" component={ContractPay} />

				{/* 资产 */}
				<Route path="busi_asset" component={AssetList} />
				<Route path="busi_asset/add/:assetType/:id/:isModify" component={AddAsset} />
				<Route path="busi_asset/operate/:assetType/:id/:isModify/:operateType" component={AssetOperate} />
				<Route path="busi_asset/asset_detail/:id" component={AssetDetail} />

				{/* 水电 */}
				<Route path="busi_we" tableName="busiWe" component={ BusiWeList } />
				<Route path="busi_we/:id" component={ BusiWeShow } />
			</Route>

			{/* 配置 */}
			<Route path="config">
				{/* 基地 */}
				<Route path="config_base" tableName="configBase" component={ConfigBase} />

				{/* 权限 */}
				<Route path="config_rights" tableName="configRights" component={ConfigRights} />

				{/* 租赁 */}
				<Route path="config_lease" tableName="configLease" component={ConfigLease} />
				<Route path="config_lease/add" tableName="configLease" component={ConfigLeaseAdd} />
				<Route path="config_lease/edit/:id" tableName="configLease" component={ConfigLeaseEdit} />
				<Route path="config_lease/dictionary" component={ConfigLeaseDictionary} />
				<Route path="config_lease/:id" tableName="configLease" component={ConfigLeaseDetail} />

				{/* 资产 */}
				<Route path="config_asset" component={ConfigAsset} />

				{/* 水电 */}
				<Route path="config_we" tableName="configWe" component={ ConfigWeList } />
				<Route path="config_we_meter" tableName="configWe" component={ ConfigWeMeter } />
			</Route>
		</Route>

		{/* 登录 */}
		<Route path="login">
			<IndexRoute component={Login} />
		</Route>

		{/* 打印 */}
		<Route path="print">
			<Route path="printPreview/:id" component={PrintPage}/>	
		</Route>

		{/* 404 */}
		<Route path="*" component={NotFound} />
	</Router>
);

export default routes;