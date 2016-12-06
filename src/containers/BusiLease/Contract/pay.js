// ================================
// 租赁管理-合同-合同交款
// ================================
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'

import {
    Tabs,
    message,
    notification,
    Modal,
    Button,
    Row,
    Col,
    Icon
} from 'antd'
const TabPane = Tabs.TabPane

import {
    Icons,
    Loading,
    ListText,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

import 'STYLE/list.less'

import {
    goBack
} from 'UTIL'

import action from 'ACTION/busiLease'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiLease }) => ({ busiLease }),
    mapDispatchToProps
)
class ContractPay extends Component {
    constructor(props) {
        super(props)
        console.log('####', props)
        this.initFetchSchema(this.props)
        this.status = 'notConfirmed'
        this.state = {
            modalName: 'room',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '900',
            footer: <div>
                <Button size="large" onClick={this.handleModalCancel}>取消</Button>
                <Button size="large" type="primary" onClick={this.handleModalOk}>确定</Button>
            </div>
        }
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const routes = props.routes
        const tableName = routes.pop().tableName // busi

        if (tableName) {
            console.info('init component Finance with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.paySchema = require(`SCHEMA/${tableName}/${tableName}.paySchema.js`)
            console.log(this.paySchema)
        } catch (e) {
            console.error('load pay schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的paySchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount) => {
        const {action} = this.props
        const tmpObj = Object.assign({}, queryObj)

        if (this.status === 'confirmed') {
            tmpObj.status = '已到账'
        }
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount
        this.queryObj = tmpObj
        action.fetchContractPay(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {}) => {
        const {
            confirmedData,
            notConfirmedData
        } = this.props.busiLease.contractPay
        if (this.status === 'notConfirmed') {
            this.select(queryObj, notConfirmedData.pageSize, 0)
        } else if (this.status === 'confirmed') {
            this.select(queryObj, confirmedData.pageSize, 0)
        }
    }

    /**
     * 查询
     */
    handleFormSubmit = (newObj) => {
        const tmpObj = Object.assign({}, newObj)
        const {
            confirmedData,
            notConfirmedData
        } = this.props.busiLease.contractPay

        if (this.status === 'confirmed') {
            this.select(tmpObj, confirmedData.pageSize, 0)
        } else if (this.status === 'notConfirmed') {
            this.select(tmpObj, notConfirmedData.pageSize, 0)
        }
    }

    /**
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {
            confirmedData,
            notConfirmedData
        } = this.props.busiLease.contractPay

        const {
            fetchContractPay
        } = this.props.action

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (this.status === 'confirmed') {
            this.select(this.queryObj, confirmedData.pageSize, page)
        } else if (this.status === 'notConfirmed') {
            this.select(this.queryObj, notConfirmedData.pageSize, page)
        }
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.status = activeKey
        this.refs.form.resetFields()
        this.refresh()
    }

    // 表格操作按钮
    parentHandleClick = (key, data) => {
        if (key === 'addContract') {
            hashHistory.push('busi/busi_lease/contract/add')
        } else if (key === "renewContract") {
            hashHistory.push('busi/busi_lease/contract/renew/289')
        } else if (key === "addBond") {
            this.setState({
                modalVisible: true,
                modalTitle: '新增保证金',
                okText: '保存'
            })
        }
    }

    handleModalOk = () => {
        const {
            busiLease
        } = this.props.actionLease
        if (this.status === 'bond') {
            console.log(this.refs.formInsert.getFieldsValue());
            const tmp = {}
            busiLease.bondInsert(tmp)
            this.refs.formInsert.resetFields()
            this.handleModalCancel()
        }
    }

    // 弹框关闭
    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    handleShow = (text, record, index) => {
        this.props.action.fetchContractPayMent({
            rentpactpayplanid: parseInt(record.rentpactpayplanid)
        })
        this.setState({
            modalVisible: true,
            modalTitle: '合同交款详情',
            modalName: 'show',
            footer: ''
        })
    }

    handlePrint = (text, record, index) => {
        this.props.action.fetchContractPayMent({
            rentpactpayplanid: parseInt(record.rentpactpayplanid)
        })
        let status
        if (record.status === '已提交') {
            status = '财务已提交'
        } else if (record.status === '已到账') {
            status = '财务已到账'
        } else {
            status = '提交财务'
        }
        this.setState({
            modalVisible: true,
            modalTitle: '合同交款打印交款单',
            modalName: 'print',
            footer: <div className="button-group">
                <Button type="default" onClick={this.handleModalCancel}>取消</Button>
                <Button type="primary" disabled={record.status === '已提交' || record.status === '已到账'} onClick={this.handleCommitFinance}><Icons type="finance-b" />{status}</Button>
                <Link style={ {marginLeft: '8px'} } to={`print/printPreview/${record.rentpactpayplanid}`} target="_blank">
                    <Button type="primary" onClick={this.saveToLocalStorage}><Icons type="print-a" />打印</Button>
                </Link>
            </div>
        })
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

    handleCommitFinance = () => {
        const {
            busiLease,
            action
        } = this.props
        action.fetchCommitFinance({
            rentpactpayplanid: parseInt(busiLease.payMent.data.rentpactpayplanid)
        })
        this.handleModalCancel()
    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh()
    }

    render() {
        const {
            confirmedData,
            notConfirmedData
        } = this.props.busiLease.contractPay
        // 已支付
        const notConfirmedTableColumns = notConfirmedData.tableColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div class="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShow.bind(this, text, record, index)}>详情</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handlePrint.bind(this, text, record, index)}>打印交款单</a>
                </div>
            }
        ])
        // 待支付
        const confirmedTableColumns = confirmedData.tableColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div class="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShow.bind(this, text, record, index)}>详情</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handlePrint.bind(this, text, record, index)}>打印交款单</a>
                </div>
            }
        ])


        let modalContent = ''

        if (this.state.modalName === 'show') {
            const {
                loading,
                tableContractColumns,
                data
            } = this.props.busiLease.payMent
            if (loading) {
                modalContent = <Loading />
            }
            modalContent = <div className="modal-with-title contract-pay-show printContent">
                <h3>收款计划</h3>
                <Row type="flex" gutter={20} className="g-mb10 list-text">
                    <Col sm={8}>
                        合同编号：<span className="s-primary">{data.rentpactcode}</span>
                    </Col>
                    <Col sm={8}>
                        当期期数：<span className="s-primary">{data.stagesnumber}</span>
                    </Col>
                    <Col sm={8}>
                        收款时间：<span className="s-primary">{data.plandate}</span>
                    </Col>
                    <Col sm={8}>
                        应交金额：<span className="s-primary">{data.money}</span>
                    </Col>
                    <Col sm={8}>
                        已交金额：<span className="s-primary">{data.moneyget}</span>
                    </Col>
                    {/*<Col sm={8}>
                        提交人员：<span className="s-primary">{data.createman}</span>
                    </Col>
                    <Col sm={8}>
                        提交时间：<span className="s-primary">{data.createdate}</span>
                    </Col>*/}
                    <Col sm={8}>
                        确认人员：<span className="s-primary">{data.sureman}</span>
                    </Col>
                    <Col sm={8}>
                        确认时间：<span className="s-primary">{data.suredate}</span>
                    </Col>
                    <Col sm={8}>
                        备注内容：<span className="s-primary">{data.memo}</span>
                    </Col>
                </Row>
                <h3>当期收款计划详情</h3>
                <InnerTable
                    columns={tableContractColumns}
                    dataSource={data.rentpactpaylists}
                    bordered={true}
                    pagination={false} />
            </div>
        } else if (this.state.modalName === 'print') {
            const {
                loading,
                data
            } = this.props.busiLease.payMent
            if (loading) {
                modalContent = <Loading />
            } else {
                const detailed = data.rentpactpaylists.map(item =>
                    <tr>
                        <td className="title">{item.itemname}</td>
                        <td className="clearfix"><span className="g-fr">￥：{item.money}</span></td>
                    </tr>
                )

                modalContent = <div className="modal-with-title contract-pay-print printContent">
                    <h3 className="clearfix">客户交款单<span className="u-mark">{data.rentpactcode}</span></h3>
                    <table className="m-table-print">
                        <tr>
                            <td className="title">交款单位（个人）</td>
                            <td className="g-tac">{data.organization}</td>
                        </tr>
                        <tr>
                            <td className="title">房号</td>
                            <td className="g-tac">{data.roomlist}</td>
                        </tr>
                        <tr>
                            <td className="title">合计</td>
                            <td className="clearfix"><span className="g-fr">￥：{data.money}</span></td>
                        </tr>
                        {detailed}
                        <tr>
                            <td className="title">有效期限</td>
                            <td className="g-tac">{data.validdate}至{data.invaliddate}</td>
                        </tr>
                        <tr>
                            <td className="title">备注</td>
                            <td className="g-tac">{data.memo}</td>
                        </tr>
                        <tr>
                            <td className="title">收款单位</td>
                            <td className="g-tac">{data.companytitle}</td>
                        </tr>
                        <tr>
                            <td className="title">开户行</td>
                            <td className="g-tac">{data.bankname}&nbsp;&nbsp;{data.bankaccount}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <ul className="clearfix list-horizontal-txt m-row-4">
                                    <li>主管：</li>
                                    <li>内勤：</li>
                                    <li>销售经理：</li>
                                    <li>收款人：</li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            }
        }

        const goBack = <Button onClick={() => { history.back() } }><Icon type="rollback" />返回</Button>

        return (
            <section>
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    okText={this.state.okText}
                    width={this.state.modalWidth}
                    footer={this.state.footer}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <Tabs
                    defaultActiveKey="notConfirmed"
                    animated="false"
                    type="card"
                    onChange={this.handlerTabs}
                    tabBarExtraContent={goBack}>
                    <TabPane tab="财务未确认合同" key="notConfirmed">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.paySchema['notConfirmed']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <InnerTable
                            loading={notConfirmedData.tableLoading}
                            columns={notConfirmedTableColumns}
                            dataSource={notConfirmedData.tableData}
                            parentHandleClick={this.parentHandleClick}
                            isRowSelection={false}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={notConfirmedData.total}
                            pageSize={notConfirmedData.pageSize}
                            skipCount={notConfirmedData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="财务已确认合同" key="confirmed">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.paySchema['confirmed']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <InnerTable
                            loading={confirmedData.tableLoading}
                            columns={confirmedTableColumns}
                            dataSource={confirmedData.tableData}
                            parentHandleClick={this.parentHandleClick}
                            isRowSelection={false}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={confirmedData.total}
                            pageSize={confirmedData.pageSize}
                            skipCount={confirmedData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default ContractPay