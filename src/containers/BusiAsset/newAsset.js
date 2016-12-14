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

import MobileAsset from 'COMPONENT/BusiAsset/newAsset/mobileAsset'
import EasyGoods from 'COMPONENT/BusiAsset/newAsset/easyGoods'
import FixedAsset from 'COMPONENT/BusiAsset/newAsset/fixedAsset'

import AssetForm from 'COMPONENT/BusiAsset/newAsset/AssetForm'

class NewAsset extends Component {
    constructor() {
        super()
        this.state = {
            flow: '', // 流程组件
            assetType: '动产' // 记录cards的资产类型，默认要新增的是动产
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

        // addAssetType 1｜2｜3 分别是：动产｜不动产｜低值易耗品
        const tab1 = (
            <TabPane tab="动产" key="1">
                <AssetForm addAssetType="1"/>
            </TabPane>
        )
        const tab2 = (
            <TabPane tab="不动产" key="2">
                <AssetForm addAssetType="2"/>
            </TabPane>
        )
        const tab3 = (
            <TabPane tab="易耗品" key="3">
                <AssetForm addAssetType="3"/>
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
     * 
     * 
     * */
    componentWillMount() {
        this.getFlowInfo()
    }

    /**
     * 获取流程信息
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/rentpactcs/selectWorkFlowByType
     * 
     *  参数
     *      type  String  动产｜不动产｜低值易耗品     默认：动产
     *      modelname: ''
     */
    getFlowInfo() {
        const arg = {
            type: '新增', // 等接口好了改为：this.state.assetType
            modelname: 111   //  等接口好了改为： 此处传 ''，固定的参数
        }
        xhr('post', paths.leasePath + '/rentpactcs/selectWorkFlowByType', arg, (res) => {
            if (res.result == 'success') { // 查询成功
                this.setState({
                    flow: <WorkFlow flow={res} />
                })
            } else {  // 查询失败
                errHandler(res.msg)
            }
        })
    }

    /**
     * 渲染
     *  
     */
    render() {
        return (
            <div>
                {/** 审核流程-步骤条 <WorkFlow flow={approval.workFlow} />*/}
                <Cards title="审核流程">
                    {this.state.flow}
                </Cards>

                {/** tab：动产／不动产／易耗品 */}
                <Cards title="资产信息">      
                    <Tabs>
                        {this.getTabGroup()}
                    </Tabs>
                </Cards>
            </div>
        )
    }
}

export default NewAsset