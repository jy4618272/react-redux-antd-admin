/**
 * 表格组件
 */
import React, {Component} from 'react'
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


class InnerTable extends Component {
    render() {
        // 结构赋值，从父组件获取数据
        const {schema, loading, columns, dataSource, bordered, isRowSelection} = this.props

        // 表格checkbox操作
        const rowSelection ={
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange
        }   
        
        // checkbox是否有勾选
        const hasSelected = this.state.selectedRowKeys.length > 0
        
        // 判断表格是否加上勾选列
        let tableContext = <Table loading={loading} columns={columns} dataSource={dataSource} bordered={bordered || false} />
        if (isRowSelection) {
            tableContext = <Table rowSelection={rowSelection} loading={loading} columns={columns} dataSource={dataSource} bordered={bordered || false} />
        }


        return (
            <section className="m-table">
                <div className="m-table-effect">
                    <Affix target={() => document.querySelector('.m-container') } offsetTop={20}>
                        <div className="clearfix g-mb10">
                            <div className="button-group g-fl">
                                {schema.showReceivables ?
                                    <Button type="ghost" disabled={!hasSelected} onClick={() => alert(3) }>
                                        确认收款
                                    </Button> : ''
                                }
                                {schema.showRefund ?
                                    <Button type="ghost" disabled={!hasSelected} onClick={() => alert(3) }>
                                        确认退款
                                    </Button> : ''
                                }
                            </div>

                            <div className="button-group g-fr">
                                {schema.showExport ?
                                    <Button type="ghost" onClick={() => alert(3) }>
                                        <Icon type="export" />导出本页
                                    </Button> : ''
                                }
                                {schema.showImport ?
                                    <Button type="ghost" disabled = {multiSelected} onClick={() => alert(3) }>
                                        <Icon type="export" />批量导出
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