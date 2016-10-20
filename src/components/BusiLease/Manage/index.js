import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    Tabs,
    message,
    notification
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
class Manage extends Component {
    constructor(props) {
        super(props)
        this.status = sessionStorage.getItem('leaseManageTabs') || 'contract'
        console.log('1111122222', props)
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
        // alert(JSON.stringify(newData))
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
        console.debug('handlePageChange, page = %d', page);

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
        alert(key)
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

        return (
            <div>
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
            </div>
        )
    }
}

export default Manage