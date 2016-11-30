/**
 * 表单组件
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
const {RangePicker} = DatePicker
import './dbTable.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

import {
    filterQueryObj
} from 'UTIL'

class FormLayout extends Component {
    /**
     * 辅助函数, 将一个input元素包装下
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    colWrapper = (formItem, field) => {
        const {getFieldDecorator} = this.props.form
        return (
            <Col key={field.key} xs={24} sm={12} md={12} lg={6}>
                <FormItem
                    key={field.key}
                    ref={field.key}
                    label={field.title}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    hasFeedback={field.feedBackShow}>
                    {getFieldDecorator(field.key, {
                        validate: field.validate || []
                    })(
                        formItem
                        )}
                </FormItem>
            </Col>
        )
    }

    /**
     * 也是个辅助函数, 由于是范围查询, 输入的formItem是两个, 一个用于begin一个用于end
     *
     * @param beginFormItem
     * @param endFormItem
     * @param field
     * @returns {XML}
     */
    betweenColWrapper = (beginFormItem, endFormItem, field) => {
        const {getFieldDecorator} = this.props.form
        return (
            <Col key={`start${field.key}`} xs={24} sm={12} md={12} lg={6}>
                <Row>
                    <Col span={16}>
                        <FormItem
                            key={`${field.key}Begin`}
                            label={field.title}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 13 }}
                            hasFeedback={field.feedBackShow}>
                            {getFieldDecorator(`start${field.key}`, {
                                validate: field.validate || []
                            })(
                                beginFormItem
                                )}
                        </FormItem>
                    </Col>
                    <Col span={8} offset={0}>
                        <FormItem
                            key={`end${field.key}`}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            hasFeedback={field.feedBackShow}>
                            {getFieldDecorator(`end${field.key}`, {
                                validate: field.validate || []
                            })(
                                endFormItem
                                )}
                        </FormItem>
                    </Col>
                </Row>
            </Col>
        )
    }

    /**
     * 辅助函数, 将一个input元素包装下
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    twoColWrapper = (formItem, field) => {
        const {getFieldDecorator} = this.props.form
        return (
            <Col key={field.key} sm={12}>
                <FormItem
                    key={field.key}
                    label={field.title}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    hasFeedback={field.feedBackShow}>
                    {getFieldDecorator(field.key, {
                        validate: field.validate || []
                    })(
                        formItem
                        )}
                </FormItem>
            </Col>
        )
    }

    /**
     * 辅助函数, 将一个input元素包装下
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    fullColWrapper = (formItem, field) => {
        const {getFieldDecorator} = this.props.form
        return (
            <Row key={field.key} sm={24}>
                <FormItem
                    key={field.key}
                    label={field.title}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                    hasFeedback={field.feedBackShow}>
                    {getFieldDecorator(field.key, {
                        validate: field.validate || [],
                        initialValue: field.initialValue
                    })(
                        formItem
                        )}
                </FormItem>
            </Row>
        )
    }


    handleSelect = (key, value) => {
        // console.log(key, value)
        if (this.props.parentHandleSelect) {
            this.props.parentHandleSelect(key, value)
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

        // console.log(field.options)
        field.options.map((option) => {
            options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
        })

        return this.colWrapper((
            <Select placeholder={field.placeholder || '请选择'} size="default" onSelect={this.handleSelect.bind(this, field.key)} disabled={field.disabled}>
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
            options.push(<Radio key={option.key} value={option.value}>{option.value}</Radio>)
        })
        if (field.styleType) {
            return this.fullColWrapper((
                <RadioGroup initialValue={field.default}>
                    {options}
                </RadioGroup>
            ), field)
        }
        return this.colWrapper((
            <RadioGroup value={field.default}>
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
            <Select multiple placeholder={field.placeholder || '请选择'} size="default">
                {options}
            </Select>
        ), field)
    }

    /**
    * 将schema中的一列转换为普通输入框
    *
    * @param field
    * @returns {XML}
    */
    transformFull = (field) => {
        switch (field.dataType) {
            case 'textarea':
                return this.fullColWrapper((
                    <Input type="textarea" placeholder={field.placeholder || '请填写'} size="default" autosize={{ minRows: field.minRows || 4, maxRows: field.maxRows || 10 }} disabled={field.disabled} />
                ), field)

            default:
                // console.debug('transform field %o to varchar input component', field)
                return this.fullColWrapper((
                    <Input placeholder={field.placeholder || '请填写'} size="default" disabled={field.disabled} readOnly={field.readonly} onClick={this.handleInputClick.bind(this, field.key)} />
                ), field)
        }
    }

    /**
     * between类型比较特殊, 普通元素每个宽度是8, int和float的between元素宽度也是8, 但datetime类型的between元素宽度是16
     * 否则排版出来不能对齐, 太丑了, 逼死强迫症
     * 而且普通的transform函数返回是一个object, 而这个函数返回是一个array, 就是因为datetime的between要占用两列
     *
     * @param field
     */
    transformBetween = (field) => {
        const cols = []
        let beginFormItem
        let endFormItem
        const {getFieldDecorator} = this.props.form

        switch (field.dataType) {
            case 'int':
                // console.debug('transform field %o to integer BETWEEN component', field)
                beginFormItem = (<InputNumber size="default"
                    placeholder={field.placeholderBegin || '最小值'} disabled={field.disabled} />)
                endFormItem = (<InputNumber size="default"
                    placeholder={field.placeholderEnd || '最大值'} disabled={field.disabled} />)
                cols.push(this.colWrapper(beginFormItem, endFormItem, field))
                break
            case 'float':
                // console.debug('transform field %o to float BETWEEN component', field)
                beginFormItem = (<InputNumber step={0.01} size="default"
                    placeholder={field.placeholderBegin || '最小值'} disabled={field.disabled} />)
                endFormItem = (<InputNumber step={0.01} size="default"
                    placeholder={field.placeholderEnd || '最大值'} disabled={field.disabled} />)
                cols.push(this.colWrapper(beginFormItem, endFormItem, field))
                break
            // datetime类型的between要占用两个Col
            // 不写辅助函数了, 直接这里写jsx吧...
            case 'datetime':
                // console.debug('transform field %o to datetime BETWEEN component', field)
                cols.push(
                    <Col key={field.key} sm={12} md={12} lg={6}>
                        <FormItem
                            key={field.key}
                            label={field.title}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            hasFeedback={field.feedBackShow}
                            help={field.help}>
                            {getFieldDecorator(field.key, {
                                validate: field.validate || []
                            })(
                                <DatePicker format={field.format || 'YYYY-MM-DD HH:mm:ss'} showTime={field.showTime || false} placeholder={field.placeholderBegin || '开始日期'} disabled={field.disabled} />
                            )}
                        </FormItem>
                    </Col>
                )
                cols.push(
                    <Col key={field.keyEnd} sm={12} md={12} lg={6}>
                        <FormItem
                            key={field.keyEnd}
                            label="至"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            hasFeedback={field.feedBackShow}
                            help={field.help}>
                            {getFieldDecorator(field.keyEnd, {
                                validate: field.validate || []
                            })(
                                <DatePicker format={field.format || 'YYYY-MM-DD HH:mm:ss'} showTime={field.showTime || false} placeholder={field.placeholderEnd || '结束日期'} disabled={field.disabled} />
                            )}
                        </FormItem>
                    </Col>)
                break
            default:
                console.error('unknown dataType: %s', field.dataType)
        }
        return cols
    }

    /**
     * 将schema中的一列转换为普通输入框
     *
     * @param field
     * @returns {XML}
     */
    transformTwo = (field) => {
        switch (field.dataType) {
            default:
                return this.twoColWrapper((
                    <Input placeholder={field.placeholder || '请填写'} size="default" disabled={field.disabled} readOnly={field.readonly} onClick={this.handleInputClick.bind(this, field.key)} />
                ), field)
        }
    }

    // 表单点击
    handleInputClick = (key) => {
        this.props.parentHandleInput && this.props.parentHandleInput(key)
    }

    // 表单修改
    handleInputBlur = (key) => {
        this.props.parentHandleInputBlur && this.props.parentHandleInputBlur(key)
    }

    // 日期选择
    handleDateChange = (key, value) => {
        this.props.parentHandleDateChange && this.props.parentHandleDateChange(key, value)
    }

    // 表单失去焦点
    handleBlur = (key) => {
        this.props.parentHandleBlur && this.props.parentHandleBlur(key)
    }
    /**
     * 将schema中的一列转换为普通输入框
     *
     * @param field
     * @returns {XML}
     */
    transformNormal = (field) => {
        const {getFieldDecorator} = this.props.form
        switch (field.dataType) {
            case 'int':
                // console.debug('transform field %o to integer input component', field)
                return this.colWrapper((
                    <InputNumber placeholder={field.placeholder || '请输入'} step={field.step || 0.01} size="default" disabled={field.disabled} />
                ), field)
            case 'float':
                // console.debug('transform field %o to float input component', field)
                return this.colWrapper((
                    <InputNumber placeholder={field.placeholder || '请输入'} step={field.step || 0.01} size="default" onBlur={this.handleInputBlur.bind(this, field.key)} disabled={field.disabled} onBlur={this.handleBlur.bind(this, field.key)} />
                ), field)
            case 'datetime':
                // console.debug('transform field %o to datetime input component', field)
                return this.colWrapper((
                    <DatePicker format={field.format || 'YYYY-MM-DD HH:mm:ss'} showTime={field.showTime || false} placeholder={field.placeholderBegin || '选择日期'} disabled={field.disabled} onChange={this.handleDateChange.bind(this, field.key)} />
                ), field)
            default:  // 默认就是普通的输入框
                // console.debug('transform field %o to varchar input component', field)
                return this.colWrapper((
                    <Input placeholder={field.placeholder || '请填写'} size="default" disabled={field.disabled} readOnly={field.readonly} onClick={this.handleInputClick.bind(this, field.key)} />
                ), field)
        }
    }

    /**
     * 处理表单提交
     *
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault()
        const {form, parentHandleSubmit} = this.props
        const oldObj = form.getFieldsValue()
        const newObj = filterQueryObj(oldObj)
        // console.log('oldObj', oldObj)
        // console.log('newObj', newObj)
        // 还是要交给上层组件处理, 因为要触发table组件的状态变化...        
        parentHandleSubmit && parentHandleSubmit(newObj)
    }

    // 清除查询条件
    handleReset = (e) => {
        e.preventDefault()
        this.props.form.resetFields()
    }

    // 处理表单保存
    handleSave = (e) => {
        e.preventDefault()
        const {form, parentHandleSave} = this.props
        const oldObj = form.getFieldsValue()
        const newObj = filterQueryObj(oldObj)
        console.log('保存表单字段', oldObj)

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false
            }
            this.props.parentHandleSave && this.props.parentHandleSave(newObj)
        })
    }

    // 点击按钮
    handleClick = (key) => {
        console.log('你刚点击了按钮key：', key)
        this.props.parentHandleClick(key)
    }

    // 处理表单关闭
    handleClose = (e) => {
        e.preventDefault()
        history.back()
    }

    componentDidMount() {
        if (this.props.sessionShouldGet) {
            this.props.form.setFieldsValue({
                site: sessionStorage.getItem('getFacility')
            })
        }

        if (this.props.setFields) {
            this.props.form.setFieldsValue(
                this.props.setFields
            )
        }
    }

    render() {
        const {schema, fromLayoutStyle} = this.props
        const rows = []
        let cols = []

        // 参见antd的布局, 每行被分为24个格子
        // 普通的字段每个占用8格, between类型的字段每个占用16格
        let spaceLeft = 24
        schema.forEach((field) => {
            // 当前列需要占用几个格子? 普通的都是6, 只有datetime between是12
            let spaceNeed = 6
            if (field.showType === 'two' || field.showType === 'between') {
                spaceNeed = 12
            }

            if (field.showType === 'full') {
                spaceNeed = 24
            }

            // 如果当前行空间不足, 就换行
            if (spaceLeft < spaceNeed) {
                rows.push(<Row key={rows.length} gutter={10} className="form-col-wrapper">{cols}</Row>)
                cols = []  // 不知array有没有clear之类的方法
                spaceLeft = 24  // 剩余空间重置
            }

            // 开始push各种FormItem
            switch (field.showType) {
                case 'select':
                    cols.push(this.transformSelect(field))
                    break
                case 'radio':
                    cols.push(this.transformRadio(field))
                    break
                case 'checkbox':
                    cols.push(this.transformCheckbox(field))
                    break
                case 'multiSelect':
                    cols.push(this.transformMultiSelect(field))
                    break
                case 'between':
                    for (const col of this.transformBetween(field)) {
                        // between类型比较特殊, 返回的是一个数组
                        cols.push(col)
                    }
                    break
                case 'full':
                    cols.push(this.transformFull(field))
                    break
                case 'two':
                    cols.push(this.transformTwo(field))
                    break
                default:
                    cols.push(this.transformNormal(field))
            }

            spaceLeft -= spaceNeed
        })

        // 别忘了最后一行
        if (this.props.showSearch) {
            cols.push(
                <Col xs={24} sm={12} md={12} lg={6} className="button-group form-button-group">
                    <Button type="primary" onClick={this.handleSubmit}><Icon type="search" />查询</Button>
                    <Button type="default" onClick={this.handleReset}><Icon type="cross" />清除</Button>
                </Col>
            )
        }

        // 别忘了最后一行
        if (Array.isArray(this.props.buttonSchema) && this.props.buttonSchema.length) {
            const buttonGroup = this.props.buttonSchema.map(item => {
                return <Button type={item.type} onClick={this.handleClick.bind(this, item.key)}>{item.icon ? <Icon type={item.icon} /> : ''}{item.title}</Button>
            })
            cols.push(
                <Col xs={24} sm={12} md={12} lg={6} className="button-group form-button-group">
                    {buttonGroup}
                </Col>
            )
        }

        rows.push(<Row key={rows.length} gutter={8} className="form-col-wrapper">{cols}</Row>)

        // 别忘了最后一行
        let formOpe
        if (this.props.showSave) {
            formOpe = <div xs={24} sm={24} md={24} lg={24}  className="g-tac button-group g-mt50">
                <Button type="primary" size="large" onClick={this.handleSave}>保存</Button>
                <Button type="ghost" size="large" onClick={this.handleClose}>关闭</Button>
            </div>
        }

        return (
            <section className={fromLayoutStyle}>
                {rows}
                {this.props.children}
                {formOpe}
            </section>
        )
    }
}

export default FormLayout
