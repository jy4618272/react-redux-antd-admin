import React, { Component } from 'react'

import {
    Steps,
    Tabs
} from 'antd'

const TabPane = Tabs.TabPane

const Step = Steps.Step

import StepsComponent from 'COMPONENT/BusiAsset/component/stepsComponent'
import MobileAsset from 'COMPONENT/BusiAsset/newAsset/mobileAsset'
import EasyGoods from 'COMPONENT/BusiAsset/newAsset/easyGoods'
import FixedAsset from 'COMPONENT/BusiAsset/newAsset/fixedAsset'

class NewAsset extends Component {
    constructor() {
        super()
        this.state = {
            current: 3,  // 表示当前进度
            steps: [  // stepsComponent
                { title: '内勤', description: '张琪亚 ｜ 新增' },
                { title: '管理员', description: '李媛风 ｜ 审核' },
                { title: '财务员', description: '母庆业 ｜ 审核' },
                { title: '完成', description: '' }
            ]
        }
    }
    /**
     *  根据参数，设置tab 
     *  /:assetType/:id/:isModify
     * :assetType   1|动产  2|不动产   3|易耗品
     * :isModify  false|修改   true|新建
     */
    getTabGroup() {
        const { assetType, id, isModify } = this.props.params

        const tab1 = (
            <TabPane tab="动产" key="1">
                <MobileAsset />
            </TabPane>
        )
        const tab2 = (
            <TabPane tab="不动产" key="2">
                <FixedAsset />
            </TabPane>
        )
        const tab3 = (
            <TabPane tab="易耗品" key="3">
                <EasyGoods />
            </TabPane>
        )

        if (isModify == 'false') {
            //新建
            return [tab1, tab2, tab3]
        } else if (assetType == 1) {
            return [tab1]
        } else if (assetType == 2) {
            return [tab2]
        } else if (assetType == 3) {
            return [tab3]
        }
    }

    /**
     * 渲染
     * 
     */
    render() {
        return (
            <div>
                {/** 步骤条 */}
                <StepsComponent current={this.state.current} steps={this.state.steps} />

                {/** tab：动产／不动产／易耗品 */}
                <div style={{ margin: '30px 20px' }}>
                    <Tabs type="card">
                        {this.getTabGroup()}
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default NewAsset