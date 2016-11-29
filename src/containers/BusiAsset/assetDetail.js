/**
 * 页面分四个部分：进度，按钮组，详情，操作历史
 * 
 * 
 */
import React, { Component } from 'react'

import {
    Tabs,
    Table
} from 'antd'
const TabPane = Tabs.TabPane

import StepsComponent from 'COMPONENT/BusiAsset/component/stepsComponent'
import AssetInfoParse from 'COMPONENT/BusiAsset/component/assetInfoParse'

class AssetDetail extends Component {
    constructor() {
        super()
        this.state = {
            current: 3,
            steps: [   // stepsComponent
                { title: '内勤1', description: '张琪亚 ｜ 新增' },
                { title: '管理员', description: '李媛风 ｜ 审核' },
                { title: '财务员', description: '母庆业 ｜ 审核' },
                { title: '完成', description: '' }
            ]
        }
    }
    componentDidMount() {
        this.setState()
    }
    /**
     * 从一个数组中(arr)，取出指定(indexArr)数据组成一个新的数组返回
     * 
     */
    getArray(arr, indexArr) {
        return indexArr.map((v) => {
            return arr[v]
        })
    }

    getTableHeader() {
        // 五种表格头数组组成的对象
        let tableHeaders = {}
        // 所有表格的列数据
        let columns = [
            { title: '录入时间', dataIndex: 'q', key: '0' },  //0
            { title: '录入人', dataIndex: 'w', key: '1' },    //1
            { title: '发起时间', dataIndex: 'e', key: '2' },   //2
            { title: '发起人', dataIndex: 'r', key: '3' },  //3
            { title: '责任人', dataIndex: 't', key: '4' }, //4
            { title: '责任部门', dataIndex: 'y', key: '5' }, //5
            { title: '存放位置', dataIndex: 'u', key: '6' }, //6
            { title: '备注', dataIndex: 'i', key: '7' }, //7
            { title: '原因', dataIndex: 'o', key: '8' }, //8
            { title: '处置价格', dataIndex: 'p', key: '9' }, //9
            { title: '处置方式', dataIndex: 'a', key: '10' },  //10
        ]

        // 新增   录入时间，录入人
        tableHeaders.xzAsset = this.getArray(columns, [0, 1])
        // 调拨，闲置   发起时间，发起人，责任人，责任部门，存放位置，备注
        tableHeaders.db = this.getArray(columns, [2, 3, 4, 5, 6, 7])
        // 报废   发起时间，发起人，责任人，责任部门，存放位置，原因
        tableHeaders.bf = this.getArray(columns, [2, 3, 4, 5, 6, 8])
        // 处置  发起时间，发起人，处置方式，处置价格，备注
        tableHeaders.cz = this.getArray(columns, [2, 3, 10, 9, 7])

        return tableHeaders
    }
    /**
     * 渲染
     *
     * */
    render() {
        // 表格头   xzAsset｜新增历史   db｜(调拨历史／闲置历史)   bf｜报废历史   cz｜处置历史
        const { xzAsset, db, bf, cz } = this.getTableHeader()
        
        return (
            <div>
                <div>
                    <StepsComponent current={this.state.current} steps={this.state.steps} />
                </div>
                <div>
                    <AssetInfoParse />
                </div>
                <div style={{ padding: '0 20px 30px 20px' }}>
                    <Tabs type="card">
                        <TabPane key={1} tab="新增">
                            <Table pagination={false} columns={xzAsset} dataSource={[]}/>
                        </TabPane>
                        <TabPane key={2} tab="调拨">
                            <Table pagination={false} columns={db} dataSource={[]}/>
                        </TabPane>
                        <TabPane key={3} tab="闲置">
                            <Table pagination={false} columns={db} dataSource={[]}/>
                        </TabPane>
                        <TabPane key={4} tab="报废">
                            <Table pagination={false} columns={bf} dataSource={[]}/>
                        </TabPane>
                        <TabPane key={5} tab="处置">
                            <Table pagination={false} columns={cz} dataSource={[]}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default AssetDetail