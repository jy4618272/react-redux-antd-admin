/**
 * 表格组件
 */
import React, { Component } from 'react'
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
import moment from 'moment'

const FormItem = Form.Item
const ButtonGroup = Button.Group
 
import { Err } from 'COMPONENT'

class InnerTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            selectedRows: [],  // 当前有哪些行被选中, 保存完整数据
            clickedRowKeys: [],  // 当前有哪些行被选中, 这里只保存key
            clickedRows: []  // 当前有哪些行被选中, 保存完整数据
        }
        if (this.props.rowClassName === 'contract') {
            this.sixtyAfterDate = moment().add('60', 'days').format('YYYY-MM-DD')
        }
    }

    /**
     * 处理表格的选择事件
     *
     * @param selectedRowKeys
     * @param selectedRows
     */
    handleSelectChange = (selectedRowKeys, selectedRows) => {
        const {parentHandleSelectChange} = this.props
        console.log('selectedRowKeys', selectedRowKeys)
        console.log('selectedRows', selectedRows)

        this.setState({
            selectedRowKeys,
            selectedRows
        })
        parentHandleSelectChange && parentHandleSelectChange(selectedRowKeys, selectedRows)
    }

    // 表格行 
    handleRowClassName = (record, index) => {
        const { rowClassName } = this.props
        if (rowClassName === 'contract') {
            const endDate = moment(record.enddate).format('YYYY-MM-DD')
            const disDate = Date.parse(this.sixtyAfterDate) - Date.parse(endDate)
            if (record.flowtype !== '作废' && record.flowstatus === '草稿') {
                return rowClassName + ' ' + 's-bg-yellow-light'
            } else if (record.flowtype !== '作废' && record.flowstatus === '审批退回') {
                return rowClassName + ' ' + 's-bg-red-light'
            } else if (record.flowtype !== '作废' && disDate > 0) {
                return rowClassName + ' ' + 's-red'
            } else {
                return rowClassName
            }
        }

        return rowClassName ? rowClassName : 'table-tr'
    }
    // 取消勾选
    hanldeCancelSelect = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
    }

    // 单击选中        
    handleRowClick = (record, index) => {
        const clickedRowKeys = [index]
        const clickedRows = [record]
        const {rowClassName, parentHandleRowClick} = this.props
        if (rowClassName) {
            let allTr = document.querySelectorAll('.' + rowClassName)
            allTr = Array.prototype.slice.call(allTr)
            // console.log('allTr:', allTr)
            allTr.map((item, ind) => {
                if (item.style.backgroundColor) {
                    console.log(rowClassName + ' prev tr is：', ind + 1)
                    item.style.backgroundColor = ''
                }
                if (index === ind) {
                    console.log(rowClassName + ' next tr is：', ind + 1)
                    item.style.backgroundColor = '#fff2eb'

                    console.log('clickedRowKeys', clickedRowKeys)
                    console.log('clickedRows', clickedRows)

                    this.setState({
                        clickedRowKeys,
                        clickedRows,
                    })
                }
            });
        }
        parentHandleRowClick && parentHandleRowClick(clickedRowKeys, clickedRows)
    }

    // 取消勾选
    handleCancelClick = () => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })

        if (this.props.rowClassName) {
            let allTr = document.querySelectorAll('.' + this.props.rowClassName)
            allTr = Array.prototype.slice.call(allTr)
            if (allTr && allTr.length) {
                allTr.map((item, ind) => {
                    if (item.style.backgroundColor) {
                        item.style.backgroundColor = ''
                    }
                })
            }
        }
    }

    // 双击查看详情    
    handleDoubleClick = (record, index) => {
        const {parentHandleDoubleClick} = this.props
        parentHandleDoubleClick && parentHandleDoubleClick(record, index)
    }


    /**
     * InnerTable组件的重render有两种可能:
     * 1. 上层组件调用的render方法, 这个时候会触发componentWillReceiveProps方法
     * 2. 自身状态变化引起的重新render
     * 注意区分
     *
     * 对于第一种情况, 要将组件的状态还原到初始状态
     *
     * @param nextProps
     */
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.loading === true) {
            this.setState({
                clickedRowKeys: [],
                clickedRows: [],
                selectedRowKeys: [],
                selectedRows: []
            })

            let allTr = document.querySelectorAll('.' + this.props.rowClassName)
            allTr = Array.prototype.slice.call(allTr)

            allTr.map((item, ind) => {
                if (item.style.backgroundColor) {
                    item.style.backgroundColor = ''
                }
            })
        }
    }

    render() {
        // 结构赋值，从父组件获取数据
        const {
            loading,
            columns,
            dataSource,
            bordered,
            pagination,
            size,
            tableStyle,
            title,
            footer,
            isRowSelection
        } = this.props

        const theTableStyle = tableStyle ? tableStyle : 'm-table m-table-primary'

        // 表格checkbox操作 
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange,
            onSelectAll: this.handleSelectAll
        }

        // 判断表格是否加上勾选列
        let tableContent = <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            bordered={bordered}
            pagination={pagination}
            rowClassName={this.handleRowClassName}
            onRowClick={this.handleRowClick}
            onRowDoubleClick={this.handleDoubleClick}
            size={size}
            title={title}
            footer={footer} />

        if (isRowSelection) {
            tableContent = <Table
                rowSelection={rowSelection}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                bordered={bordered}
                pagination={pagination}
                rowClassName={this.handleRowClassName}
                onRowClick={this.handleRowClick}
                onRowDoubleClick={this.handleDoubleClick}
                size={size}
                title={title}
                footer={footer} />
        }

        return (
            <section className={theTableStyle}>
                {tableContent}
            </section>
        )
    }
}

export default InnerTable