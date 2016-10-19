import React, {Component} from 'react'

import { 
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import {
    RoomState,
    Manage
} from 'COMPONENT/BusiLease'


class BusiLease extends Component {
    constructor(props){
        super(props)
        this.initFetchSchema(this.props)
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props){
        const routes = props.routes
        const tableName = routes.pop().tableName

        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.querySchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

         try {
            this.controlSchema = require(`SCHEMA/${tableName}/${tableName}.controlSchema.js`)
            console.log(this.controlSchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

    }

    render() {
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows)
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows)
            }
        }

        return (
            <section className="padding m-lease-busi">
                <Tabs defaultActiveKey="leaseRoomState" animated="false" type="card" onTabClick={this.handlerTabs}>
                    <TabPane tab="房态图" key="leaseRoomState">
                        <RoomState />
                    </TabPane>
                    <TabPane tab="租赁管理" key="leaseManage">
                        <Manage 
                            querySchema={this.querySchema} 
                            controlSchema={this.controlSchema} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default BusiLease
