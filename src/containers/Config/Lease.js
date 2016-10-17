/**
 * 租赁配置
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link, hashHistory} from 'react-router'

import {
    Tabs,
    message
} from 'antd'
const TabPane = Tabs.TabPane

import actionLease from 'ACTION/lease'

import Error from 'COMPONENT/Error'
import InnerForm from 'COMPONENT/DBTable/InnerForm'
import InnerTable from 'COMPONENT/DBTable/InnerTable'
import InnerPagination from 'COMPONENT/DBTable/InnerPagination'

const mapDispatchToProps = (dispatch) => ({
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ lease }) => ({ lease }),
    mapDispatchToProps
)
class Lease extends Component {
    constructor(props) {
        super(props)
        this.props.actionLease.fetchArea()
        this.initFetchSchema(this.props)
        this.status = sessionStorage.getItem('leaseTabs') || 'room'
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const that = this
        const routes = props.routes
        const tableName = routes.pop().tableName // lease
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
            that.querySchema = require(`SCHEMA/${tableName}/${tableName}.querySchema.js`)
            console.log('querySchema', this.querySchema['room'])

        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

        try {
            this.controlSchema = require(`SCHEMA/${tableName}/${tableName}.controlSchema.js`)
            console.log(`加载${tableName}controlSchema`, this.controlSchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}controlSchema, 请检查配置`
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
    select = (queryObj, pageSize, skipCount, fetchHandle) => {
        const hide = message.loading('正在查询...', 0)
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        fetchHandle(tmpObj)
        setTimeout(() => {
            hide()
        }, 2000)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (fetchHandle) => {
        this.select({}, 10, 0, fetchHandle)
    }

    /**
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData
        } = this.props.lease

        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (this.status === 'room') {
            this.select(this.queryObj, roomData.pageSize, page, fetchRoomTable)
        } else if (this.status === 'classLine') {
            this.select(this.queryObj, classLineData.pageSize, page, fetchClassLineTable)
        } else if (this.status === 'policy') {
            this.select(this.queryObj, policyData.pageSize, page, fetchPolicyTable)
        } else if (this.status === 'accountManager') {
            this.select(this.queryObj, accountManagerData.pageSize, page, fetchManagerTable)
        } else if (this.status === 'contractTpl') {
            this.select(this.queryObj, contractTplData.pageSize, page, fetchContractTable)
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
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        if (this.status === 'room') {
            this.refresh(fetchRoomTable)
        } else if (this.status === 'classLine') {
            this.refresh(fetchClassLineTable)
        } else if (this.status === 'policy') {
            this.refresh(fetchPolicyTable)
        } else if (this.status === 'accountManager') {
            this.refresh(fetchManagerTable)
        } else if (this.status === 'contractTpl') {
            this.refresh(fetchContractTable)
        }
        sessionStorage.setItem('leaseTabs', this.status)
    }


    /**
     * 新增
     */
    parentHandleAdd = () => {
        hashHistory.push('config/config_lease/add?type=' + this.status)
    }

    // 新增
    parentHandleEdit = (record, index) => {
        // alert(record)
        hashHistory.push(`config/config_lease/room/edit/22`)
    }

    /**
     * 查询
     */
    handleFormSubmit = () => {

    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        if (this.status === 'room') {
            this.refresh(fetchRoomTable)
        } else if (this.status === 'classLine') {
            this.refresh(fetchClassLineTable)
        } else if (this.status === 'policy') {
            this.refresh(fetchPolicyTable)
        } else if (this.status === 'accountManager') {
            this.refresh(fetchManagerTable)
        } else if (this.status === 'contractTpl') {
            this.refresh(fetchContractTable)
        }
    }

    render() {
        const {lease} = this.props
        const {
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData,
            auditPersonData
        } = lease
        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        let formItemsSchema = [
            {
                "key": "roomGoods",
                "title": "房间物品",
                "dataType": "varchar"
            }
        ]

        return (
            <section className="padding">
                <Tabs defaultActiveKey={this.status} animated="false" type="card" onChange={this.handlerTabs}>
                    <TabPane tab="房间设置" key="room">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={roomData['room']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={roomData.tableLoading}
                            columns={roomData.tableColumns}
                            dataSource={roomData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['room']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            pagination = {false} />
                        <InnerPagination
                            total = {roomData.total}
                            pageSize = {roomData.pageSize}
                            skipCount = {roomData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                    <TabPane tab="班线管理" key="classLine">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['classLine']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={classLineData.tableLoading}
                            columns={classLineData.tableColumns}
                            dataSource={classLineData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['classLine']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                        <InnerPagination
                            total = {classLineData.total}
                            pageSize = {classLineData.pageSize}
                            skipCount = {classLineData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                    <TabPane tab="政策优惠" key="policy">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['policy']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={policyData.tableLoading}
                            columns={policyData.tableColumns}
                            dataSource={policyData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['policy']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                        <InnerPagination
                            total = {policyData.total}
                            pageSize = {policyData.pageSize}
                            skipCount = {policyData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                    <TabPane tab="客户经理列表" key="accountManager">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['accountManager']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={accountManagerData.tableLoading}
                            columns={accountManagerData.tableColumns}
                            dataSource={accountManagerData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['accountManager']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                        <InnerPagination
                            total = {accountManagerData.total}
                            pageSize = {accountManagerData.pageSize}
                            skipCount = {accountManagerData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="合同模板配置" key="contractTpl">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['contractTpl']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={contractTplData.tableLoading}
                            columns={contractTplData.tableColumns}
                            dataSource={contractTplData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['contractTpl']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                        <InnerPagination
                            total = {contractTplData.total}
                            pageSize = {contractTplData.pageSize}
                            skipCount = {contractTplData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="审核人配置" key="auditPerson">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['auditPerson']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={auditPersonData.tableLoading}
                            columns={auditPersonData.tableColumns}
                            dataSource={auditPersonData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['auditPerson']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                        <InnerPagination
                            total = {roomData.total}
                            pageSize = {roomData.pageSize}
                            skipCount = {roomData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default Lease
