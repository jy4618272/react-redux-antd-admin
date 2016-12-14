/**
 * 租赁配置
 * 
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import {
    Button,
    Tabs,
    Row,
    Col,
    message,
    notification
} from 'antd'
const TabPane = Tabs.TabPane
const ButtonGroup = Button.Group
import {
    Err,
    Icons,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import { paths } from 'SERVICE/config'
// 租赁配置action
import actionLease from 'ACTION/configLease'

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
        this.status = sessionStorage.getItem('configLeaseTabs') || 'room'
        this.roomStatus = sessionStorage.getItem('configLeaseRoomTabs') || 'searchAll'
        console.log('租赁配置props:', props)
        this.state = {
            clickedRowKeys: [],
            clickedRows: []
        }
        this.props.actionLease.fetchArea()
        this.initFetchSchema(this.props)
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
     * @param 包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
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

        if (this.status !== 'room') {
            this.handleCancel(this.status)
        } else {
            this.handleCancel(this.roomStatus)
        }

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
     * 租赁设置选项卡
     */
    handlerTabs = (activeKey) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })

        this.status = activeKey
        sessionStorage.setItem('configLeaseTabs', activeKey)
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
    }

    // 房间设置选项卡
    handlerRoomTabs = (activeKey) => {
        const { roomData } = this.props.configLease
        const { fetchRoomTable } = this.props.actionLease
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        this.roomStatus = activeKey
        sessionStorage.setItem('configLeaseRoomTabs', activeKey)
        if (activeKey === 'searchAll') {
            this.queryStatus = {
                status: ''
            }
        } else if (activeKey === 'searchRented') {
            this.queryStatus = {
                status: '已出租'
            }
        } else if (activeKey === 'searchNotRent') {
            this.queryStatus = {
                status: '未出租'
            }
        } else if (activeKey === 'searchVoid') {
            this.queryStatus = {
                status: '作废'
            }
        }
        this.queryObj = Object.assign({}, this.queryData, this.queryStatus)
        this.select(this.queryObj, roomData.pageSize, 0, fetchRoomTable)
    }


    // 查询
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

    /* 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
    }*/

    /**
     * 数据记录操作
     * 
     * @param 单击选中
     */
    parentHandleRowClick = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
    }

    /**
     * 数据记录操作
     * 
     * @param 取消勾选
     */
    handleCancel = (key) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        this.refs[key].handleCancelClick()
    }

    /**
     * 数据记录操作
     * 
     * @param 新增
     */
    handleAddClick = () => {
        hashHistory.push('config/config_lease/add?type=' + this.status)
    }

    /**
     * 数据记录操作
     * 房间设置、班线管理、政策优惠、客户经理列表、合同模板配置
     * @param 修改
     */
    handleEditClick = () => {
        const data = this.state.clickedRows[0]
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

    /**
     * 数据记录操作
     * 房间设置
     * @param 闲置
     */
    handleLieClick = () => {
        const {clickedRows} = this.state
        if (clickedRows.length === 1) {
            this.props.actionLease.lieRoom({
                status: "未出租",
                rentroomid: clickedRows[0].rentroomid
            })
        }
        this.handleCancel(this.roomStatus)
    }

    /**
     * 数据记录操作
     * 房间设置
     * @param 作废
     */
    handleVoidClick = () => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        const {clickedRows} = this.state
        if (clickedRows.length === 1) {
            this.props.actionLease.voidRoom({
                status: "作废",
                rentroomid: clickedRows[0].rentroomid
            })
        }
        this.handleCancel(this.roomStatus)
    }

    /**
     * 数据记录操作
     * 房间设置
     * @param 历史
    handleHistoryClick = () => { }
    */

    /**
     * 数据记录操作
     * 班线管理、政策优惠、客户经理列表、合同模板配置
     * @param 开启
     */
    handleOpenClick = () => {
        const {clickedRows} = this.state
        if (clickedRows.length === 1) {
            this.handleCancel(this.status)
            if (this.status === 'contractTpl') {
                this.props.actionLease.changeStatusContract({
                    status: "开启",
                    pactprintmodelid: clickedRows[0].pactprintmodelid
                })
            } else if (this.status === 'accountManager') {
                this.props.actionLease.changeStatusManager({
                    status: "开启",
                    salerid: clickedRows[0].salerid
                })
            } else if (this.status === 'policy') {
                this.props.actionLease.changeStatusPolicy({
                    status: "开启",
                    rentpromotionid: clickedRows[0].rentpromotionid
                })
            } else if (this.status === 'classLine') {
                this.props.actionLease.changeStatusClassLine({
                    status: "开启",
                    transportlineid: clickedRows[0].transportlineid
                })
            }
        }
    }

    /**
     * 数据记录操作
     * 班线管理、政策优惠、客户经理列表、合同模板配置
     * @param 关闭
     */
    handleCloseClick = () => {
        const { clickedRows } = this.state
        if (clickedRows.length === 1) {
            this.handleCancel(this.status)
            if (this.status === 'classLine') {
                this.props.actionLease.changeStatusClassLine({
                    status: "关闭",
                    transportlineid: clickedRows[0].transportlineid
                })
            } else if (this.status === 'policy') {
                this.props.actionLease.changeStatusPolicy({
                    status: "关闭",
                    rentpromotionid: clickedRows[0].rentpromotionid
                })
            } else if (this.status === 'accountManager') {
                this.props.actionLease.changeStatusManager({
                    status: "关闭",
                    salerid: clickedRows[0].salerid
                })
            } else if (this.status === 'contractTpl') {
                this.props.actionLease.changeStatusContract({
                    status: "关闭",
                    pactprintmodelid: clickedRows[0].pactprintmodelid
                })
            }
        }
    }

    // 字段查询
    handleDictionary = () => {
        hashHistory.push('config/config_lease/dictionary')
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
            const { roomData } = this.props.configLease
            if (this.roomStatus === 'searchAll') {
                this.queryStatus = { status: '' }
            } else if (this.roomStatus === 'searchRented') {
                this.queryStatus = { status: '已出租' }
            } else if (this.roomStatus === 'searchNotRent') {
                this.queryStatus = { status: '未出租' }
            } else if (this.roomStatus === 'searchVoid') {
                this.queryStatus = { status: '作废' }
            }
            this.queryObj = Object.assign({}, this.queryData, this.queryStatus)
            this.select(this.queryObj, roomData.pageSize, 0, fetchRoomTable)
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
        const {
            clickedRowKeys,
            clickedRows
        } = this.state

        // 按钮是否可操作
        const oneSelected = clickedRowKeys.length == 1
        let isLie
        let isVoid
        let isOpen
        let isClose
        let isEdit

        if (oneSelected && clickedRows[0].status !== '作废') {
            // 当前表格所选记录状态        
            const buttonStatus = clickedRows[0].status
            isEdit = buttonStatus !== '已出租' ? true : false
            isLie = buttonStatus === '已出租' ? true : false
            isVoid = buttonStatus === '未出租' ? true : false
            isOpen = buttonStatus === '关闭' ? true : false
            isClose = buttonStatus === '开启' ? true : false
        }
        const tableRoomControl = <ButtonGroup className="button-group g-mb10">
            <Button onClick={this.handleAddClick}><Icons type="add" />新增</Button>
            <Button onClick={this.handleEditClick} disabled={!isEdit}><Icons type="edit" />修改</Button>
            <Button onClick={this.handleLieClick} disabled={!isLie}><Icons type="lie" />闲置</Button>
            <Button onClick={this.handleVoidClick} disabled={!isVoid}><Icons type="void" />作废</Button>
            {/*<Button disabled={!oneSelected} onClick={this.handleHistoryClick}>历史</Button>*/}
        </ButtonGroup>

        const tableOtherControl = <div className="g-mb10">
            <Row>
                <Col sm={16}>
                    <ButtonGroup className="button-group">
                        <Button onClick={this.handleAddClick}><Icons type="add" />新增</Button>
                        <Button onClick={this.handleEditClick} disabled={!oneSelected}><Icons type="edit" />修改</Button>
                        <Button onClick={this.handleOpenClick} disabled={!isOpen}><Icons type="open" />开启</Button>
                        <Button onClick={this.handleCloseClick} disabled={!isClose}><Icons type="close" />关闭</Button>
                    </ButtonGroup>
                </Col>
                <Col sm={8} className="g-tar">
                    <ButtonGroup className="button-group">
                        {this.status === 'contractTpl' ? <Button className="g-fr" onClick={this.handleDictionary}><Icons type="dictionary" />字典查询</Button> : ''}
                    </ButtonGroup>
                </Col>
            </Row>
        </div>

        if (this.status === 'room') {
            roomData['room'][0].options = areaData.data
        }

        // 若是schema加载有误则显示错误原因
        if (!this.inited) {
            return (
                <Err errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="m-config">
                <Tabs defaultActiveKey={this.status} animated="false" type="card" onChange={this.handlerTabs}>
                    {/* 房间设置 */}
                    <TabPane tab="房间设置" key="room">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={roomData['room']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <Tabs defaultActiveKey={this.roomStatus} onChange={this.handlerRoomTabs}>
                            <TabPane tab="全部" key="searchAll">
                                {tableRoomControl}
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    pagination={false}
                                    ref="searchAll"
                                    rowClassName="searchAll"
                                    parentHandleRowClick={this.parentHandleRowClick}
                                    parentHandleRowClick={this.parentHandleRowClick} />
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
                                    ref="searchRented"
                                    rowClassName="searchRented"
                                    parentHandleRowClick={this.parentHandleRowClick}
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
                                    ref="searchNotRent"
                                    rowClassName="searchNotRent"
                                    parentHandleRowClick={this.parentHandleRowClick}
                                    pagination={false} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                            <TabPane tab="作废" key="searchVoid">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddClick}><Icons type="add" />新增</Button>
                                </div>
                                <InnerTable
                                    loading={roomData.tableLoading}
                                    columns={roomData.tableColumns}
                                    dataSource={roomData.tableData}
                                    isRowSelection={true}
                                    bordered={true}
                                    ref="searchVoid"
                                    rowClassName="searchVoid"
                                    parentHandleRowClick={this.parentHandleRowClick}
                                    pagination={false} />
                                <InnerPagination
                                    total={roomData.total}
                                    pageSize={roomData.pageSize}
                                    skipCount={roomData.skipCount}
                                    parentHandlePageChange={this.handlePageChange} />
                            </TabPane>
                        </Tabs>
                    </TabPane>

                    {/* 班线管理 */}
                    <TabPane tab="班线管理" key="classLine">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
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
                            ref="classLine"
                            rowClassName="classLine"
                            parentHandleRowClick={this.parentHandleRowClick}
                            pagination={false} />
                        <InnerPagination
                            total={classLineData.total}
                            pageSize={classLineData.pageSize}
                            skipCount={classLineData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>

                    {/* 政策优惠 */}
                    <TabPane tab="政策优惠" key="policy">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
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
                            ref="policy"
                            rowClassName="policy"
                            parentHandleRowClick={this.parentHandleRowClick}
                            pagination={false} />
                        <InnerPagination
                            total={policyData.total}
                            pageSize={policyData.pageSize}
                            skipCount={policyData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>

                    {/* 客户经理列表 */}
                    <TabPane tab="客户经理列表" key="accountManager">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema['accountManager']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={accountManagerData.tableLoading}
                            columns={accountManagerData.tableColumns}
                            dataSource={accountManagerData.tableData}
                            isRowSelection={true}
                            ref="accountManager"
                            rowClassName="accountManager"
                            parentHandleRowClick={this.parentHandleRowClick}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={accountManagerData.total}
                            pageSize={accountManagerData.pageSize}
                            skipCount={accountManagerData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>

                    {/* 合同模板配置 */}
                    <TabPane tab="合同模板配置" key="contractTpl">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema['contractTpl']}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableOtherControl}
                        <InnerTable
                            loading={contractTplData.tableLoading}
                            columns={contractTplData.tableColumns}
                            dataSource={contractTplData.tableData}
                            isRowSelection={true}
                            ref="contractTpl"
                            rowClassName="contractTpl"
                            parentHandleRowClick={this.parentHandleRowClick}
                            bordered={true}
                            pagination={false} />
                        <InnerPagination
                            total={contractTplData.total}
                            pageSize={contractTplData.pageSize}
                            skipCount={contractTplData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default Lease
