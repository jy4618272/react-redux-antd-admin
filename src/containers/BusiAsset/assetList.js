/**
 * 资产主页
 * 
 */

import React, { Component } from 'react'

// 查询表单
import SearchAssetForm from 'COMPONENT/BusiAsset/assetList/searchAssetForm'
// 表格展示
import AssetTableList from 'COMPONENT/BusiAsset/assetList/assetTableList'
// 按钮组
import ButtonGroup from 'COMPONENT/BusiAsset/assetList/buttonGroup'

// querySchema
import querySchema from 'SCHEMA/busiAsset/busiAsset.querySchema.js'

import {
    InnerForm,
    InnerPagination,
    InnerTable
} from 'COMPONENT'

import {
    Pagination,
    notification
} from 'antd'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

class AssetList extends Component {
    constructor() {
        super()
        this.state = {
            selectedRow: {},
            idArray: [], //这是给批量导出／导出本页使用的参数
            searchArgument: {  // 查询参数
                assetname: '',  // 资产名称
                assetstatus: '',  // 资产状态
                assettypename2: '', // 资产分类
                flowstatus: '', // 流程状态
                parameternumber: ''  //  台账编号
            },
            pageSize: 10,   // 每页数据条数
            skipCount: 0,  // 第一页传0  第二页传10    (currentPage - 1) * pageSize
            total: 0,
            current: 1,
            dataSource: [],
            isLoading: false,
            firstClickDate: 0
        }
    }

    /**
     * DOM挂载结束后，查询一次数据
     * */
    componentDidMount() {
        this.searchAssetList({ skipCount: 0 });
    }

    /**
     * 查询
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectByIndex
     * "assetname":"资产名称",
        "pageSize":"10",
        "assetstatus":"资产状态",
        "skipCount":"0",
        "assettypename2":"资产分类",
        "flowstatus":"流程状态",
        "parameternumber":"台账编号"
     * */
    searchAssetList() {
        // 查询需要的参数
        const { searchArgument, skipCount, pageSize } = this.state
        // 合并查询参数
        const arg = Object.assign({}, searchArgument, { skipCount, pageSize })

        // 开始查询的时候loading
        this.setState({
            isLoading: true
        })
        xhr('post', paths.leasePath + '/assetcs/selectByIndex', arg, (res) => {
            if (res.result == 'success') {
                this.setState({
                    total: res.count,
                    dataSource: res.data,
                    isLoading: false
                })
            } else if (res.result == 'error') {
                notification.error({
                    message: res.msg
                })
                this.setState({
                    isLoading: false
                })
            }
        })  // xhr end
    }

    /**
     * constructor中有默认的查询参数：this.state.searchArgument
     *      当我们查询数据的时候
     *          如果查询参数有变化，先把searchArgument种把参数更新一下，然后调用查询函数searchAssetList
     *          如果查询参数没有变化，直接查询 
     *      在这里还要更新一下翻页器的current
     * */
    saveSearchArgument(newArgument) {
        // 翻页更新到第一页
        this.setState({
            current: 1
        })
        // 更新查询参数, 翻页参数skipCount需要重置，pageSize不需要修改
        this.state.searchArgument = Object.assign({}, newArgument)
        this.setState({
            skipCount: 0
        })
        // 查询
        this.searchAssetList()
    }

    /**
     * 翻页处理函数
     *  翻页操作需要更新查询参数的skipCount
     * */
    handlePagination(current) {
        console.log('current', current)
        const { pageSize } = this.state
        // 翻页器的current需要更新
        this.setState({
            current: current
        })
        // 更新翻页参数的skipCount， pageSize不需要修改
        const skipCount = (current - 1) * this.state.pageSize
        // 更新翻页参数，查询参数不变
        this.state.skipCount = skipCount
        // 查询
        this.searchAssetList()
    }

    /**
     * 将表格选中的复选框行数据传回父组件
     *
     * */
    setIdArray(idArray) {
        this.setState({
            idArray: idArray
        })
    }

    /**
     * 表格行的单击事件
     *      需要把当前行的资产信息设置到this.state.selectedRow，给按钮组使用
     * */
    handleTableRowClick(keys, rows) {    
        this.setState({
            selectedRow: rows[0]
        })
    }

    /**
     * 处理双击事件
     * 
     */
    handleTableRowDoubleClick(record, index) {
        window.open(`/#/busi/busi_asset/asset_detail/${record.assetid}`)
    }

    /**
     * 处理勾选事件
     *      需要把被选中行的资产信息设置到this.state.idArray，给按钮组的批量导出使用使用
     */
    handleTableSelectedRow(keys, rows) {
        const idArray = rows.map(v => v.assetid)
        this.setState({
            idArray
        })
    }

    /**
     * 表格的列信息
     *
     * */
    getTableCol() {
        const columns = [
            { title: '资产名称', dataIndex: 'assetname', key: 'assetname' },
            { title: '台账编号', dataIndex: 'parameternumber', key: 'parameternumber' },
            { title: '资产分类', dataIndex: 'assettypelist', key: 'assettypelist' },
            { title: '存放位置', dataIndex: 'assetarealist', key: 'assetarealist' },
            { title: '责任部门', dataIndex: 'assetdeplist', key: 'assetdeplist' },
            { title: '责任人', dataIndex: 'owner', key: 'owner' },
            { title: '流程状态', dataIndex: 'flowstatus', key: 'flowstatus' },
            { title: '资产状态', dataIndex: 'assetstatus', key: 'assetstatus' }
        ]
        return columns
    }

    render() {
        const { total, current, pageSize, dataSource, isLoading } = this.state
        return (
            <div>
                {/** 查询表但 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={querySchema}
                    parentHandleSubmit={this.saveSearchArgument.bind(this)}
                    showSearch={true}></InnerForm>
                <div>
                    {/** 按钮组 */}
                    <ButtonGroup
                        selectedRow={this.state.selectedRow}
                        idArray={this.state.idArray}
                        total={this.state.total}
                        />
                    {/** 表格 */}
                    <InnerTable
                        loading={isLoading}
                        columns={this.getTableCol()}
                        dataSource={dataSource}
                        ref="asset"
                        rowClassName="asset"
                        parentHandleRowClick={this.handleTableRowClick.bind(this)}
                        parentHandleDoubleClick={this.handleTableRowDoubleClick.bind(this)}
                        parentHandleSelectChange={this.handleTableSelectedRow.bind(this)}
                        isRowSelection={true}
                        bordered={true}
                        pagination={false} />
                </div>
                <div>
                    {/** 翻页 */}
                    <InnerPagination
                        total={total}
                        pageSize={pageSize}
                        skipCount={current}
                        parentHandlePageChange={this.handlePagination.bind(this)} />
                </div>
            </div>
        )
    }
}

export default AssetList