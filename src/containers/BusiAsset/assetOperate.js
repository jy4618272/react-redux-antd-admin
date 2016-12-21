/**
 * 操作资产：调拨，闲置，报废，处置
 * 
 * 
 * 
 */
import React, { Component } from 'react'

// 展示资产信息3
import AssetInfo from 'COMPONENT/BusiAsset/component/assetInfoDisplay'

// 不同操作类型用到的组件
import AssetOperateForm from 'COMPONENT/BusiAsset/assetOperate/assetOperateForm'

// ajax 工具
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

// 
import {
    Cards,
    WorkFlow,
} from 'COMPONENT'

class AssetOperate extends Component {
    constructor() {
        super()
        this.state = {
            flow: '', // 流程组件
            operateAsset: '',  // 不同的操作，UI也不同
            operateTitle: '' // 操作表单cards的title
        }
    }
    /**
     * 
     * 
     */
    componentWillMount() {
        // 流程审核
        this.getFlowInfo()

        // 设置处理表单
        this.handleParams()
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
     * DOM第一次挂在完成
     * 
     */
    componentDidMount() {

    }

    /**
     * 处理url中的参数/:assetType/:id/:isModify/:operateType
     * this.props.params
     * :assetType  1|动产   2|不动产   3|易耗品
     * :operateType  db|调拨   xz|闲置  bf|报废  cz|处置
     * 
     * 需要根据参数 operateType 设置 operateAsset
     *   <OperateType2 operateTitle="资产调拨"/>
     */
    handleParams() {
        const { assetType, id, isModify, operateType } = this.props.params

        const arg = {
            id: id,
            isModify: isModify
        }

        if (operateType == 'db') {
            this.setState({
                operateAsset: <AssetOperateForm {...arg} operateType="db" />,
                operateTitle: '资产调拨'
            })
        } else if (operateType == 'xz') {
            this.setState({
                operateAsset: <AssetOperateForm {...arg} operateType="xz" />,
                operateTitle: '资产闲置'
            })
        } else if (operateType == 'bf') {
            this.setState({
                operateAsset: <AssetOperateForm {...arg} operateType="bf" />,
                operateTitle: '资产报废'
            })
        } else if (operateType == 'cz') {
            this.setState({
                operateAsset: <AssetOperateForm {...arg} operateType="cz" />,
                operateTitle: '资产处置'
            })
        }
    }

    /**
     * 渲染
     * */
    render() {
        const { operateAsset, operateTitle } = this.state
        console.log(operateAsset)
        return (
            <div>
                {/** 审核流程-步骤条 <WorkFlow flow={approval.workFlow} />*/}
                <Cards title="审核流程">
                    {this.state.flow}
                </Cards>
                {/* 展示资产信息 */}
                <div>
                    <AssetInfo assetid={this.props.params.id} />
                </div>
                <div>
                    {/* 操作表单 */}
                    <Cards title={operateTitle}>
                        {operateAsset}
                    </Cards>
                </div>
            </div>
        )
    }
}


export default AssetOperate