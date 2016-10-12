/**
 * 表格组件
 */
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {
    Table,
    Affix,
    Button,
    Form,
    DatePicker,
    Select,
    Icon,
    Radio,
    InputNumber,
    Input,
    Checkbox,
    Modal,
    Row,
    Col,
    message,
    notification
} from 'antd'

const FormItem = Form.Item
const ButtonGroup = Button.Group

import {rootPath} from 'SERVICE/config'

class InnerTable extends Component {
    constructor(props) {
        super(props)
        this.exportUrl = rootPath + '/financeParkAdmin/financecollectioncs/exportFinanceListExcel?'
        this.state = {
            selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            selectedRows: []  // 当前有哪些行被选中, 保存完整数据
        }
    }

    /**
     * 处理表格的选择事件
     *
     * @param selectedRowKeys
     * @param selectedRows
     */
    handleSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys)
        console.log('selectedRows', selectedRows)
        let arrPaytype = []
        this.setState({
            selectedRowKeys,
            selectedRows
        })
        selectedRows.map(item => {
            arrPaytype.push(item.paytype)
        })
        this.isReceiveShow = (arrPaytype.length > 0) && arrPaytype.every((text) => text === '收款')
        this.isRefundShow = (arrPaytype.length > 0) && arrPaytype.every((text) => text === '退款')
        // console.log(this.isReceiveShow)
        // console.log(this.isRefundShow)
    }

    /**
     * 点击确认收款按钮
     */
    handleReceive = (e) => {
        e.preventDefault();
        // 是否选择了多项
        this.props.parentHandleReceive(this.state.selectedRows)
    }

    /**
     * 点击退款收款按钮
     */
    handleRefund = (e) => {
        e.preventDefault();
        this.props.parentHandleRefund(this.state.selectedRows)
        this.rowSelectionReset()

    }

    /**
     * 点击批量按钮
     */
    handleExport = (e) => {
        e.preventDefault();
        this.props.parentHandleReceive()

    }

    /**
    * 点击资源文件
    */
    handleDoc = (e) => {
        e.preventDefault();
    }

    // 点击新增
    handleAdd = () => {
        this.props.parentHandleAdd()

    }
    // 点击修改
    handleEdit = () => {
        this.props.parentHandleEdit()

    }

    // 导出本页
    handleExportPage = () => {
        const {dataSource} = this.props
        let arrParam = []

        dataSource.map(item => {
            arrParam.push(item.financecollectionid)
        })

        if (arrParam.length) {
            notification.open({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });
            window.location.href = this.exportUrl + 'financeCollectionIds=' + arrParam.join(',')
        } else {
            notification.open({
                message: '导出本页',
                description: '本页没有数据',
            });
        }
    }

    /**
     * 查询导出
     * 功能暂时不做，java这边说的
     *
    isEmpty(obj) {
        for (var name in obj) {
            return false
        }
        return true
    }
    handleExport = () => {
        
    }*/

    // 点击查看详情
    handleDoubleClick = (record, index) => {
        // console.log('record', record)
        if (record.type == '租赁合同') {
            hashHistory.push(`busi/busi_finance/${record.financecollectionid}`)
        } else {
            notification.open({
                message: '查看详情',
                description: `【${record.type}】的详情还在开发中，给你带来不便我很抱歉`,
            });
        }
    }

    render() {
        // 结构赋值，从父组件获取数据
        const {
            schema,
            loading,
            columns,
            dataSource,
            bordered,
            pagination,
            isRowSelection
        } = this.props

        // 表格checkbox操作 
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange,
            onSelectAll: this.handleSelectAll
        }

        // checkbox是否有勾选
        const hasSelected = this.state.selectedRowKeys.length > 0
        const oneSelected = this.state.selectedRowKeys.length == 1
        // 是否选择了多项
        const multiSelected = this.state.selectedRowKeys.length > 1;


        // 判断表格是否加上勾选列
        let tableContext = <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            bordered={bordered}
            pagination={pagination}
            onRowClick={ this.handleDoubleClick } />
        if (isRowSelection) {
            tableContext = <Table
                rowSelection={rowSelection}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                bordered={bordered}
                pagination={pagination}
                onRowDoubleClick={this.handleDoubleClick} />
        }

        return (
            <section className="m-table">
                <div className="m-table-effect">
                    <Affix target={() => document.querySelector('.m-container') } offsetTop={20}>
                        <div className="clearfix g-mb10">
                            <Row className="button-group">
                                <Col span={18}>
                                    <Row>
                                        <Col span={15}>
                                            {schema.showReceive ?
                                                <Button type="ghost" disabled={!oneSelected || (!this.isReceiveShow) } onClick={ this.handleReceive }>
                                                    确认收款
                                                </Button> : ''
                                            }
                                            {schema.showRefund ?
                                                <Button type="ghost" disabled={!oneSelected || (!this.isRefundShow) } onClick={ this.handleRefund }>
                                                    确认退款
                                                </Button> : ''
                                            }
                                            {schema.showDoc ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleDoc }>
                                                    资源文件
                                                </Button> : ''
                                            }
                                            {schema.showAdd ?
                                                <Button type="ghost" onClick={ this.handleAdd }>
                                                    <Icon type="plus" />新增
                                                </Button> : ''
                                            }
                                            {schema.showMod ?
                                                <Button type="ghost" onClick={ this.handleEdit }>
                                                    <Icon type="edit" />修改
                                                </Button> : ''
                                            }
                                            {schema.showDel ?
                                                <Button type="ghost" onClick={ this.handleEdit }>
                                                    <Icon type="delete" />删除
                                                </Button> : ''
                                            }
                                            {schema.showLie ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleLie }>
                                                    闲置
                                                </Button> : ''
                                            }
                                            {schema.showVoid ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleVoid }>
                                                    作废
                                                </Button> : ''
                                            }
                                            {schema.showHistory ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleHistory }>
                                                    历史
                                                </Button> : ''
                                            }
                                        </Col>
                                        <Col span={9} class="g-tar">
                                            {schema.showSearchAll ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleSearchAll }>
                                                    全部
                                                </Button> : ''
                                            }
                                            {schema.showSearchRented ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleSearchRented }>
                                                    已出租
                                                </Button> : ''
                                            }
                                            {schema.showSearchNotRent ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleSearchNotRent }>
                                                    未出租
                                                </Button> : ''
                                            }
                                            {schema.showSearchVoid ?
                                                <Button type="ghost" disabled={!oneSelected } onClick={ this.handleSearchVoid }>
                                                    作废
                                                </Button> : ''
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                                <Col span={6} className="button-group g-tar">
                                
                                    {schema.showSearchDictionary ?
                                        <Button type="ghost" onClick={ this.handleExportPage }>
                                            字典查询
                                        </Button> : ''
                                    }
                                    {schema.showExportPage ?
                                        <Button type="ghost" onClick={ this.handleExportPage }>
                                            <Icon type="export" />导出本页
                                        </Button> : ''
                                    }
                                    {schema.showExport ?
                                        <Button type="ghost" disabled = {exportData.button} onClick={ this.handleExport}>
                                            <Icon type="export" />导出
                                        </Button> : ''
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                </div>
                {tableContext}
            </section>
        )
    }
}

export default InnerTable