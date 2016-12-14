// 水电业务-手工抄表-已提交
'use strict';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row, Col, Button, notification } from 'antd'
const ButtonGroup = Button.Group
import {
    Err,
    Icons,
    InnerPagination,
    InnerForm,
    InnerTable,
    Loading,
    ModalBox
} from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
import 'STYLE/modal.less';
import 'STYLE/button.less';

class ManualMeterConfirmed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: [],
            modalInfo: {
                visible: false,
                type: 'type',
                title: '标题',
                width: '900'
            }
        }
        this.initFetchSchema(props)
        console.log('水电业务-手工抄表-已提交props：', props)
    }

    static defaultProps = {
        printModal: 'printModal'
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryManualMeterConfirmedSchema`);
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryManualMeterConfirmedSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 查询
    handleFormSubmit = () => {
        
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchRateList)
    }

    /**
     * 需要打印的内容都放在 .printContent 中，同一时间只会存在一个，搜索printContent，查看所有可能需要打印的内容
     * 获取到需要打印的html片段，写入localStorage,key值为printContent
     */
    saveToLocalStorage() {
        // 获取需要打印的html片段
        const html = document.getElementsByClassName('printContent')[0].innerHTML
        // 写入localStorage
        localStorage.setItem('printContent', html)
    }

    // 打印交款单
    handlePrintPayment = () => {
        this.setState({
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: true,
                type: 'print',
                title: '打印交款单',
                footer: <div className="button-group gutter">
                    <Button type="default" onClick={this.parentHandleModalCancel}>取消</Button>
                    <Link to={`print/printPreview/33`} target="_blank">
                        <Button type="primary" onClick={this.saveToLocalStorage}>打印</Button>
                    </Link>
                </div>
            })
        })
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { rateAddModal, rateEditModal } = this.props
        const { modalInfo } = this.state
        this.setState({         
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })
    }

    // 导出本页
    handleExportPage = () => {
        alert('导出本页')
    }

    componentDidMount() {
        const { actionBusi } = this.props
        pageChange({}, 30, 0, actionBusi.fetchRateList)
    }

    render() {
        const data = this.props
        const tableControl = <Row className="g-mb10">
            <Col sm={16}>
                <ButtonGroup className="button-group">
                    <Button onClick={this.handlePrintPayment}><Icons type="receipt" />打印交款单</Button>
                </ButtonGroup>
            </Col>
            <Col sm={8} className="g-tar">
                <ButtonGroup className="button-group">
                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                </ButtonGroup>
            </Col>
        </Row>

        let modalContent = modalContent = <div className="m-modal contract-pay-print printContent">
                <h3 className="clearfix">XX公路港水电费交款单<span className="u-mark">XXXXX</span></h3>
                <table className="m-table-print">
                    <tr>
                        <td className="title">客户名称</td>
                        <td colSpan="8">XXX</td>
                    </tr>
                    <tr>
                        <td className="title">上次抄表日期</td>
                        <td className="title">本次抄表日期</td>                      
                        <td className="title">类别</td>                      
                        <td className="title">设备号</td>                      
                        <td className="title">房间号</td>                      
                        <td className="title">上期示数</td>                      
                        <td className="title">本期示数</td>                 
                        <td className="title">用量</td>                 
                        <td className="title">余额（元）</td>                      
                    </tr>
                    <tr>
                        <td>2015-10-10</td>
                        <td>2015-10-10</td>                      
                        <td>水</td>                      
                        <td>34234234</td>                      
                        <td>234234</td>                      
                        <td>234234</td>                      
                        <td>234</td>                 
                        <td>23吨</td>                 
                        <td>424</td>                      
                    </tr>
                    <tr>
                        <td>2015-10-10</td>
                        <td>2015-10-10</td>                      
                        <td>水</td>                      
                        <td>34234234</td>                      
                        <td>234234</td>                      
                        <td>234234</td>                      
                        <td>234</td>                 
                        <td>23吨</td>                 
                        <td>424</td>                      
                    </tr>
                    <tr>
                        <td className="title">水电费合计</td>
                        <td colSpan="8">23元</td>
                    </tr>
                    <tr>
                        <td className="title">备注</td>
                        <td colSpan="8" className="g-tal">备注</td>
                    </tr>
                </table>
                <ul className="clearfix list-horizontal-txt m-row-4 g-mt20">
                    <li>&nbsp;</li>
                    <li>&nbsp;</li>
                    <li className="g-tar">开单人：汪梦迪</li>
                    <li className="g-tar">开单日期：2016-07-06</li>
                </ul>
            </div>

        return (
            <section className="m-config-cont">
                {/* 弹框 */}
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    {modalContent}
                </ModalBox>

                {/* 查询 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={this.querySchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                {/* 表格操作 */}
                {tableControl}

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false} />
                <InnerPagination
                    total={data.total}
                    pageSize={data.pageSize}
                    skipCount={data.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

export default ManualMeterConfirmed