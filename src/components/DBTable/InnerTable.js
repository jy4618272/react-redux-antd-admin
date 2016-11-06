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
        parentHandleSelectChange && parentHandleSelectChange(selectedRows)
    }

    // 点击查看详情
    handleRowClick = (record, index) => {
        const {parentHandleRowClick} = this.props
        parentHandleRowClick && parentHandleRowClick(record, index)
    }

    handleDoubleClick = (record, index) => {
        const {parentHandleDoubleClick} = this.props
        parentHandleDoubleClick && parentHandleDoubleClick(record, index)
    }

    // 点击按钮
    handleClick = (key) => {
        const data = this.state.selectedRows
        const {parentHandleClick} = this.props
        console.log('你刚点击按钮key+data', key, data)
        parentHandleClick && parentHandleClick(key, data)
    }

    isEmpty = (obj) => {
        for (let name in obj) {
            return false;
        }
        return true;
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
            modalSchema,
            schema,
            loading,
            columns,
            dataSource,
            bordered,
            pagination,
            isRowSelection,
            size,
            tableStyle,
            title,
            footer
        } = this.props

        const theTableStyle = tableStyle ? tableStyle : 'm-table m-table-primary'

        // 表格checkbox操作 
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange,
            onSelectAll: this.handleSelectAll
        }

        // checkbox是否有=>勾选/只有一项/多项
        const hasSelected = this.state.selectedRowKeys.length > 0
        const oneSelected = this.state.selectedRowKeys.length == 1
        const multiSelected = this.state.selectedRowKeys.length > 1

        // 判断表格是否加上勾选列
        let tableContent = <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            bordered={bordered}
            pagination={pagination}
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
                onRowClick={this.parentHandleRowClick}
                onRowDoubleClick={this.handleDoubleClick}
                size={size}
                title={title}
                footer={footer} />
        }

        /**
         * 表格操作按钮
         * {
         *     left:[],
         *     right:[]
         * }
         */
        let tableControl = ''
        if (!this.isEmpty(schema)) {
            const buttonGroupLeft = schema.left.map((item) => {
                if (item.key === 'refund') {
                    let dis
                    if (!oneSelected) {
                        // dis = (oneSelected) ? false : true
                        // alert(dis)

                    }
                    return (
                        <Button type="ghost" disabled={dis} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                if (item.key === 'receive') {
                    return (
                        <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                if (item.key.indexOf('add') > -1 || item.key.indexOf('default') > -1) {
                    return (
                        <Button type="ghost" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                    )
                }
                return (
                    <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            })
            const buttonGroupRight = schema.right.map((item) => {
                return (
                    <Button type="primary" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            })

            tableControl = <div className="m-table-effect">
                <div className="clearfix g-mb10">
                    <Row className="button-group">
                        <Col span={18}>
                            {buttonGroupLeft}
                        </Col>
                        <Col span={6} className="button-group g-tar">
                            {buttonGroupRight}
                        </Col>
                    </Row>
                </div>
            </div>
        }

        return (
            <section className={theTableStyle}>
                {tableContent}
            </section>
        )
    }
}

export default InnerTable