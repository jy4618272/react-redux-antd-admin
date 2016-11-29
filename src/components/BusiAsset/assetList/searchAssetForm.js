/**
 * 搜索表单
 *  1.需要传入的props
 *      存储当前查询条件this.props.saveSearchArgument(obj)。将查询条件保存到主环境中
 *
 *
 * */
import React, { Component } from 'react'
import { Select, Row, Col, Form, Button, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class SearchAssetForm extends Component {
    /*
     * 表单提交事件处理函数
     *  获取参数 -> 处理参数 -> this.props.saveSearchArgument
     * */
    submitHandler(e) {
        // 取消表单的submit默认行为
        e.preventDefault();
        const { getFieldsValue } = this.props.form
        // 从父组件传入的查询方法和更新查询参数的方法
        const { saveSearchArgument} = this.props
        // 查询的参数
        let searchArgument = getFieldsValue()
        // 查询参数中，可能会存在值是undefined的情况，需要处理成'', arg用于暂时存储一下处理后的参数
        let arg = {}
        for (let key in searchArgument) {
            arg[key] = (searchArgument[key] == undefined) ? '' : searchArgument[key]
        }

        // 增加翻页参数， arg + pagination
        searchArgument = Object.assign({}, arg, {
            pageSize: 20,
            skipCount: 0
        })

        // 更新父组件的查询参数，保持翻页时参数的一致
        saveSearchArgument(searchArgument)
    }

    /**
     * 清空查询条件
     *  只需要清空查询表单，不需要其他操作
     * */
    clearSearchArgument() {
        const {resetFields} = this.props.form
        // 重置表单
        resetFields()
    }

    /**
     * 渲染
     * */
    render() {
        const {getFieldDecorator} = this.props.form

        // formItem样式
        let FormItemStyle = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        // 表单样式
        let formStyle = {
            padding: '10px',
            margin: '15px 20px',
            background: '#fbfbfb',
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
        }
        return (
            <Form
                horizontal
                className="ant-advanced-search-form"
                style={formStyle}
                onSubmit={this.submitHandler.bind(this)}
                >
                <Row>
                    <Col span={8}>
                        <FormItem
                            {...FormItemStyle}
                            label="资产名称"
                            >
                            {getFieldDecorator('assetname', {
                                rules: [{ required: false }]
                            })(<Input type="text" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...FormItemStyle}
                            label="台账编号"
                            >
                            {getFieldDecorator('parameternumber', {
                                rules: [{ required: false }]
                            })(<Input type="text" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...FormItemStyle}
                            label="资产分类"
                            >
                            {getFieldDecorator('assettypename2', {
                                rules: [{ required: false }]
                            })(
                                <Select placeholder="资产分类">
                                    <Option value="">全部</Option>
                                    <Option value="动产">动产</Option>
                                    <Option value="不动产">不动产</Option>
                                    <Option value="低值易耗品">低值易耗品</Option>
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem
                            {...FormItemStyle}
                            label="流程状态"
                            >
                            {getFieldDecorator('flowstatus', {
                                rules: [{ required: false }]
                            })(
                                <Select placeholder="流程状态">
                                    <Option value="">全部</Option>
                                    <Option value="新增-待提交">新增-待提交</Option>
                                    <Option value="调拨-待提交">调拨-待提交</Option>
                                    <Option value="闲置-待提交">闲置-待提交</Option>
                                    <Option value="报废-待提交">报废-待提交</Option>
                                    <Option value="处置-待提交">处置-待提交</Option>
                                    <Option value="新增-审批中">新增-审批中</Option>
                                    <Option value="调拨-审批中">调拨-审批中</Option>
                                    <Option value="报废-审批中">报废-审批中</Option>
                                    <Option value="处置-审批中">处置-审批中</Option>
                                    <Option value="报废-审批中">报废-审批中</Option>
                                    <Option value="审批通过">审批通过</Option>
                                    <Option value="审批退回">审批退回</Option>
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...FormItemStyle}
                            label="资产状态"
                            >
                            {getFieldDecorator('assetstatus', {
                                rules: [{ required: false }]
                            })(
                                <Select placeholder="资产状态">
                                    <Option value="">全部</Option>
                                    <Option value="已归档">已归档</Option>
                                    <Option value="已闲置">已闲置</Option>
                                    <Option value="已报废">已报废</Option>
                                    <Option value="已处置">已处置</Option>
                                    <Option value="处理中">处理中</Option>
                                </Select>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            <Button
                                type="primary"
                                size="default"
                                htmlType="submit"
                                icon="search"
                                loading={this.props.isLoading}
                                >查询</Button> &nbsp;&nbsp;
                            <Button
                                type="primary"
                                size="default"
                                icon="close"
                                htmlType="button"
                                onClick={this.clearSearchArgument.bind(this)}
                                >清除条件</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

SearchAssetForm = Form.create()(SearchAssetForm)

export default SearchAssetForm