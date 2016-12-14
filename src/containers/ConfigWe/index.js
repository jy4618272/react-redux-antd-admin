import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import RateList from './List/RateList'
import RoomList from './List/RoomList'
import PrintList from './List/PrintList'

import actionConfig from 'ACTION/configWe'
const mapDispatchToProps = (dispatch) => ({
    actionConfig: bindActionCreators(actionConfig, dispatch)
})
@connect(
    ({ configWe }) => ({ configWe }),
    mapDispatchToProps
)
class We extends Component {
    constructor(props) {
        super(props);
        console.log('水电配置props:', props);
        this.state = {
            tabs: sessionStorage.getItem('configWeTabs') ? sessionStorage.getItem('configWeTabs') : 'configWeRate'
        }
        // 初始化获取schema数据
        this.initFetchSchema(props);
    }

    // schema数据
    initFetchSchema = (props) => {
        const routes = props.routes;
        const tableName = routes.pop().tableName;
        
        if (tableName) {
            console.info('init component ConfigWe with tableName = %s', tableName);
        } else {
            console.error('can not find tableName, check your route config');
            this.inited = false;
            this.errorMsg = '找不到表名，请检查路由配置';
            return false;
        }

        this.tableName = tableName;
        this.inited = true;
    }

    // 选项卡切换
    handleTabClick = (activeKey) => {
        sessionStorage.setItem('configWeTabs', activeKey);
        this.setState({
            tabs: activeKey
        })
    }

    render() {
        const {
            configWe,
            actionConfig
        } = this.props;

        // 单价倍率配置数据
        const otherData = {
            tableName: this.tableName,
            actionConfig
        }
        const rateListData = Object.assign({}, configWe.rateList, otherData);
        const roomListData = Object.assign({}, configWe.roomList, otherData);
        const printListData = Object.assign({}, configWe.printList, otherData);

        return (
            <section className="m-config m-config-we">
                <Tabs defaultActiveKey={this.state.tabs} type="card" onTabClick={this.handleTabClick}>
                    {/* 单价倍率配置 */}
                    <TabPane tab="单价倍率配置" key="configWeRate">
                        <RateList {...rateListData} />
                    </TabPane>
                    {/* 房间客户配置 */}
                    <TabPane tab="房间客户配置" key="configWeRoom">
                        <RoomList {...roomListData} />
                    </TabPane>
                    {/* 打印参数配置 */}
                    <TabPane tab="打印参数配置" key="configWePrint">
                        <PrintList {...printListData} />                        
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

We.propTypes = {

}

export default We