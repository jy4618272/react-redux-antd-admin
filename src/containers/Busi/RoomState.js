import React, {Component} from 'react'

import { Tabs, Table } from 'antd'
const TabPane = Tabs.TabPane

const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
    }, {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
    }
]

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
    }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address'
    }
]

class RoomState extends Component {

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
            <div>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Tab 1" key="1">
                        <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} />
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">Conten of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Conten of Tab Pane 2</TabPane>
                </Tabs>
            </div>
        )
    }
}

export default RoomState
