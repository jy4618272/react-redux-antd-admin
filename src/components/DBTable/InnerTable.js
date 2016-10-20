/**
 * 表格组件
 */
import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
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
    }

    // 点击查看详情
    handleDoubleClick = (record, index) => {
        console.log('record', record)
        if (record.type == '租赁合同') {
            hashHistory.push(`busi/busi_finance/${record.financecollectionid}`)
        }

        notification.open({
            message: '查看详情',
            description: `详情还在开发中，给你带来不便我很抱歉`
        })
    }

    // 点击按钮
    handleClick = (key) => {
        console.log('你刚点击了按钮key：', key)
        const data = this.state.selectedRows
        this.props.parentHandleClick(key, data)
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
        const multiSelected = this.state.selectedRowKeys.length > 1


        // 判断表格是否加上勾选列
        let tableContext = <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            bordered={bordered}
            pagination={pagination}
            onRowClick={this.handleDoubleClick} />
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

        const buttonGroupLeft = schema.left.map((item) => {
            if (item.key === 'edit' || item.key === 'refund') {
                return (
                    <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            }
            if (item.key === 'receive') {
                return (
                    <Button type="ghost" disabled={!oneSelected} onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
                )
            }
            return (
                <Button type="ghost" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
            )
        })
        const buttonGroupCenter = schema.center.map((item) => {
            return (
                <Button type="dashed" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
            )
        })
        const buttonGroupRight = schema.right.map((item) => {
            return (
                <Button type="primary" onClick={this.handleClick.bind(this, item.key)}>{item.title}</Button>
            )
        })

        return (
            <section className="m-table">
                <div className="m-table-effect">
                    <Affix target={() => document.querySelector('.m-container')} offsetTop={20}>
                        <div className="clearfix g-mb10">
                            <Row className="button-group">
                                <Col span={18}>
                                    <Row>
                                        <Col span={15}>
                                            {buttonGroupLeft}
                                        </Col>
                                        <Col span={9} class="g-tar">
                                            {buttonGroupCenter}
                                        </Col>
                                    </Row>
                                </Col>

                                <Col span={6} className="button-group g-tar">
                                    {buttonGroupRight}
                                </Col>
                            </Row>
                        </div>
                    </Affix>
                    <Modal
                        title={this.state.modalTitle}
                        visible={this.state.modalVisible}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalHide}>
                        <Form horizontal>
                            接口有问题
                        </Form>
                    </Modal>
                </div>
                {tableContext}
            </section>
        )
    }
}

export default InnerTable