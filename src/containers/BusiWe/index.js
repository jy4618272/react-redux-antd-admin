// 水电业务-列表页
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import ManualMeter from './Meter/ManualMeter'
import IntelligentMeter from './Meter/IntelligentMeter'

import actionBusi from 'ACTION/busiWe'
const mapDispatchToProps = (dispatch) => ({
    actionBusi: bindActionCreators(actionBusi, dispatch)
})
@connect(
    ({ busiWe }) => ({ busiWe }),
    mapDispatchToProps
)
class WeMeter extends Component {
    constructor(props) {
        super(props);
        console.log('水电业务props:', props);
        this.state = {
            tabs: sessionStorage.getItem('busiWeMeterTabs') ? sessionStorage.getItem('busiWeMeterTabs') : 'busiManualMeter'
        }
        // 初始化获取schema数据
        this.initFetchSchema(props);
    }

    // schema数据
    initFetchSchema = (props) => {
        const routes = props.routes;
        const tableName = routes.pop().tableName;

        if (tableName) {
            console.info('init component BusiWe with tableName = %s', tableName);
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
        sessionStorage.setItem('busiWeMeterTabs', activeKey);
        this.setState({
            tabs: activeKey
        })
    }

    render() {
        const {
            busiWe,
            actionBusi
        } = this.props;

        // 水电业务其他数据
        const otherData = {
            tableName: this.tableName,
            actionBusi
        }
        const manualMeterData = Object.assign({}, {
            manualMeterInput: busiWe.manualMeterInput,
            notConfirmed: busiWe.manualMeterNotConfirmed,
            confirmed: busiWe.manualMeterConfirmed,
        }, otherData);
        const intelligentMeterData = Object.assign({}, busiWe.intelligentMeter, otherData);

        return (
            <section className="m-config m-config-we">
                <Tabs defaultActiveKey={this.state.tabs} type="card" onTabClick={this.handleTabClick}>
                    {/* 后付费 */}
                    <TabPane tab="后付费" key="busiManualMeter">
                        <ManualMeter {...manualMeterData} />
                    </TabPane>

                    {/* 预付费 */}
                    <TabPane tab="预付费" key="busiIntelligentMeter">
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