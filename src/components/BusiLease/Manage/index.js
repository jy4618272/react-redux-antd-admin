import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'

import {
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
            modalName: 'insertBond',
            modalVisible: false,
            modalTitle: '新增',
            okText:'确定',
            modalWidth: '900'
        }
        // console.log('props:', props)
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

    // 按钮
    parentHandleClick = (key, data) => {
        if (key === 'addContract') {
            hashHistory.push('busi/busi_lease/add?type=' + this.status)
        } else if (key === "addBond") {
            this.setState({
                modalVisible: true,
                okText:'保存'
            })
        }
    }

    handleModalOk = () => {
        if (this.status === 'bond') {
            console.log(this.refs.formInsert.getFieldsValue());
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
                        <InnerTable
                            loading={contractData.tableLoading}
                            columns={contractData.tableColumns}
                            dataSource={contractData.tableData}
                            schema={controlSchema['contract']}
                            parentHandleClick={this.parentHandleClick}
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
                            schema={controlSchema['bond']}
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
                            schema={controlSchema['notContract']}
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