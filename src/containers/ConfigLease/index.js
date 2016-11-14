/**
 * 租赁配置
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'

import {
    Button,
    Tabs,
    message,
    notification
} from 'antd'
const TabPane = Tabs.TabPane

import actionLease from 'ACTION/configLease'

import Error from 'COMPONENT/Error'
import {
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

import { paths } from 'SERVICE/config'

const mapDispatchToProps = (dispatch) => ({
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ configLease }) => ({ configLease }),
    mapDispatchToProps
)
class Lease extends Component {
    constructor(props) {
        super(props)
        console.log('租赁配置props:', props)
        this.state = {
            selectedRowKeys: [],
            selectedRows: []
        }
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
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        fetchHandle(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (fetchHandle) => {
        this.select(this.queryStatus, 10, 0, fetchHandle)
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
        } = this.props.configLease

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
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })

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
        } else if (this.status === 'auditPerson') {
            alert('没有接口')
        }
        sessionStorage.setItem('leaseTabs', this.status)
    }

    handlerRoomTabs = (activeKey) => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })

        if (activeKey === 'searchAll') {
            this.queryStatus = {
                status: ''
            }
            this.queryObj = Object.assign({}, this.queryData, this.queryStatus)
            this.select(this.queryObj, this.props.configLease.roomData.pageSize, 0, this.props.actionLease.fetchRoomTable)
        } else if (activeKey === 'searchRented') {
            this.queryStatus = {
                status: '已出租'
            }
            this.queryObj = Object.assign({}, this.queryData, this.queryStatus)

            this.select(this.queryObj, this.props.configLease.roomData.pageSize, 0, this.props.actionLease.fetchRoomTable)
        } else if (activeKey === 'searchNotRent') {
            this.queryStatus = {
                status: '未出租'
            }
            this.queryObj = Object.assign({}, this.queryData, this.queryStatus)
            this.select(this.queryObj, this.props.configLease.roomData.pageSize, 0, this.props.actionLease.fetchRoomTable)
        } else if (activeKey === 'searchVoid') {
            this.queryStatus = {
                status: '作废'
            }
            this.queryObj = Object.assign({}, this.queryData, this.queryStatus)
            this.select(this.queryObj, this.props.configLease.roomData.pageSize, 0, this.props.actionLease.fetchRoomTable)
        }
    }

    /**
     * 查询
     */
    handleFormSubmit = (newData) => {
        this.queryData = newData
        const {
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData
        } = this.props.configLease

        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchBusiPolicyTable,
            fetchBusiManagerTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        this.queryObj = Object.assign({}, this.queryData, this.queryStatus)

        if (this.status === 'room') {
            this.select(this.queryObj, roomData.pageSize, 0, fetchRoomTable)
        } else if (this.status === 'classLine') {
            this.select(this.queryObj, classLineData.pageSize, 0, fetchClassLineTable)
        } else if (this.status === 'policy') {
            this.select(this.queryObj, policyData.pageSize, 0, fetchBusiPolicyTable)
        } else if (this.status === 'accountManager') {
            this.select(this.queryObj, accountManagerData.pageSize, 0, fetchBusiManagerTable)
        } else if (this.status === 'contractTpl') {
            this.select(this.queryObj, contractTplData.pageSize, 0, fetchContractTable)
        }
    }

    // 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectedRowKeys: keys,
            selectedRows: rows
        })
    }

    // 新增
    handleAddClick = () => {
        hashHistory.push('config/config_lease/add?type=' + this.status)
    }

    // 修改
    handleEditClick = () => {
        const data = this.state.selectedRows[0]
        if (this.status === 'room') {
            hashHistory.push('config/config_lease/edit/' + data.rentroomid + '?type=room')
        } else if (this.status === 'classLine') {
            hashHistory.push('config/config_lease/edit/' + data.transportlineid + '?type=classLine')
        } else if (this.status === 'policy') {
            hashHistory.push('config/config_lease/edit/' + data.rentpromotionid + '?type=policy')
        } else if (this.status === 'accountManager') {
            hashHistory.push('config/config_lease/edit/' + data.salerid + '?type=accountManager')
        } else if (this.status === 'contractTpl') {
            hashHistory.push('config/config_lease/edit/' + data.pactprintmodelid + '?type=contractTpl')
        } else if (this.status === 'auditPerson') {
            hashHistory.push('config/config_lease/edit/' + 3 + '?type=auditPerson')
        }
    }

    // 闲置
    handleLieClick = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
        const {selectedRows} = this.state
        if (selectedRows.length === 1) {
            this.props.actionLease.lieRoom({
                status: "未出租",
                rentroomid: selectedRows[0].rentroomid
            })
        }
    }

    // 作废
    handleVoidClick = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
        const {selectedRows} = this.state
        if (selectedRows.length === 1) {
            this.props.actionLease.voidRoom({
                status: "作废",
                rentroomid: selectedRows[0].rentroomid
            })
        }
    }

    // 历史
    // handleHistoryClick = () => { }

    // 开启
    handleOpenClick = () => {
        const {selectedRows} = this.state
        if (selectedRows.length === 1) {
            if (this.status === 'contractTpl') {
                this.props.actionLease.changeStatusContract({
                    status: "开启",
                    pactprintmodelid: selectedRows[0].pactprintmodelid
                })
            } else if (this.status === 'accountManager') {
                this.props.actionLease.changeStatusManager({
                    status: "开启",
                    salerid: selectedRows[0].salerid
                })
            } else if (this.status === 'policy') {
                this.props.actionLease.changeStatusPolicy({
                    status: "开启",
                    rentpromotionid: selectedRows[0].rentpromotionid
                })
            } else if (this.status === 'classLine') {
                this.props.actionLease.changeStatusClassLine({
                    status: "开启",
                    transportlineid: selectedRows[0].transportlineid
                })
            }
        }
    }

    // 关闭
    handleCloseClick = () => {
        const {selectedRows} = this.state
        if (selectedRows.length === 1) {
            if (this.status === 'contractTpl') {
                this.props.actionLease.changeStatusContract({
                    status: "关闭",
                    pactprintmodelid: selectedRows[0].pactprintmodelid
                })
            } else if (this.status === 'accountManager') {
                this.props.actionLease.changeStatusManager({
                    status: "关闭",
                    salerid: selectedRows[0].salerid
                })
            } else if (this.status === 'policy') {
                this.props.actionLease.changeStatusPolicy({
                    status: "关闭",
                    rentpromotionid: selectedRows[0].rentpromotionid
                })
            } else if (this.status === 'classLine') {
                this.props.actionLease.changeStatusClassLine({
                    status: "关闭",
                    transportlineid: selectedRows[0].transportlineid
                })
            }
        }
    }


    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        const {
            fetchArea,
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        if (this.status === 'room') {
            this.refresh(fetchRoomTable)
            fetchArea()
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
        const {
            areaData,
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData,
            auditPersonData
        } = this.props.configLease

        const {selectedRowKeys} = this.state
        const oneSelected = selectedRowKeys.length == 1
        let isLie
        let isVoid
        let isOpen
        let isClose
        let isEdit
        if (oneSelected) {
            isEdit = this.state.selectedRows[0].status !== '作废' ? true : false
            isLie = this.state.selectedRows[0].status === '已出租' ? true : false
            isVoid = this.state.selectedRows[0].status === '未出租' ? true : false
            isOpen = this.state.selectedRows[0].status === '关闭' ? true : false
            isClose = this.state.selectedRows[0].status === '开启' ? true : false
        }

        const tableRoomControl = <div className="button-group g-mb10">
            <Button onClick={this.handleAddClick}>新增</Button>
            <Button disabled={!isEdit} onClick={this.handleEditClick}>修改</Button>
            <Button disabled={!isLie} onClick={this.handleLieClick}>闲置</Button>
            <Button disabled={!isVoid} onClick={this.handleVoidClick}>作废</Button>
            {/*<Button disabled={!oneSelected} onClick={this.handleHistoryClick}>历史</Button>*/}
        </div>

        const tableOtherControl = <div className="button-group g-mb10">
            <Button onClick={this.handleAddClick}>新增</Button>
            <Button disabled={!oneSelected} onClick={this.handleEditClick}>修改</Button>
            <Button disabled={!isOpen} onClick={this.handleOpenClick}>开启</Button>
            <Button disabled={!isClose} onClick={this.handleCloseClick}>关闭</Button>
        </div>

        if (this.status === 'room') {
            roomData['room'][0].options = areaData.data
        }

        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="padding">
                <Tabs defaultActiveKey={this.status} animated="false" type="card" onChange={this.handlerTabs}>
                    <TabPane tab="房间设置" key="room">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={roomData['room']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <Tabs defaultActiveKey="searchAll" animated="false" type="inline" onChange={this.handlerRoomTabs}>
                            <TabPane tab="全部" key="searchAll">
                                {tableRoomControl}
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    pagination={false}
                                    parentHandleSelectChange={this.parentHandleSelectChange} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                            <TabPane tab="已出租" key="searchRented">
                                {tableRoomControl}
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    parentHandleSelectChange={this.parentHandleSelectChange}
                                    pagination={false} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                            <TabPane tab="未出租" key="searchNotRent">
                                {tableRoomControl}
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    parentHandleSelectChange={this.parentHandleSelectChange}
                                    pagination={false} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                            <TabPane tab="作废" key="searchVoid">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddClick}>新增</Button>
                                </div>
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    parentHandleSelectChange={this.parentHandleSelectChange}
                                    pagination={false} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                        </Tabs>
                    </TabPane>
                    <TabPane tab="班线管理" key="classLine">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['classLine']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={classLineData.tableLoading}
                            columns={classLineData.tableColumns}
                            dataSource={classLineData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleSelectChange={this.parentHandleSelectChange}
                            pagination={false} />
                        <InnerPagination
                            total={classLineData.total}
                            pageSize={classLineData.pageSize}
                            skipCount={classLineData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="政策优惠" key="policy">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['policy']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={policyData.tableLoading}
                            columns={policyData.tableColumns}
                            dataSource={policyData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleSelectChange={this.parentHandleSelectChange}
                            pagination={false} />
                        <InnerPagination
                            total={policyData.total}
                            pageSize={policyData.pageSize}
                            skipCount={policyData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="客户经理列表" key="accountManager">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['accountManager']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={accountManagerData.tableLoading}
                            columns={accountManagerData.tableColumns}
                            dataSource={accountManagerData.tableData}
                            isRowSelection={true}
                            parentHandleSelectChange={this.parentHandleSelectChange}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={accountManagerData.total}
                            pageSize={accountManagerData.pageSize}
                            skipCount={accountManagerData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="合同模板配置" key="contractTpl">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['contractTpl']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={contractTplData.tableLoading}
                            columns={contractTplData.tableColumns}
                            dataSource={contractTplData.tableData}
                            isRowSelection={true}
                            parentHandleSelectChange={this.parentHandleSelectChange}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={contractTplData.total}
                            pageSize={contractTplData.pageSize}
                            skipCount={contractTplData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    {/*<TabPane tab="审核人配置" key="auditPerson">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['auditPerson']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <InnerTable
                            loading={auditPersonData.tableLoading}
                            columns={auditPersonData.tableColumns}
                            dataSource={auditPersonData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={roomData.total}
                            pageSize={roomData.pageSize}
                            skipCount={roomData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>*/}
                </Tabs>
            </section>
        )
    }
}

export default Lease
