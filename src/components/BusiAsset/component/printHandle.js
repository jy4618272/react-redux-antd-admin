// 打印处置单
/**
 * 
 * this.props
 *  printHandleVisible [boolean] 控制modal的显示和隐藏
 *  onCancel()  modal的显示和隐藏是父组件的printDutySignVisible控制的，所以需要一个关闭modal的处理函数
 *  printData{}  被选中的资产数据
 */


import React, { Component } from 'react'

import {
    Modal
} from 'antd'

import DisplayDetails from 'COMPONENT/BusiAsset/component/displayDetails'

class PrintHandle extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    onOk() {
        const printContent = this.refs.printHandle.innerHTML

        localStorage.setItem('printContent', printContent)
        window.open(`/#/print/printPreview/${this.props.printData.asset.assetid}`)
        // this.onCancel() // 点击打印后，是否需要自动关闭？ todo
    }

    onCancel() {
        const { onCancel } = this.props
        onCancel()
    }

    // 获取需要展示的信息
    handleDisplayData() {
        const { printData } = this.props
        // 资产信息，报废信息，处置信息，流程信息
        const { asset, assettransferbf, assettransfercz, flow } = printData

        let assetInfo = Object.assign({}, asset, assettransferbf)
        // 处置信息
        const { inputdate: handleDate, disposition, dispositionmoney, inputman } = assettransfercz
        let handleInfo = {handleDate, disposition, dispositionmoney, inputman}

        // 审核信息 
        const { username } = flow[1].people[0]
        let flowInfo = { username }

        // alert(username)
        console.log('assetInfo', assetInfo)
        return {
            assetInfo,
            handleInfo,
            flowInfo
        }
    }

    /**
     * 渲染
     * 
     */
    render() {
        const { printHandle, printData } = this.props
        
        // 页面第一次初始化的时候printData没有数据，直接返回false
        if (!printData) {return false}
  
        const { assetInfo, handleInfo, flowInfo } = this.handleDisplayData()

        return (
            <Modal
                visible={printHandle}
                title="打印处置单"
                width="60%"
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}>
                <div ref="printHandle">
                    <div id="printHandleForm">
                        <h2 className="print-title">打印处置单</h2>
                        <DisplayDetails displayData={assetInfo} title="资产信息" />
                        <DisplayDetails displayData={handleInfo} title="处置信息" />
                        <DisplayDetails displayData={flowInfo} title="管理员审核" />
                    </div>
                </div>
            </Modal>
        )
    }
}


export default PrintHandle