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
    message,
    notification
} from 'antd'

const FormItem = Form.Item
const ButtonGroup = Button.Group

import {rootPath} from 'SERVICE/config'

class InnerTable extends Component {

    // 很多时候都要在antd的组件上再包一层
    constructor(props) {
        super(props)
        this.state = {
            isExportPageShow: true,
            url: rootPath,
            modalVisible: false,  // modal是否可见
            modalTitle: '新增',  // modal标题
            modalInsert: true,  // 当前modal是用来insert还是update

            selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],  // 当前有哪些行被选中, 保存完整数据
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
        if (selectedRowKeys.length == this.props.size) {
            let tmpObj = []
            selectedRows.map((item) => {
                tmpObj.push(item.financecollectionid)
            })
            let urlParam = decodeURIComponent(tmpObj.join(','))
            this.setState({
                url: this.state.url + '/financeParkAdmin/financecollectioncs/exportFinanceListExcel?financeCollectionIds=' + urlParam
            })
        }
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

    // table勾选取消
    rowSelectionReset = () => {
        this.setState({
            selectedRowKeys: []
        })
    }

    handleSelectAll = (selected, selectedRows, changeRows) => {
        if (selected && selectedRows.length) {
            this.setState({
                isExportPageShow: false
            })
        } else {
            this.setState({
                isExportPageShow: true
            })
        }
        console.log('3333', selected, selectedRows, changeRows)
    }

    /**
     * 点击批量按钮
     */
    handleExport = (e) => {
        e.preventDefault();
        this.props.parentHandleReceive()

    }

    handleDoubleClick = (record, index) => {
        console.log(record)
        hashHistory.push(`busi/busi_finance/${record.financecollectionid}`)
    }

    render() {
        // 结构赋值，从父组件获取数据
        const {schema, loading, columns, dataSource, bordered, pagination, isRowSelection, size} = this.props

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
            bordered={bordered || false}
            pagination={pagination}
            onRowClick={ this.handleDoubleClick }/>
        if (isRowSelection) {
            tableContext = <Table 
                rowSelection={rowSelection} 
                loading={loading} 
                columns={columns} 
                dataSource={dataSource} 
                bordered={bordered || false} 
                pagination={pagination}
                onRowDoubleClick={this.handleDoubleClick} />
        }

        return (
            <section className="m-table">
                <div className="m-table-effect">
                    <Affix target={() => document.querySelector('.m-container') } offsetTop={20}>
                        <div className="clearfix g-mb10">
                            <div className="button-group g-fl">
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
                            </div>

                            <div className="button-group g-fr">
                                {schema.showExportPage ?
                                    <Button type="ghost" disabled={this.state.isExportPageShow} onClick={this.rowSelectionReset}>
                                        <a ref="exportPage" href={this.state.url}>
                                            <Icon type="export" />导出本页
                                        </a>
                                    </Button> : ''
                                }
                                {schema.showExport ?
                                    <Button type="ghost" disabled = {!this.props.isExportShow} onClick={ this.handleExport}>
                                        <Icon type="export" />{multiSelected ? '批量导出' : '导出'}
                                    </Button> : ''
                                }
                            </div>
                        </div>
                    </Affix>
                </div>
                {tableContext}
            </section>
        )
    }
}

export default InnerTable