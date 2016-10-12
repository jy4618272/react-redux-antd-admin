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
        console.log('111111', props)
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
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.querySchema.js`)
            console.log(this.querySchema['room'])
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
    select = (queryObj, pageSize, skipCount) => {
        const {actionLease} = this.props

        const hide = message.loading('正在查询...', 0)
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.status = this.status
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        this.queryObj = tmpObj
        // actionLease.fetchRoomTable(tmpObj)
        setTimeout(() => {
            hide()
        }, 2000)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {}) => {
        const {lease} = this.props
        this.select(queryObj, lease.roomData.pageSize, 0)
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        console.log(activeKey)
        this.refs.form.resetFields()
    }

    // 新增
    parentHandleAdd = (record, index) => {
        // alert(record)
        hashHistory.push(`config/config_lease/room/add`)   
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
        this.refresh()

        const {actionLease} = this.props
        actionLease.fetchArea()
    }

    render() {
        const {lease} = this.props
        const {roomData} = lease
        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }
        return (
            <section className="padding">
                <Tabs defaultActiveKey="room" animated="false" type="card" onChange={this.handlerTabs}>
                    <TabPane tab="房间设置" key="room">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['room']}
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
                    </TabPane>
                    <TabPane tab="班线管理" key="classLine">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['classLine']}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />
                        <InnerTable
                            loading={roomData.tableLoading}
                            columns={roomData.tableColumns}
                            dataSource={roomData.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema['classLine']}
                            bordered={true}
                            parentHandleAdd = {this.parentHandleAdd}
                            parentHandleEdit = {this.parentHandleEdit}
                            parentHandleOpen = {this.parentHandleOpen}
                            parentHandleClose = {this.parentHandleClose}
                            pagination = {false} />
                    </TabPane>
                    <TabPane tab="政策优惠" key="policy">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['policy']}
                            parentHandleSubmit = {this.handleFormSubmit} />
                    </TabPane>
                    <TabPane tab="客户经理列表" key="accountManager">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['accountManager']}
                            parentHandleSubmit = {this.handleFormSubmit} />
                    </TabPane>
                    <TabPane tab="合同模板配置" key="contractTpl">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['contractTpl']}
                            parentHandleSubmit = {this.handleFormSubmit} />
                    </TabPane>
                    <TabPane tab="审核人配置" key="auditPerson">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema['auditPerson']}
                            parentHandleSubmit = {this.handleFormSubmit} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default Lease
