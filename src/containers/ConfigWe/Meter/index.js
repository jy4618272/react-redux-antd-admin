import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import ManualMeter from './ManualMeter'
import IntelligentMeter from './IntelligentMeter'

import actionConfig from 'ACTION/configWe'
const mapDispatchToProps = (dispatch) => ({
    actionConfig: bindActionCreators(actionConfig, dispatch)
})
@connect(
    ({ configWe }) => ({ configWe }),
    mapDispatchToProps
)
class WeMeter extends Component {
    constructor(props) {
        super(props);
        console.log('水电配置抄表props:', props);
        this.state = {
            tabs: sessionStorage.getItem('configWeMeterTabs') ? sessionStorage.getItem('configWeMeterTabs') : 'configManualMeter'
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
        sessionStorage.setItem('configWeMeterTabs', activeKey);
        this.setState({
            tabs: activeKey
        })
    }

    render() {
        const {
            location,
            configWe,
            actionConfig
        } = this.props;

        // 单价倍率配置数据
        const otherData = {
            tableName: this.tableName,
            query: location.query,
            actionConfig            
        };

        const manualMeterData = Object.assign({}, configWe.manualMeter, otherData);
        const intelligentMeterData = Object.assign({}, configWe.intelligentMeter, otherData);

        return (
            <section className="m-config m-config-we">
                <Tabs defaultActiveKey={this.state.tabs} type="card" onTabClick={this.handleTabClick}>
                    {/* 人工抄表 */}
                    <TabPane tab="人工抄表" key="configManualMeter">
                        <ManualMeter {...manualMeterData} />
                    </TabPane>

                    {/* 智能表 */}
                    <TabPane tab="智能表" key="configIntelligentMeter">
                        <IntelligentMeter {...intelligentMeterData} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

WeMeter.propTypes = {

}

export default WeMeter