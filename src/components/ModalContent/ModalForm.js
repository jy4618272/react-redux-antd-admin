/**
 * 表单组件-一列
 */
import React, { Component } from 'react'
import {
    Form,
    Row,
    Col,
    Select,
    Radio,
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Button,
    Icon,
    notification
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

class ModalForm extends Component {
    handleSelect = (key, value) => {
        console.log(key, value)
        if (this.props.parentHandleSelect) {
            this.props.parentHandleSelect(key, value)
        }
    }

    /**
     * 辅助函数, 将一个input元素包装下
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    colWrapper = (formItem, field) => {
        const {getFieldDecorator, isFieldValidating, getFieldError} = this.props.form
        return (
            <FormItem
                key={field.key}
                label={field.title}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                hasFeedback={field.feedBackShow}>
                {getFieldDecorator(field.key, {
                    validate: field.validate || []
                })(
                    formItem
                )}
            </FormItem>
        )
    }

    /**
     * 将schema中的一个字段转换为表单的一项
     *
     * @param field
     */
    transformNormal = (field) => {
        switch (field.dataType) {
            case 'int':
                return this.colWrapper((
                    <InputNumber size="default" disabled={field.disabled} />
                ), field)
            case 'float':
                return this.colWrapper((
                    <InputNumber step={field.step || 0.01} size="default" disabled={field.disabled} />
                ), field)
            case 'datetime':
                return this.colWrapper((
                    <DatePicker format={field.format || 'YYYY-MM-DD HH:mm:ss'} showTime={field.showTime || false} placeholder={field.placeholderBegin || '选择日期'} disabled={field.disabled} />
                ), field)
            default:
                return this.colWrapper((
                    <Input placeholder={field.placeholder || '请填写'} size="default" disabled={field.disabled} disabled={field.disabled} />
                ), field)
        }
    }

    /**
     * 将schema中的一列转换为下拉框
     *
     * @param field
     */
    transformSelect = (field) => {
        const options = []
        // console.debug('transform field %o to Select component', field)
        field.options.map((option) => {
            options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
        })
        return this.colWrapper((
            <Select placeholder={field.placeholder || '请选择'} size="default" onSelect={this.handleSelect.bind(this, field.key)} disabled={field.disabled} >
                {options}
            </Select>
        ), field)
    }

    /**
     * 将schema中的一列转换为单选框
     *
     * @param field
     */
    transformRadio = (field) => {
        const options = []
        // console.debug('transform field %o to Radio component', field)
        field.options.map((option) => {
            options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
        })
        return this.colWrapper((
            <RadioGroup>
                {options}
            </RadioGroup>
        ), field)
    }

    /**
     * 将schema中的一列转换为checkbox
     *
     * @param field
     */
    transformCheckbox = (field) => {
        const options = []
        // console.debug('transform field %o to Checkbox component', field)
        field.options.map((option) => {
            options.push({ label: option.value, value: option.key })
        })
        return this.colWrapper((
            <CheckboxGroup options={options} />
        ), field)
    }

    /**
     * 转换为下拉多选框
     *
     * @param field
     * @returns {XML}
     */
    transformMultiSelect = (field) => {
        const options = []
        // console.debug('transform field %o to MultipleSelect component', field)
        field.options.forEach((option) => {
            options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
        })
        return this.colWrapper((
            <Select multiple placeholder={field.placeholder || '请选择'} size="default" disabled={field.disabled} >
                {options}
            </Select>
        ), field)
    }

    render() {
        const {schema, fromLayoutStyle} = this.props
        const rows = []

        // 生成表单项
        // const formItems = [];
        schema.forEach((field) => {
            // 开始push各种FormItem
            switch (field.showType) {
                case 'select':
                    rows.push(this.transformSelect(field))
                    break
                case 'radio':
                    rows.push(this.transformRadio(field))
                    break
                case 'checkbox':
                    rows.push(this.transformCheckbox(field))
                    break
                case 'multiSelect':
                    rows.push(this.transformMultiSelect(field))
                    break
                default:
                    rows.push(this.transformNormal(field))
            }

            // formItems.push(rows);
        })
        return (
            <Form horizontal>
                {rows}
            </Form>
        )
    }
}

ModalForm = Form.create()(ModalForm)

export default ModalForm