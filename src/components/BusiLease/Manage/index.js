import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'

import {
    Row,
    Col,
    Button,
    Tabs,
    message,
    notification,
    Modal
} from 'antd'
const TabPane = Tabs.TabPane

import {
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import { paths } from 'SERVICE/config'

import actionLease from 'ACTION/busiLease'

const mapDispatchToProps = (dispatch) => ({
    actionLease: bindActionCreators(actionLease, dispatch)
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
            selectedRowKeys: [],
            selectedRows: [],
            modalName: 'insertBond',
            modalVisible: false,
            modalTitle: '新增',
            okText: '确定',
            modalWidth: '900'
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
        } = this.props.actionLease

        if (this.status === 'contract') {
            this.select(newData, contractData.pageSize, 0, fetchContractTable)
        } else if (this.status === 'bond') {
            this.select(newData, bondData.pageSize, 0, fetchBondTable)
        } else if (this.status === 'notContract') {
            this.select(newData, notContractData.pageSize, 0, fetchNotContractTable)
        }
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
        } = this.props.actionLease

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
        this.refs.form.resetFields()
        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.actionLease

        if (this.status === 'contract') {
            this.refresh(fetchContractTable)
        } else if (this.status === 'bond') {
            this.refresh(fetchBondTable)
        } else if (this.status === 'notContract') {
            this.refresh(fetchNotContractTable)
        }
        sessionStorage.setItem('leaseManageTabs', this.status)
    }


    // 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectedRowKeys: keys,
            selectedRows: rows
        })
    }

    // 合同新增
    handleAddContract = () => {
        hashHistory.push('busi/busi_lease/contract/add')
    }

    // 合同审批
    handleApprovalContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            hashHistory.push('busi/busi_lease/contract/approval/' + data[0].rentpactid + '?type=view')
        }

    }

    // 合同续租
    handleRenewContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/renew/${data[0].rentpactid}`)
        }
    }

    // 合同变更-保存flowtype一定是‘变更’
    handleChangeContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/change/${data[0].rentpactid}?type="变更"`)
        }

    }

    // 合同编辑-保存flowtype根据原来的状态
    handleEditContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/change/${data[0].rentpactid}?type=${data[0].flowtype}`)
        }

    }

    // 合同退租
    handleRentContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            hashHistory.push(`busi/busi_lease/contract/rent/${data[0].rentpactid}?type=rent`)
        }
    }

    // 合同作废
    handleVoidContract = () => {
        const data = this.state.selectedRows
        if (data.length == 1) {
            this.props.actionLease.voidContract({
                rentpactid: data[0].rentpactid
            })
        }
    }

    // 合同交款
    handlePayContract = () => {
        hashHistory.push('busi/busi_lease/contract/pay')
    }

    // 导出本页
    handleExportPage = () => {
        const {
            busiLease
        } = this.props

        // alert('缺接口')
        let arrParam = []

        busiLease.contractData.tableData.map(item => {
            arrParam.push(item.rentpactid)
        })

        if (arrParam.length) {
            notification.open({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });

            window.location.href = paths.leasePath + '/rentpactcs/selectByRentPactIdListToExcel?rentpactids=' + arrParam.join(',')
        } else {
            notification.open({
                message: '导出本页',
                description: '本页没有数据',
            });
        }
    }

    parentHandleClick = (key, data) => {
        if (key === "addBond") {
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
        if (this.status === 'bond') {
            this.refs.formInsert.resetFields()
        }
        this.setState({
            modalVisible: false
        })
    }


    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        const {
            fetchContractTable,
            fetchBondTable,
            fetchNotContractTable
        } = this.props.actionLease

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
            querySchema,
            controlSchema
        } = this.props

        const {
            contractData,
            bondData,
            notContractData
        } = this.props.busiLease

        const {
            selectedRowKeys,
            selectedRows
        } = this.state
        const oneSelected = selectedRowKeys.length == 1

        let isApproval = false   // 审批
        let isRenew = false      // 续租
        let isChange = false     // 变更
        let isEdit = false       // 编辑
        let isRent = false       // 退租
        let isVoid = false       // 作废

        if (oneSelected && (selectedRows[0].endtype !== '作废')) {
            const selected = selectedRows[0]
            if (selected.flowtype === '新增/续租') {
                if (selected.flowstatus === '录入未完成') {
                    if (selected.fistatus === '未提交') {
                        // 作废
                        if(selectedRows[0].endtype !== '作废'){
                            isVoid = true
                        }
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废
                        if(selectedRows[0].endtype !== '作废'){
                            isVoid = true
                        }
                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isRenew = true
                        isRent = true
                        isChange = true
                    } else if (selected.fistatus === '已退') {
                        // 编辑、作废
                        isEdit = true
                        if(selectedRows[0].endtype !== '作废'){
                            isVoid = true
                        }
                    }
                } else if (selected.flowstatus === '审批中') {
                    if (selected.fistatus === '未提交') {
                        // 催办
                    } else if (selected.fistatus === '待财务确认') {
                        // 催办
                    } else if (selected.fistatus === '有效') {
                        // 催办
                    } else if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {

                    } else if (selected.fistatus === '待财务确认') {

                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isRenew = true
                        isRent = true
                        isChange = true
                    } else if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '未提交') {
                        // 作废、编辑
                        isVoid = true
                        isEdit = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废、编辑
                        isVoid = true
                        isEdit = true
                    } else if (selected.fistatus === '有效') {
                        // 编辑
                        isEdit = true
                    } else if (selected.fistatus === '已退') {
                        // 作废、编辑
                        isVoid = true
                        isEdit = true
                    }
                }
            } else if (selected.flowtype === '变更') {
                if (selected.flowstatus === '审批中') {
                    if (selected.fistatus === '未提交') {
                        // 催办
                    } else if (selected.fistatus === '待财务确认') {
                        // 催办
                    } else if (selected.fistatus === '有效') {
                        // 催办
                    } else if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '未提交') {
                        // 撤回
                    } else if (selected.fistatus === '待财务确认') {

                    } else if (selected.fistatus === '有效') {
                        // 续租、退租、变更
                        isRenew = true
                        isRent = true
                        isChange = true
                    } else if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '未提交') {
                        // 编辑
                        isEdit = true
                    } else if (selected.fistatus === '待财务确认') {
                        // 作废、编辑
                        isVoid = true
                        isEdit = true
                    } else if (selected.fistatus === '有效') {
                        // 编辑
                        isEdit = true
                    } else if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                }
            } else if (selected.flowtype === '退租') {
                if (selected.flowstatus === '审批中') {
                    // 催办
                } else if (selected.flowstatus === '审批通过') {
                    if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                } else if (selected.flowstatus === '审批退回') {
                    if (selected.fistatus === '已退') {
                        // 编辑
                        isEdit = true
                    }
                }
            }
        }

        const tableContractControl = <div className="button-group g-mb10">
            <Row>
                <Col sm={16}>
                    <Button onClick={this.handleAddContract}>新增</Button>
                    <Button disabled={!isApproval} onClick={this.handleApprovalContract}>审批</Button>
                    <Button disabled={!isRenew} onClick={this.handleRenewContract}>续租</Button>
                    <Button disabled={!isChange} onClick={this.handleChangeContract}>变更</Button>
                    <Button disabled={!isEdit} onClick={this.handleEditContract}>编辑</Button>
                    <Button disabled={!isRent} onClick={this.handleRentContract}>退租</Button>
                    <Button disabled={!isVoid} onClick={this.handleVoidContract}>作废</Button>
                    <Button onClick={this.handlePayContract}>合同交款</Button>
                </Col>
                <Col sm={8} className="g-tar">
                    {/*<Button type="primary" onClick={this.handlePrintContract}>打印</Button>*/}
                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                </Col>
            </Row>
        </div>


        let modalContent = ''
        if (this.state.modalName === 'insertBond') {
            modalContent = <InnerForm
                ref="formInsert"
                schema={this.props.insertBondSchema}
                parentHandleSubmit={this.handleFormSubmit} />
        }
        return (
            <section>
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    okText={this.state.okText}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <Tabs defaultActiveKey={this.status} animated="false" type="inline" onChange={this.handlerTabs}>
                    <TabPane tab="合同" key="contract">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['contract']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true} />
                        {tableContractControl}
                        <InnerTable
                            loading={contractData.tableLoading}
                            columns={contractData.tableColumns}
                            dataSource={contractData.tableData}
                            parentHandleSelectChange={this.parentHandleSelectChange}
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
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['bond']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true} />
                        <InnerTable
                            loading={bondData.tableLoading}
                            columns={bondData.tableColumns}
                            dataSource={bondData.tableData}
                            parentHandleClick={this.parentHandleClick}
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
                            formStyle="g-mb20 m-advance-filter"
                            schema={querySchema['notContract']}
                            parentHandleSubmit={this.handleFormSubmit}
                            showSearch={true} />
                        <InnerTable
                            loading={notContractData.tableLoading}
                            columns={notContractData.tableColumns}
                            dataSource={notContractData.tableData}
                            parentHandleClick={this.parentHandleClick}
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