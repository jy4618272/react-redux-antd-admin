import React, {Component} from 'react'

import { 
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import {
    RoomState,
    Manage
} from 'COMPONENT/BusiLease'


class LeaseBusi extends Component {
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
                <Tabs defaultActiveKey="leaseManage" animated="false" type="card" onTabClick={this.handlerTabs}>
                    <TabPane tab="房态图" key="leaseRoomState">
                        <RoomState />
                    </TabPane>
                    <TabPane tab="租赁管理" key="leaseManage">
                        <Manage />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}

export default LeaseBusi
