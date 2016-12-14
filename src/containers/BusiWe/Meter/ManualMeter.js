// 水电业务-人工抄表列表页
import React, { Component, PropTypes } from 'react'
import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import ManualMeterNotConfrimed from './ManualMeterNotConfirmed'
import ManualMeterConfrimed from './ManualMeterConfirmed'

class WeMeter extends Component {
    constructor(props) {
        super(props);
        console.log('水电业务人工抄表props:', props);
        this.state = {
            tabs: sessionStorage.getItem('busiWeManualMeterTabs') ? sessionStorage.getItem('busiWeManualMeterTabs') : 'manualMeterNotConfrimed'
        }
    }

    // 选项卡切换
    handleTabClick = (activeKey) => {
        sessionStorage.setItem('busiWeManualMeterTabs', activeKey);
        this.setState({
            tabs: activeKey
        })
    }

    render() {
        const {
            notConfirmed,
            confirmed,
            actionBusi,
            tableName
        } = this.props;

        const otherObj = {
            actionBusi, 
            tableName
        }
        const notConfirmedData = Object.assign({}, notConfirmed, otherObj)
        const confirmedData = Object.assign({}, confirmed, otherObj)

        return (
            <section className="m-busi m-busi-we g-mt-10">
                <Tabs defaultActiveKey={this.state.tabs} onTabClick={this.handleTabClick}>
                    {/* 未提交 */}
                    <TabPane tab="未提交" key="manualMeterNotConfrimed">
                        <ManualMeterNotConfrimed {...notConfirmedData} />
                    </TabPane>

                    {/* 已提交 */}
                    <TabPane tab="已提交" key="manualMeterConfrimed">
                        <ManualMeterConfrimed {...confirmedData} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

WeMeter.propTypes = {

}

export default WeMeter