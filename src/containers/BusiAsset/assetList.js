/**
 * 资产主页
 * 
 */

import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
//
import SearchAssetForm from 'COMPONENT/BusiAsset/assetList/searchAssetForm'
import AssetTableList from 'COMPONENT/BusiAsset/assetList/assetTableList'
import ButtonGroup from 'COMPONENT/BusiAsset/assetList/buttonGroup'
//
// import searchAssetAction from 'ACTION/busiAsset/searchAsset'
//
// const mapDispatchToProps = (dispatch) => ({
//     AssetAction: bindActionCreators(searchAssetAction, dispatch)
// })
//
// @connect(
//     ({ busiAsset }) => ({ busiAsset }),
//     mapDispatchToProps
// )
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
            selectedRow: { // 控制按钮的disabled
                status: {
                    // flowstatus: record.flowstatus, 流程状态
                    // assetstatus: record.assetstatus  资产状态
                },
                id: null,   // 给普通操作按钮使用
            },
            idArray: [], //这是给批量导出／导出本页使用的参数
            searchArgument: {  // 查询参数
                assetname: '',  // 资产名称
                assetstatus: '',  // 资产状态
                assettypename2: '', // 资产分类
                flowstatus: '', // 流程状态
                parameternumber: '',  //  台账编号
                pageSize: 20,   // 每页数据条数
                skipCount: 0  // 第一页传0  第二页传10    (currentPage - 1) * pageSize

            },
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
        // 开始查询的时候loading
        this.setState({
            isLoading: true
        })
        // 查询参数this.state.searchArgument
        this.state.searchArgument.skipCount = (this.state.current - 1) * 10
        xhr('post', paths.leasePath + '/assetcs/selectByIndex', this.state.searchArgument, (res) => {
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
     * 作用：传递给子组建（筛选的表单），当表单触发查询时，将查询条件通过到当前组件中的this.state.searchArgument
     *      然后查询
     * saveSearchArgument 用于查询表单同步查询条件到主页面的state，保持翻页时查询条件的同步
     * param (newArgument Object) 新的查询条件
     * */
    saveSearchArgument(newArgument) {
        // 翻页更新到第一页
        this.setState({
            current: 1
        })
        // 更新查询参数
        this.state.searchArgument = newArgument
        // 查询
        this.searchAssetList()
    }

    /**
     * 翻页处理函数
     *
     * */
    handlePagination(current) {
        this.state.current = current

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
     * 选中表格的某一行 或 取消已经被选中的行
     *  1. 样式的切换
     *  2. 将被选中行的数据设置到this.state.selectedRow 给按钮组使用
     *
     * */
    selectTableRow(record, index) {

        /**
         * 每次点击，先用currentDate - this.state.firstClickDate < 500, 判断是否是双击
         *  如果是双击，则新窗口打开详情页
         * 
         *  最后要更新this.state.firstClickDate
         * 
         */
        let currentDate = new Date().getTime();
        (currentDate - this.state.firstClickDate < 500) 
            ? (window.open(`/#/busi/busi_asset/asset_detail/${record.assetid}`))
            : ('')
        this.state.firstClickDate = currentDate

        // 表格中所有的行
        let tableRow = document.getElementsByClassName('assetTableListRowClassName')
        // 将类数组转成数组
        tableRow = Array.prototype.slice.call(tableRow)
        /**
         * 通过被点击行字体颜色，判断被点击行是否已经被选中
         * 如果 当前行字体颜色是rgb(255, 97, 0)，则说明已经被选中     rgb(255, 97, 0)===#ff6100
         * */
        if (tableRow[index].style.color != 'rgb(255, 97, 0)') { //没有被选中
            tableRow[index].style.color = '#ff6100'
            // 把选中的行从数组中去掉，防止下面颜色被重置
            tableRow.splice(index, 1)
            this.setState({
                selectedRow: {
                    status: {
                        flowstatus: record.flowstatus,   // 流程状态
                        assetstatus: record.assetstatus  // 资产状态
                    },
                    id: record.assetid,               // 资产id
                    assetname: record.assetname,      // 资产名
                    assettypename2: record.assettypename2  //资产类型
                }
            })
        } else { // 已经被选中, 现在要取消被选中状态
            // 不需要设置颜色，后面所有行颜色都会被重置，只需要清空this.state.selectedRow数据
            this.setState({
                selectedRow: {
                    status: {},
                    id: null
                }
            })
        }
        // 将表格所有的行字体颜色恢复最初状态 #666
        for (let i = 0; i < tableRow.length; i++) {
            tableRow[i].style.color = '#666'
        }
    }

    render() {
        return (
            <div>
                <SearchAssetForm
                    saveSearchArgument={this.saveSearchArgument.bind(this)}
                    isLoading={this.state.isLoading}
                    />
                <div>
                    <ButtonGroup
                        selectedRow={this.state.selectedRow}
                        idArray={this.state.idArray}
                        total={this.state.total}
                        />
                    <AssetTableList
                        selectTableRow={this.selectTableRow.bind(this)}
                        setIdArray={this.setIdArray.bind(this)}
                        dataSource={this.state.dataSource}
                        isLoading={this.state.isLoading}
                        />
                </div>
                <div style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ float: 'right' }}>
                        <Pagination
                            total={this.state.total}
                            showTotal={total => `总共${total}条`}
                            showQuickJumper
                            pageSize={this.state.searchArgument.pageSize}
                            current={this.state.current}
                            onChange={this.handlePagination.bind(this)}
                            />
                    </div>
                </div>
            </div>
        )
    }
}

export default AssetList