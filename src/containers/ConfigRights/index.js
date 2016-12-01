/**
 * 租赁配置
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'

import {
    Tabs,
    message,
    notification
} from 'antd'
const TabPane = Tabs.TabPane

import configRights from 'ACTION/configRights'

import Error from 'COMPONENT/Error'
import {
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

const mapDispatchToProps = (dispatch) => ({
    actionRights: bindActionCreators(configRights, dispatch)
})

@connect(
    ({ configRights }) => ({ configRights }),
    mapDispatchToProps
)
class Lease extends Component {
    constructor(props) {
        super(props)
        console.log('11111', props)
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
            departmentData,
            postData,
            roleData,
            userData
        } = this.props.configRights

        const {
            fetchDepartmentTable,
            fetchPostTable,
            fetchRoleTable,
            fetchUserTable
        } = this.props.actionRights

        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (this.status === 'department') {
            this.select(this.queryObj, departmentData.pageSize, page, fetchDepartmentTable)
        } else if (this.status === 'post') {
            this.select(this.queryObj, postData.pageSize, page, fetchPostTable)
        } else if (this.status === 'role') {
            this.select(this.queryObj, roleData.pageSize, page, fetchRoleTable)
        } else if (this.status === 'user') {
            this.select(this.queryObj, userData.pageSize, page, fetchUserTable)
        }
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.status = activeKey

        const {
            fetchDepartmentTable,
            fetchPostTable,
            fetchRoleTable,
            fetchUserTable
        } = this.props.actionRights

        if (this.status === 'department') {
            this.refresh(fetchDepartmentTable)
        } else if (this.status === 'post') {
            this.refresh(fetchPostTable)
        } else if (this.status === 'role') {
            this.refresh(fetchRoleTable)
        } else if (this.status === 'user') {
            this.refresh(fetchUserTable)
        }
    }


    /**
     * 新增
     */
    parentHandleClick = (key, data) => {

    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        const {
            fetchDepartmentTable
        } = this.props.actionRights

        this.refresh(fetchDepartmentTable)
    }

    render() {
        const {
            departmentData,
            postData,
            roleData,
            userData
        } = this.props.configRights
        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        return (
            <section>
                <Tabs defaultActiveKey="department" animated="false" type="card" onChange={this.handlerTabs}>
                    <TabPane tab="部门管理" key="department">
                        <InnerTable
                            loading={departmentData.tableLoading}
                            columns={departmentData.tableColumns}
                            dataSource={departmentData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                        <InnerPagination
                            total={departmentData.total}
                            pageSize={departmentData.pageSize}
                            skipCount={departmentData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                    <TabPane tab="岗位管理" key="post">
                        <InnerTable
                            loading={postData.tableLoading}
                            columns={postData.tableColumns}
                            dataSource={postData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                        <InnerPagination
                            total={postData.total}
                            pageSize={postData.pageSize}
                            skipCount={postData.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                    <TabPane tab="角色管理" key="role">
                        <InnerTable
                            loading={roleData.tableLoading}
                            columns={roleData.tableColumns}
                            dataSource={roleData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                        <InnerPagination
                            total={roleData.total}
                            pageSize={roleData.pageSize}
                            skipCount={roleData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="用户管理" key="user">
                        <InnerTable
                            loading={userData.tableLoading}
                            columns={userData.tableColumns}
                            dataSource={userData.tableData}
                            isRowSelection={true}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                        <InnerPagination
                            total={userData.total}
                            pageSize={userData.pageSize}
                            skipCount={userData.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default Lease
