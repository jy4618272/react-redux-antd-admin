/**
 * 操作资产：调拨，闲置，报废，处置
 * 
 */
import React, { Component } from 'react'

import StepsComponent from 'COMPONENT/BusiAsset/component/stepsComponent'
import AssetInfo from 'COMPONENT/BusiAsset/component/assetInfoParse'
// OperateType1  OperateType2
import OperateType1 from 'COMPONENT/BusiAsset/assetOperate/OperateType-1'
import OperateType2 from 'COMPONENT/BusiAsset/assetOperate/OperateType-2'

class AssetOperate extends Component {
    constructor() {
        super()
        this.state = {
            current: 1,
            steps: [   // stepsComponent
                { title: '内勤1', description: '张琪亚 ｜ 新增' },
                { title: '管理员', description: '李媛风 ｜ 审核' },
                { title: '财务员', description: '母庆业 ｜ 审核' },
                { title: '完成', description: '' }
            ],
            operateAsset: '',  // 不同的操作，UI也不同
            formData: null
        }
    }
    /**
     * 
     * 
     */
    componentWillMount() {
        // 设置处理表单
        this.handleParams()
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
     *   <OperateType2 operateTitle="资产调拨" formData={formData}/>
     */
    handleParams() {
        const { assetType, id, isModify, operateType } = this.props.params
        let { formData } = this.state
        if (operateType == 'db') {
            this.state.operateAsset = <OperateType1 operateTitle="资产调拨" formData={formData} />
        } else if (operateType == 'xz') {
            this.state.operateAsset = <OperateType1 operateTitle="资产闲置" formData={formData} />
        } else if (operateType == 'bf') {
            this.state.operateAsset = <OperateType1 operateTitle="资产报废" formData={formData} />
        } else if (operateType == 'cz') {
            this.state.operateAsset = <OperateType2 operateTitle="资产处置" formData={formData} />
        }
    }

    /**
     * 渲染
     * */
    render() {
        const { operateAsset } = this.state
        console.log(operateAsset)
        return (
            <div>
                <div>
                    <StepsComponent current={this.state.current} steps={this.state.steps} />
                </div>
                <div>
                    <AssetInfo />
                </div>
                <div>
                    {operateAsset}
                </div>
            </div>
        )
    }
}


export default AssetOperate