/**
 *  将页面分为四个模块
 *      流程 flow
 *      资产信息展示 assetInfoDisplay
 *      操作信息 operateInfo
 *      操作表单 IsAgreeForm
 * 
 * this.props
 *  id  业务号 
 * 
 */

import React, { Component } from 'react'

// 展示资产信息
import AssetInfo from 'COMPONENT/BusiAsset/component/assetInfoDisplay'

// 同意、不同意表单 
import IsAgreeForm from 'COMPONENT/BusiAsset/checkAsset/isAgreeForm'

// ajax 工具
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import { getCheckWorkFlow } from 'COMPONENT/BusiAsset/component/workFlowDisplay'
import DisplayDetials from 'COMPONENT/BusiAsset/component/displayDetails'

import {
    Cards,
    WorkFlow,
} from 'COMPONENT'

class CheckAsset extends Component {
    constructor() {
        super()
        this.state = {
            flow: '',
            assetInfoDisplay: '',
            operateInfo: '',
        }
    }

    /**
     * 初始化
     * 
     */
    componentWillMount() {
        // id是资产审核的业务号
        const { id } = this.props

        // init01: 初始化流程状态图
        this.setFlow()

        console.log('业务号：', id)
        xhr('post', paths.workFlowPath + '/flowrecordcs/selectFlowDetailsByBusinessNo', {
            businessno: id
        }, (res) => {
            console.log('流程信息', res)
            if (res.result == 'success') {
                const { assetid, flowstatus } = res.data

                /**
                 * 如果不是新增，需要获取一下操作信息
                 */
                if (flowstatus.search('新增-') == -1) {
                    // init03: 审核提示信息
                    this.getCheckInfo()
                }

                // init02: 获取到资产id后，展示资产信息
                this.setAssetInfoDisplay(assetid)
            } else {
                errHandler(res.msg)
            }

        })
    }

    /**
     * 设置资产信息展示
     * 
     */
    setAssetInfoDisplay(assetid) {
        this.setState({
            assetInfoDisplay: <AssetInfo assetid={assetid} />
        })
    }

    /**
     * 获取审核提示信息
     *  http://myportaltest.tf56.com:8080/workflowAdmin/flowrecordcs/selectAssetCZByBusinessNo
     *  
     *  参数：
     *      businessno 业务号
     */
    getCheckInfo() {
        xhr('post', paths.workFlowPath + '/flowrecordcs/selectAssetCZByBusinessNo', {
            businessno: this.props.id
        }, (res) => {
            // todo  初始化审核提示信息
            if (res.result == 'success') {
                const {
                    disposition, dispositionmoney,
                    toassetarealist, toowner, toassetdeplist,
                    memo
                } = res.data
                const data = {
                    disposition, dispositionmoney,
                    toassetarealist, toowner, toassetdeplist,
                    memo
                }

                this.setState({
                    operateInfo: <DisplayDetials title={res.data.changetype + "信息"} displayData={data} />
                })
            } else {
                errHandler(res.msg)
            }
        })
    }

    /**
     *  设置流程图
     * 
     */
    setFlow() {
        // id为业务号
        const { id } = this.props

        const arg = {
            businessno: id, // 业务号
            pactkind: ''   //  固定参数 ''
        }

        getCheckWorkFlow(arg).then((data) => {
            this.setState({
                flow: <WorkFlow flow={data} />
            })
        }, (error) => {
            errHandler(error)
        })
    }

    /**
     * 渲染
     * */
    render() {
        const { flow, operateInfo, assetInfoDisplay } = this.state
        return (
            <div>
                <div>
                    {/* 审核流程 */}
                    <Cards title="审核流程">
                        {flow}
                    </Cards>
                </div>
                <div>
                    {/* 资产信息的展示 */}
                    {assetInfoDisplay}
                </div>
                <div>
                    {/* 审核信息 */}
                    {operateInfo}
                </div>
                <div>
                    {/* 审核表单 */}
                    <IsAgreeForm id={this.props.id} />
                </div>
            </div>
        )
    }
}


export default CheckAsset