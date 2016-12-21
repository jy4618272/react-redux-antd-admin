import React, { Component } from 'react'

import {
    Steps,
    Tabs,
    Spin
} from 'antd'

const TabPane = Tabs.TabPane

const Step = Steps.Step

import {
    Cards,
    WorkFlow,
} from 'COMPONENT'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import AssetForm from 'COMPONENT/BusiAsset/newAsset/AssetForm'

import { getNewAssetWorkFlow } from 'COMPONENT/BusiAsset/component/workFlowDisplay'

class NewAsset extends Component {
    constructor() {
        super()
        this.state = {
            flow: '', // 流程组件
            assetType: '动产' // 记录cards的资产类型，默认要新增的是动产
        }
    }

    /**
     * 
     * 
     */
    componentWillMount() {
        this.setState({
            tabGroup: this.getTabGroup()
        })
    }

    /**
     *  根据参数，设置tab 
     *  /:assetType/:id/:isModify
     * :assetType   1|动产  2|不动产   3|易耗品
     * :isModify  false|修改   true|新建
     */
    getTabGroup() {
        const { assetType, id, isModify } = this.props.params

        // addAssetType 1｜2｜3 分别是：动产｜不动产｜低值易耗品
        // assetid  资产id
        const tab1 = (
            <TabPane tab="动产" key="1">
                <AssetForm addAssetType="1" assetid={id} />
            </TabPane>
        )
        const tab2 = (
            <TabPane tab="不动产" key="2">
                <AssetForm addAssetType="2" assetid={id} />
            </TabPane>
        )
        const tab3 = (
            <TabPane tab="易耗品" key="3">
                <AssetForm addAssetType="3" assetid={id} />
            </TabPane>
        )

        if (isModify == 'false') {
            //新建
            this.setWorkFlow({ type: '动产新增' })
            return [tab1, tab2, tab3]
        } else if (assetType == 1) {
            this.setWorkFlow({ type: '动产新增' })
            return [tab1]
        } else if (assetType == 2) {
            this.setWorkFlow({ type: '不动产新增' })
            return [tab2]
        } else if (assetType == 3) {
            this.setWorkFlow({ type: '低值易耗品新增' })
            return [tab3]
        }
    }

    /** 
     *  设置流程图
     *  arg {type: ''}
     */
    setWorkFlow(arg) {
        getNewAssetWorkFlow(arg).then((data) => {
            this.setState({
                flow: <WorkFlow flow={data} />
            })
        }, (error) => {
            errHandler(error)
        })
    }

    /**
     * tab 切换
     *  key 是指第几个tab， 1｜动产， 2｜不动产， 3｜低值易耗品
     */
    tabChange(key) {
        if (key == 1) {
            this.setWorkFlow({ type: '动产新增' })
        } else if (key == 2) {
            this.setWorkFlow({ type: '不动产新增' })
        } else if (key == 3) {
            this.setWorkFlow({ type: '低值易耗品新增' })
        }
    }

    /**
     * 渲染
     *  
     */
    render() {
        const { flow, tabGroup } = this.state

        return (
            <div>
                {/** 审核流程-步骤条 <WorkFlow flow={flow} />*/}
                <Cards title="审核流程">
                    {flow}
                </Cards>

                {/** tab：动产／不动产／易耗品 */}
                <Cards title="资产信息">
                    <Tabs onChange={this.tabChange.bind(this)}>
                        {tabGroup}
                    </Tabs>
                </Cards>
            </div>
        )
    }
}

export default NewAsset