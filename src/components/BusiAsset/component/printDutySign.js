// 打印责任牌
/**
 * this.props
 *      printDutySignVisible [boolean] 控制modal的显示和隐藏
 *      onCancel()  modal的显示和隐藏是父组件的printDutySignVisible控制的，所以需要一个关闭modal的处理函数
 *      printData  {}  需要打印的数据右父组件传入
 */
 
import React, { Component } from 'react'

import {
    Modal
} from 'antd'

import moment from 'moment'

class PrintDutySign extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    componentWillMount() {

    }

    // modal 确认按钮
    /**
     * localStorage.setItem('printContent', _html)
     * 
     */
    onOk() {
        const printContent = this.refs.printDutySign.innerHTML

        localStorage.setItem('printContent', printContent)
        window.open(`/#/print/printPreview/${this.props.printData.assetid}`)
        // this.onCancel()  // 是否自动关闭窗口？ todo
    }


    // modal取消按钮
    onCancel() {
        const { onCancel } = this.props
        onCancel()
    }

    // 获取当前时间
    getCurrentDate() {
        return moment().format('YYYY/MM/DD')
    }
    /**
     * 渲染
     * 
     */
    render() {
        const { printDutySignVisible, printData } = this.props
        console.log('printData: ', printData)
        // 资产位置、资产名称、台帐编号、规格型号
        const { assetarealist, assetname, parameternumber, assetspec, originalprice, assettypelist,
            owner, enabledate, assetdeplist} = printData


        return (
            <Modal
                title="打印责任牌"
                visible={printDutySignVisible}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                width="60%"
                >
                <div ref="printDutySign">
                    <div id="printDutySign">
                        <h2 className="print-title">资产责任牌</h2>
                        <div>
                            <table>
                                <tr>
                                    <td>资产名称: {assetname}</td>
                                    <td>台帐编号: {parameternumber}</td>
                                </tr>
                                <tr>
                                    <td>规格型号: {assetspec}</td>
                                    <td>价格/元: {originalprice}</td>
                                </tr>
                                <tr>
                                    <td>资产分类: {assettypelist}</td>
                                    <td>责任人: {owner}</td>
                                </tr>
                                <tr>
                                    <td>启用时间: {enabledate}</td>
                                    <td>责任部门: {assetdeplist}</td>
                                </tr>
                                <tr>
                                    <td>存放位置: {assetarealist}</td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                        <div className="print-footer">
                            <span className="footer-center">{assetarealist ? (assetarealist.split('/')[0]) : ('')}</span>
                            <span className="footer-right">{this.getCurrentDate()}</span>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}


export default PrintDutySign