/**
 * 页面分四个部分：进度，按钮组，详情，操作历史
 * 
 * 
 */
import React, { Component } from 'react'

import {
    Tabs,
    Table,
    Button,
    Popconfirm,
    message
} from 'antd'
const TabPane = Tabs.TabPane

// 展示资产信息
import AssetInfo from 'COMPONENT/BusiAsset/component/assetInfoDisplay'

// ajax 工具
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import { getAssetDetailWorkFlow } from 'COMPONENT/BusiAsset/component/workFlowDisplay'

import {
    Cards,
    WorkFlow,
} from 'COMPONENT'

import { hashHistory } from 'react-router'

import { breakAsset } from 'COMPONENT/BusiAsset/service/operate'

class AssetDetail extends Component {
    constructor() {
        super()
        this.state = {
            flow: '',
            buttonGroup: ''
        }
    }

    componentWillMount() {
        // init01: 初始化流程状态图
        this.setFlow()

        // init02: 初始化按钮组
        this.setButtonGroup()
    }

    breakAsset() {
        const { id: assetid } = this.props.params
        breakAsset({ assetid }).then((data) => {
            // 终止资产成功后，需要刷新
            history.go(0) 
        })
    }

    setButtonGroup() {
        this.fetchAssetInfoById().then((res) => {
            let { assetstatus, flowstatus, assetid, assettypename2 } = res

            const buttonType = {
                type: 'default',
                htmlType: 'button',
                style: { margin: '0 5px 0 0' }
            }

            if (assettypename2 == '动产') {
                assettypename2 = 1
            } else if (assettypename2 == '不动产') {
                assettypename2 = 2
            } else if (assettypename2 == '低值易耗品') {
                assettypename2 = 3
            }

            let xg = ''
            let url = ''
            if (flowstatus.search('调拨-待提交') != -1) {
                url = `busi/busi_asset/operate/${assettypename2}/${assetid}/true/db`
            } else if (flowstatus.search('闲置-待提交') != -1) {
                url = `busi/busi_asset/operate/${assettypename2}/${assetid}/true/xz`
            } else if (flowstatus.search('报废-待提交') != -1) {
                url = `busi/busi_asset/operate/${assettypename2}/${assetid}/true/bf`
            } else if (flowstatus.search('处置-待提交') != -1) {
                url = `busi/busi_asset/operate/${assettypename2}/${assetid}/true/cz`
            } else if (flowstatus.search('新增-待提交') != -1 || flowstatus.search('审批退回') !== -1) {
                // busi/busi_asset/new  /:assetType/:id/:isModify
                url = `busi/busi_asset/add/${assettypename2}/${assetid}/true`
            }

            // 调拨／闲置／报废／处置／调拨-待提交／闲置-待提交／报废-待提交／处置-待提交
            // * busi/busi_asset/operate  /:assetType/:id/:isModify/:operateType
            // * busi/busi_asset/new  /:assetType/:id/:isModify

            let btn = [
                <Button { ...buttonType } onClick={() => { window.close() } }>确认</Button>, // 0
                <Button { ...buttonType } onClick={() => { hashHistory.push(`busi/busi_asset/operate/${assettypename2}/${assetid}/false/db`) } }>调拨</Button>, // 1
                <Button { ...buttonType } onClick={() => { hashHistory.push(`busi/busi_asset/operate/${assettypename2}/${assetid}/false/xz`) } }>闲置</Button>, // 2
                <Button { ...buttonType } onClick={() => { hashHistory.push(`busi/busi_asset/operate/${assettypename2}/${assetid}/false/bf`) } }>报废</Button>, // 3
                <Button { ...buttonType } onClick={() => { hashHistory.push(`busi/busi_asset/operate/${assettypename2}/${assetid}/false/cz`) } }>处置</Button>, // 4
                <Popconfirm title="是否确认终止当前资产?" okText="确认" cancelText="取消"
                    onConfirm={this.breakAsset.bind(this)} >
                    <Button { ...buttonType }>终止</Button>
                </Popconfirm>, // 5
                <Button { ...buttonType }>责任牌</Button>, // 6
                <Button { ...buttonType }>处置单</Button>, // 7
                <Button { ...buttonType } onClick={() => { hashHistory.push(url) } }>修改</Button> // 8
            ]
            if (assetstatus === '已归档') {
                // allow = { db: {}, xz: {}, bf: {}, zrp: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[1], btn[2], btn[3], btn[6])
                })
            } else if (assetstatus === '已闲置') {
                // allow = { db: {}, bf: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[1], btn[3])
                })
            } else if (assetstatus === '已报废') {
                // allow = { cz: {}, zrp: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[4], btn[6])
                })
            } else if (assetstatus === '已处置') {
                // allow = { czd: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[7])
                })
            } else if (assetstatus === '处理中' && flowstatus.search('待提交') !== -1) {
                // allow = { xg: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[8])
                })
            } else if (assetstatus === '处理中' && flowstatus.search('审批退回') !== -1) {
                //审批通过  此时资产状态已经不是处理中了
                //审批退回  此时可以终止／修改
                //审批中  不可以进行任何操作
                // allow = { zz: {}, xg: {} }
                this.setState({
                    buttonGroup: [].concat(btn[0], btn[5], btn[8])
                })
            } else {
                this.setState({
                    buttonGroup: [].concat(btn[0])
                })
            }
        })
    }

    /**
     * 根据id获取资产信息
     *  http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectAssetById
     */
    fetchAssetInfoById() {
        const { id: assetid } = this.props.params
        return new Promise((resolve, reject) => {
            xhr('post', paths.leasePath + '/assetcs/selectAssetById', { assetid }, (res) => {
                if (res.result == 'success') {
                    // 如果获取数据成功，返回获取到的数据
                    resolve(res.data)
                } else {
                    // 如果获取数据失败，直接报错,不需要返回数据
                    reject(res.msg)
                    errHandler(res.msg)
                }
            })
        })
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

    /**
     *  设置流程图
     * 
     */
    setFlow() {
        const { id } = this.props.params
        const arg = {
            id: id, // 资产id
            servicetype: '资产'   //  固定参数值，资产
        }

        getAssetDetailWorkFlow(arg).then((data) => {
            this.setState({
                flow: <WorkFlow flow={data} />
            })
        }, (error) => {
            errHandler(error)
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
        const { id } = this.props.params
        const { flow, buttonGroup } = this.state

        return (
            <div>
                <Cards title="流程状态">
                    {flow}
                </Cards>

                <div>
                    <Cards>
                        {buttonGroup}
                    </Cards>
                </div>

                <div>
                    <AssetInfo assetid={id} />
                </div>
                <div style={{ padding: '0 0px 30px 0px' }}>
                    <Tabs type="card">
                        <TabPane key={1} tab="新增">
                            <Table pagination={false} columns={xzAsset} dataSource={[]} />
                        </TabPane>
                        <TabPane key={2} tab="调拨">
                            <Table pagination={false} columns={db} dataSource={[]} />
                        </TabPane>
                        <TabPane key={3} tab="闲置">
                            <Table pagination={false} columns={db} dataSource={[]} />
                        </TabPane>
                        <TabPane key={4} tab="报废">
                            <Table pagination={false} columns={bf} dataSource={[]} />
                        </TabPane>
                        <TabPane key={5} tab="处置">
                            <Table pagination={false} columns={cz} dataSource={[]} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default AssetDetail