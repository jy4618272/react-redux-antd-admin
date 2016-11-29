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

const FormItem = Form.Item
const ButtonGroup = Button.Group

import {
    Err
} from 'COMPONENT'

class InnerTable extends Component {
    constructor(props) {
        super(props)
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
        const {parentHandleSelectChange} = this.props
        console.log('selectedRowKeys', selectedRowKeys)
        console.log('selectedRows', selectedRows)

        this.setState({
            selectedRowKeys,
            selectedRows
        })
        parentHandleSelectChange && parentHandleSelectChange(selectedRowKeys, selectedRows)
    }

    // 点击查看详情
    handleRowClick = (record, index) => {
        const {parentHandleRowClick} = this.props
        // console.log('###', this.refs['table'].findDOMNode('tr'))
        parentHandleRowClick && parentHandleRowClick(record)
    }

    handleDoubleClick = (record, index) => {
        const {parentHandleDoubleClick} = this.props

        parentHandleDoubleClick && parentHandleDoubleClick(record, index)
    }

    // 点击按钮
    hanldeCancelSelect = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
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
                selectedRowKeys: [],
                selectedRows: []
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
            isRowSelection,
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
            ref="table"
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
                ref="table"            
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