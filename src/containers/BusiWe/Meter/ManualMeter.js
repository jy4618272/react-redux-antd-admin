// 水电业务-人工抄表列表页
import React, { Component, PropTypes } from 'react'
import {
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import ManualMeterInput from './ManualMeterInput'
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
            manualMeterInput,
            notConfirmed,
            confirmed,
            actionBusi,
            tableName
        } = this.props;

        const otherObj = {
            actionBusi, 
            tableName
        }
        const inputData = Object.assign({}, manualMeterInput, otherObj);
        const notConfirmedData = Object.assign({}, notConfirmed, otherObj);
        const confirmedData = Object.assign({}, confirmed, otherObj);
        return (
            <section className="m-busi m-busi-we g-mt-10">
                <Tabs defaultActiveKey={this.state.tabs} onTabClick={this.handleTabClick}>
                    {/* 水电录入 */}
                    <TabPane tab="水电录入" key="manualMeterInput">
                        <ManualMeterInput {...inputData} />
                    </TabPane>    
                    {/* 提交财务 */}
                    <TabPane tab="提交财务" key="manualMeterNotConfrimed">
                        <ManualMeterNotConfrimed {...notConfirmedData} />
                    </TabPane>

                    {/* 水电管理 */}
                    <TabPane tab="水电管理" key="manualMeterConfrimed">
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