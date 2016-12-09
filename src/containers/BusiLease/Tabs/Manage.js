import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import {
    Icon,
    Row,
    Col,
    Button,
    Tabs,
    message,
    notification,
    Modal
} from 'antd'
const TabPane = Tabs.TabPane
const ButtonGroup = Button.Group
import {
    Loading,
    Icons,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

import { paths } from 'SERVICE/config'
import action from 'ACTION/busiLease'
import 'STYLE/list.less'


const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiLease }) => ({ busiLease }),
    mapDispatchToProps
)
class LeaseManage extends Component {
    constructor(props) {
        super(props)
        this.status = sessionStorage.getItem('leaseManageTabs') || 'contract'
        this.state = {
            clickedRowKeys: [],
            clickedRows: [],
            selectedRowKeys: [],
            selectedRows: [],
            modalName: 'insertBond',
            modalVisible: false,
            modalTitle: '新增',
            okText: '确定',
            modalWidth: '900',
            footer: <div>
                <Button size="large" onClick={this.handleModalCancel}>取消</Button>
                <Button size="large" type="primary" onClick={this.handleModalOk}>确定</Button>
            </div>
        }
        console.log('租赁管理props:', props)
    }

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount, fetchHandle) => {
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount
        this.queryObj = tmpObj
        fetchHandle(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (fetchHandle) => {
        this.select({}, 10, 0, fetchHandle)
    }

    /**
     * 查询
     */
    handleFormSubmit = (newData) => {
        const {
            contractData,
            bondData,
            notContractData
        } = this.props.busiLease

        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.action

        if (this.status === 'contract') {
            this.select(newData, contractData.pageSize, 0, fetchContractTable)
        } else if (this.status === 'bond') {
            this.select(newData, bondData.pageSize, 0, fetchBondTable)
        } else if (this.status === 'notContract') {
            this.select(newData, notContractData.pageSize, 0, fetchNotContractTable)
        }
    }

    // 高级查询
    contractSearch = (key) => {
        const {
            contractData
        } = this.props.busiLease

        const {
            fetchContractTable
        } = this.props.action
        let enddatefrom
        let enddateto
        if (key === 'due') {
            enddatefrom = moment().format('YYYY-MM-DD')
            enddateto = moment().add('60', 'days').format('YYYY-MM-DD')
        } else if (key === 'shouldSign') {
            enddatefrom = moment().format('YYYY-MM') + '-01'
            enddateto = moment(moment().add(1, 'month').format('YYYY-MM') + '-01', 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
        }
        this.select({
            enddatefrom,
            enddateto
        }, contractData.pageSize, 0, fetchContractTable)
    }

    /**
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {
            contractData,
            bondData,
            notContractData
        } = this.props.busiLease

        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.action
        this.handleCancel(this.status)

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (this.status === 'contract') {
            this.select(this.queryObj, contractData.pageSize, page, fetchContractTable)
        } else if (this.status === 'bond') {
            this.select(this.queryObj, bondData.pageSize, page, fetchBondTable)
        } else if (this.status === 'notContract') {
            this.select(this.queryObj, notContractData.pageSize, page, fetchNotContractTable)
        }
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.status = activeKey
        sessionStorage.setItem('leaseManageTabs', activeKey)
        this.refs.form.resetFields()
        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.action

        if (this.status === 'contract') {
            this.refresh(fetchContractTable)
        } else if (this.status === 'bond') {
            this.refresh(fetchBondTable)
        } else if (this.status === 'notContract') {
            this.refresh(fetchNotContractTable)
        }
    }


    /* 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectedRowKeys: keys,
            selectedRows: rows
        })
    }*/

    // 单击选中
    parentHandleRowClick = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
    }

    // 取消勾选
    handleCancel = (key) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        this.refs[key].hanldeCancelClick()
    }

    // 合同新增
    handleAdd = (key) => {
        if (key === 'contract') {
            hashHistory.push('busi/busi_lease/contract/add')
        } else if (key === 'bond') {
            hashHistory.push('busi/busi_lease/add?type=bond')
        } else if (key === 'notContract') {
            hashHistory.push('busi/busi_lease/add?type=notContract')
        }
    }

    // 提交审核
    handleApproval = (key) => {
        const data = this.state.clickedRows
        const {action} = this.props
        if (data.length == 1) {
            this.handleCancel(this.status)
            if (key === 'contract') {
                if (data[0].flowtype === '新增' || data[0].flowtype === '续租') {
                    action.approvalContract({
                        rentpactid: data[0].rentpactid
                    })
                } else if (data[0].flowtype === '变更') {
                    action.approvalChangeContract({
                        rentpactid: data[0].rentpactid
                    })
                }
            } else if (key === 'bond') {
                action.approvalBond({
                    marginid: data[0].marginid
                })
            }
        }
    }

    // 合同续租
    handleRenewContract = () => {
        const data = this.state.clickedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/renew/${data[0].rentpactid}`)
        }
    }

    // 合同变更-保存flowtype一定是‘变更’
    handleChangeContract = () => {
        const data = this.state.clickedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/change/${data[0].rentpactid}?type=变更`)
        }
    }

    // 合同编辑-保存flowtype根据原来的状态
    handleEdit = (key) => {
        const data = this.state.clickedRows
        if (data.length == 1) {
            if (key === 'contract') {
                hashHistory.push(`busi/busi_lease/contract/change/${data[0].rentpactid}?type=${data[0].flowtype}`)
            }
        }
    }

    // 合同退租
    handleRentContract = () => {
        const data = this.state.clickedRows
        if (data.length == 1) {
            sessionStorage.setItem('rentData', JSON.stringify({
                modelname: data[0].modelname,
                rentpactid: data[0].rentpactid
            }))
            hashHistory.push(`busi/busi_lease/contract/rent/${data[0].rentpactid}?type=rent`)
        }
    }

    // 合同作废
    handleVoid = (key) => {
        const data = this.state.clickedRows
        const { action } = this.props

        if (data.length == 1) {
            this.handleCancel(this.status)
            if (key === 'contract') {
                action.voidContract({
                    rentpactid: data[0].rentpactid,
                    status: "作废"
                })
            } else if (key === 'bond') {
                action.voidBond({
                    marginid: data[0].marginid,
                    status: "作废"
                })
            } else if (key === 'notContract') {
                action.voidNotContract({
                    boothpaymentid: data[0].boothpaymentid,
                    status: "作废"
                })
            }
        }
    }

    // 合同交款
    handlePayContract = () => {
        hashHistory.push('busi/busi_lease/contract/pay')
    }

    // 提交财务
    handleCommitFinance = (key) => {
        const { busiLease, action } = this.props
        const data = this.state.clickedRows

        if (data.length === 1) {
            this.handleCancel(this.status)
            if (key === 'bond') {
                action.fetchCommitFinanceBond({
                    businessnumber: data[0].businessnumber,
                    organization: data[0].organization,
                    marginmoney: data[0].marginmoney,
                    partyid: data[0].partyid,
                    marginid: data[0].marginid
                })
            } else if (key === 'notContract') {
                action.fetchCommitFinanceNotContract({
                    boothpaymentid: busiLease.payMent.data.boothpaymentid,
                    businessnumber: busiLease.payMent.data.businessnumber,
                    status: busiLease.payMent.data.status,
                    validdate: busiLease.payMent.data.validdate,
                    invaliddate: busiLease.payMent.data.invaliddate,
                    money: busiLease.payMent.data.money,
                    organization: busiLease.payMent.data.organization
                })
                this.handleModalCancel()
            }
        }
    }

    // 退款
    handleRefundApproval = (key) => {
        const data = this.state.clickedRows
        const { action } = this.props

        if (data.length == 1) {
            if (key === 'bond') {
                action.fetchRefundBond({
                    marginid: data[0].marginid
                })
            }
        }
    }

    // 导出本页
    handleExportPage = (key) => {
        // alert(key)
        const {
            busiLease
        } = this.props

        let arrParam = []
        this.handleCancel(this.status)
        if (key === 'contract') {
            busiLease.contractData.tableData.map(item => {
                arrParam.push(item.rentpactid)
            })
        } else if (key === 'bond') {
            busiLease.bondData.tableData.map(item => {
                arrParam.push(item.marginid)
            })
        }

        if (arrParam.length) {
            notification.success({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });
            if (key === 'contract') {
                window.location.href = paths.leasePath + '/rentpactcs/selectByRentPactIdListToExcel?rentpactids=' + arrParam.join(',')
            } else if (key === 'bond') {
                window.location.href = paths.leasePath + '/margincs/selectByMarginIdListToExcel?marginids=' + arrParam.join(',')
            }
        } else {
            notification.error({
                message: '导出本页',
                description: '本页没有数据',
            });
        }
    }


    // 弹框关闭
    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    // 双击查看详情
    parentHandleDoubleClick = (record, index) => {
        if (record.rentpactid) {
            // hashHistory.push(`busi/busi_lease/${record.rentpactid}?type=rentpact`)
            window.open(`#/busi/busi_lease/${record.rentpactid}?type=rentpact`)
        } else {
            // alert(3)
        }
    }


    // 临时摊位打印交款单
    handlePrintPayMent = (key, record) => {
        const linkStyle = { marginLeft: '8px' }
        if (key === 'bond') {
            this.props.action.fetchBondPayMent({
                marginid: parseInt(record.marginid)
            })
            this.setState({
                modalName: 'bondPayMent',
                modalVisible: true,
                modalTitle: '保证金打印交款单',
                footer: <div>
                    <Button type="default" onClick={this.handleModalCancel}>取消</Button>
                    <Link style={linkStyle} to={`print/printPreview/${record.marginid}`} target="_blank">
                        <Button type="primary" onClick={this.saveToLocalStorage}>打印</Button>
                    </Link>
                </div>
            })
        } else if (key === 'notContract') {
            this.props.action.fetchNotContractPayMent({
                boothpaymentid: parseInt(record.boothpaymentid)
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
                modalName: 'notContractPayMent',
                modalVisible: true,
                modalTitle: '临时摊位打印交款单',
                footer: <div className="button-group">
                    <Button type="default" onClick={this.handleModalCancel}>取消</Button>
                    <Button type="primary" disabled={record.status !== '未提交'} onClick={this.handleCommitFinance.bind(this, 'notContract')}><Icons type="finance-b" />{status}</Button>
                    <Link style={linkStyle} to={`print/printPreview/${record.boothpaymentid}`} target="_blank">
                        <Button type="primary" onClick={this.saveToLocalStorage}><Icons type="print-a" />打印</Button>
                    </Link>
                </div>
            })
        }
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

    /**
     * 合同表格数据【流程状态】颜色配置
     * 草稿    - 浅黄
     * 审批退回 - 淡红色
     */

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.action

        // 选显卡初始化设置
        if (this.status === 'contract') {
            this.refresh(fetchContractTable)
        } else if (this.status === 'bond') {
            this.refresh(fetchBondTable)
        } else if (this.status === 'notContract') {
            this.refresh(fetchNotContractTable)
        }
    }


    render() {
        const {
            querySchema
        } = this.props

        const {
            contractData,
            bondData,
            notContractData
        } = this.props.busiLease

        const {
            clickedRowKeys,
            clickedRows,
            modalName
        } = this.state
        const oneSelected = clickedRowKeys.length == 1

        // 合同
        let isContractApproval = false   // 提交审核
        let isContractRenew = false      // 续租
        let isContractChange = false     // 变更
        let isContractEdit = false       // 编辑
        let isContractRent = false       // 退租
        let isContractVoid = false       // 作废

        // 按钮操作
        if (oneSelected && (clickedRows[0].flowtype !== '作废')) {
            const selected = clickedRows[0]
            if (selected.flowtype === '新增' || selected.flowtype === '续租') {
                // if (selected.flowtype === '新增/续租') {
                if (selected.flowstatus === '草稿') {
                    if (selected.fistatus === '未提交') {
                        // 作废、编辑、提交审核
                        isContractVoid = true
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废
                        isContractVoid = true
                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isContractRenew = true
                        isContractRent = true
                        isContractChange = true
                    } else if (selected.fistatus === '已退') {

                    }
                } else if (selected.flowstatus === '审批中') {
                    if (selected.fistatus === '未提交') {
                        // 催办
                    } else if (selected.fistatus === '待财务确认') {
                        // 催办
                    } else if (selected.fistatus === '有效') {
                        // 催办
                    } else if (selected.fistatus === '已退') {

                    }
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {

                    } else if (selected.fistatus === '待财务确认') {

                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isContractRenew = true
                        isContractRent = true
                        isContractChange = true
                    } else if (selected.fistatus === '已退') {

                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '未提交') {
                        // 作废、编辑、提交审核
                        isContractVoid = true
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废、编辑、提交审核
                        isContractVoid = true
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '有效') {
                        // 编辑、审批
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '已退') {

                    }
                }
            } else if (selected.flowtype === '变更') {
                if (selected.flowstatus === '草稿') {
                    // 作废、编辑、提交审核
                    isContractVoid = true
                    isContractEdit = true
                    isContractApproval = true
                } else if (selected.flowstatus === '审批中') {
                    if (selected.fistatus === '未提交') {
                        // 催办
                    } else if (selected.fistatus === '待财务确认') {
                        // 催办
                    } else if (selected.fistatus === '有效') {
                        // 催办
                    } else if (selected.fistatus === '已退') {

                    }
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {
                        // 撤回
                    } else if (selected.fistatus === '待财务确认') {

                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isContractRenew = true
                        isContractRent = true
                        isContractChange = true
                    } else if (selected.fistatus === '已退') {

                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '未提交') {
                        // 编辑、提交审核
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废、编辑、提交审核
                        isContractVoid = true
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '有效') {
                        // 编辑、提交审核
                        isContractEdit = true
                        isContractApproval = true
                    } else if (selected.fistatus === '已退') {

                    }
                }
            } else if (selected.flowtype === '退租') {
                if (selected.flowstatus === '草稿') {
                    // 作废、编辑、提交审核
                    isContractVoid = true
                    isContractEdit = true
                    isContractApproval = true
                } else if (selected.flowstatus === '审批中') {
                    // 催办
                } else if (selected.flowstatus === '审批通过') {

                } else if (selected.flowstatus === '审批退回') {
                    // 编辑、提交审核
                    isContractEdit = true
                    isContractApproval = true
                }
            }
        }

        const tableContractControl = <div className="g-mb10">
            <Row>
                <Col sm={16}>
                    <ButtonGroup className="button-group">
                        <Button onClick={this.handleAdd.bind(this, this.status)}><Icons type="add" />新增</Button>
                        <Button disabled={!isContractApproval} onClick={this.handleApproval.bind(this, this.status)}>提交审核</Button>
                        <Button disabled={!isContractRenew} onClick={this.handleRenewContract}><Icons type="renew" />续租</Button>
                        <Button disabled={!isContractChange} onClick={this.handleChangeContract}><Icons type="change" />变更</Button>
                        <Button disabled={!isContractEdit} onClick={this.handleEdit.bind(this, this.status)}><Icons type="edit" />编辑</Button>
                        <Button disabled={!isContractRent} onClick={this.handleRentContract}><Icons type="rent" />退租</Button>
                        <Button disabled={!isContractVoid} onClick={this.handleVoid.bind(this, this.status)}><Icons type="void" />作废</Button>
                        <Button onClick={this.handlePayContract}>合同交款</Button>
                    </ButtonGroup>
                </Col>
                <Col sm={8} className="g-tar">
                    <ButtonGroup className="button-group">
                        <Button type="primary" onClick={this.handleExportPage.bind(this, this.status)}>导出本页</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </div>

        // 履约保证金
        let isBondApproval = false            // 提交审核
        let isBondEdit = false                // 编辑
        let isBondRefundApproval = false              // 退款
        let isBondCommitFinance = false       // 提交财务
        let isBondVoid = false                // 作废

        // 按钮操作
        if (oneSelected && (clickedRows[0].status !== '作废')) {
            const selected = clickedRows[0]
            if (selected.flowtype === '新增') {
                if (selected.flowstatus === '草稿') {
                    // 作废、编辑、提交审核
                    isBondVoid = true
                    isBondEdit = true
                    isBondApproval = true
                } else if (selected.flowstatus === '审批中') {
                    if (selected.fistatus === '未提交') {
                        // 提交财务
                        isBondCommitFinance = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 催办
                    } else if (selected.fistatus === '有效') {
                        // 催办
                    }
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {
                        // 提交财务
                        isBondCommitFinance = true
                    } else if (selected.fistatus === '有效') {
                        // 退款
                        isBondRefundApproval = true
                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '未提交' || selected.fistatus === '待财务确认') {
                        // 作废、编辑、提交审核
                        isBondVoid = true
                        isBondEdit = true
                        isBondApproval = true
                    } else if (selected.fistatus === '有效') {
                        // 编辑、提交审核
                        isBondEdit = true
                        isBondApproval = true
                    }
                }
            } else if (selected.flowtype === '退款') {
                if (selected.flowstatus === '审批中') {
                    // 催办
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {
                        // 提交财务
                        isBondCommitFinance = true
                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus !== '已冲抵') {
                        // 编辑、提交审核
                        isBondEdit = true
                        isBondApproval = true
                    }
                }
            }
        }

        const tableBondControl = <div className="g-mb10">
            <Row>
                <Col sm={16}>
                    <ButtonGroup className="button-group">
                        <Button onClick={this.handleAdd.bind(this, this.status)}><Icons type="add" />新增</Button>
                        <Button disabled={!isBondApproval} onClick={this.handleApproval.bind(this, this.status)}>提交审核</Button>
                        {/*<Button disabled={!isBondApproval} onClick={this.handleRefundApproval.bind(this, this.status)}>1提交退款审批</Button>*/}                
                        {/*<Button onClick={this.handleEdit.bind(this, this.status)}>编辑</Button>*/}
                        <Button disabled={!isBondCommitFinance} onClick={this.handleCommitFinance.bind(this, this.status)}><Icons type="finance-b" />提交财务</Button>
                        <Button disabled={!isBondVoid} onClick={this.handleVoid.bind(this, this.status)}><Icons type="void" />作废</Button>
                    </ButtonGroup>
                </Col>
                <Col sm={8} className="g-tar">
                    <ButtonGroup className="button-group">
                        <Button type="primary" onClick={this.handleExportPage.bind(this, this.status)}>导出本页</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </div>

        const tableColumnsBond = bondData.tableColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <a href="javascript:;" onClick={this.handlePrintPayMent.bind(this, 'bond', record)} className="s-blue">打印缴款单</a>
            }
        ])

        /*
         * 临时摊位
         */
        let isNotContractVoid = false                // 作废

        // 按钮操作
        if (oneSelected && (clickedRows[0].status == '未提交')) {
            isNotContractVoid = true
        }

        const tableNotContractControl = <ButtonGroup className="button-group g-mb10">
            <Button onClick={this.handleAdd.bind(this, this.status)}><Icons type="add" />新增临时摊位协议</Button>
            <Button disabled={!isNotContractVoid} onClick={this.handleVoid.bind(this, this.status)}><Icons type="void" />作废</Button>
        </ButtonGroup>

        const tableColumnsNotContract = notContractData.tableColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <a href="javascript:;" onClick={this.handlePrintPayMent.bind(this, this.status, record)} className="s-blue">打印缴款单</a>
            }
        ])

        let modalContent = ''
        if (modalName === 'bondPayMent') {
            const {
                loading,
                data
            } = this.props.busiLease.payMent

            if (loading) {
                modalContent = <Loading />
            }
            modalContent = <div className="modal-with-title contract-pay-print printContent">
                <h3 className="clearfix">保证金交款单<span className="u-mark">{data.businessnumber}</span></h3>
                <table className="m-table-print">
                    <tr>
                        <td className="title">交款单位（个人）</td>
                        <td className="g-tac">{data.organization}</td>
                    </tr>
                    <tr>
                        <td className="title">金额</td>
                        <td className="g-tac">{data.marginmoney}</td>
                    </tr>
                    <tr>
                        <td className="title">备注</td>
                        <td className="g-tac">{data.memo}</td>
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
        } else if (modalName === 'notContractPayMent') {
            const {
                loading,
                data
            } = this.props.busiLease.payMent

            if (loading) {
                modalContent = <Loading />
            }

            modalContent = <div className="modal-with-title contract-pay-print printContent">
                <h3 className="clearfix">临时摊位交款单<span className="u-mark">{data.businessnumber}</span></h3>
                <table className="m-table-print">
                    <tr>
                        <td className="title">交款人</td>
                        <td className="g-tac">{data.organization}</td>
                    </tr>
                    <tr>
                        <td className="title">金额</td>
                        <td className="g-tac">{data.money}</td>
                    </tr>
                    <tr>
                        <td className="title">有效期限</td>
                        <td className="g-tac">{data.validdate}至{data.invaliddate}</td>
                    </tr>
                    <tr>
                        <td className="title">备注</td>
                        <td className="g-tac">{data.memo}</td>
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


        return (
            <section className="g-mt-10">
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    okText={this.state.okText}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={this.state.footer}>
                    {modalContent}
                </Modal>
                <Tabs defaultActiveKey={this.status} animated="false" type="inline" onChange={this.handlerTabs}>
                    <TabPane tab="合同" key="contract">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={querySchema['contract']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true}>
                            <div className="button-group g-mb10">
                                <Button onClick={this.contractSearch.bind(this, 'due')} className="g-mr10"><Icon type="clock-circle-o" />将到期合同</Button>
                                <Button onClick={this.contractSearch.bind(this, 'shouldSign')}><Icon type="edit" />应签合同</Button>
                            </div>
                        </InnerForm>
                        {tableContractControl}
                        <InnerTable
                            loading={contractData.tableLoading}
                            columns={contractData.tableColumns}
                            dataSource={contractData.tableData}
                            ref="contract"
                            rowClassName='contract'
                            parentHandleRowClick={this.parentHandleRowClick}
                            parentHandleDoubleClick={this.parentHandleDoubleClick}
                            isRowSelection={true}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={contractData.total}
                            pageSize={contractData.pageSize}
                            skipCount={contractData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="履约保证金" key="bond">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={querySchema['bond']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true} />
                        {tableBondControl}
                        <InnerTable
                            loading={bondData.tableLoading}
                            columns={tableColumnsBond}
                            dataSource={bondData.tableData}
                            ref="bond"
                            rowClassName="bond"
                            parentHandleRowClick={this.parentHandleRowClick}
                            isRowSelection={true}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={bondData.total}
                            pageSize={bondData.pageSize}
                            skipCount={bondData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="临时摊位交款" key="notContract">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={querySchema['notContract']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true} />
                        {tableNotContractControl}
                        <InnerTable
                            loading={notContractData.tableLoading}
                            columns={tableColumnsNotContract}
                            dataSource={notContractData.tableData}
                            ref="notContract"
                            rowClassName="notContract"
                            parentHandleRowClick={this.parentHandleRowClick}
                            isRowSelection={true}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={notContractData.total}
                            pageSize={notContractData.pageSize}
                            skipCount={notContractData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default LeaseManage