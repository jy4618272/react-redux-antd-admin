/**
 * 表单组件
 */
import React, {Component} from 'react'
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
    Icon
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

class InnerForm extends Component {
    /**
     * 辅助函数, 将一个input元素包装下
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    colWrapper = (formItem, field) => {
        return (
            <Col key={field.key} sm={8}>
                <FormItem key={field.key} label={field.title} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                    {formItem}
                </FormItem>
            </Col>
        )
    }

    /**
     * 将schema中的一列转换为下拉框
     *
     * @param field
     */
    transformSelect = (field) => {
        const options = []
        const {getFieldDecorator} = this.props.form

        console.debug('transform field %o to Select component', field)
        field.options.map((option) => {
            options.push(<Option key={option.key} value={option.value}>{option.value}</Option>)
        })

        return this.colWrapper((
            <Select placeholder={field.placeholder || '请选择'} size="default" {...getFieldDecorator(field.key) }>
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
        const {getFieldDecorator} = this.props.form

        console.debug('transform field %o to Radio component', field)
        field.options.map((option) => {
            options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
        })

        return this.colWrapper((
            <RadioGroup {...getFieldDecorator(field.key) }>
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
        const {getFieldDecorator} = this.props.form

        console.debug('transform field %o to Checkbox component', field)
        field.options.map((option) => {
            options.push({ label: option.value, value: option.key })
        })

        return this.colWrapper((
            <CheckboxGroup options={options} {...getFieldDecorator(field.key) } />
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
        const {getFieldDecorator} = this.props.form

        console.debug('transform field %o to MultipleSelect component', field)
        field.options.forEach((option) => {
            options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
        })

        return this.colWrapper((
            <Select multiple placeholder={field.placeholder || '请选择'} size="default" {...getFieldDecorator(field.key) }>
                {options}
            </Select>
        ), field)
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
        // 布局真是个麻烦事
        // col内部又用了一个row做布局
        // const {getFieldDecorator} = this.props.form
        return (
            <Col key={`${field.key}Begin`} sm={8}>
                <Row>
                    <Col span={16}>
                        <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 15 }} wrapperCol={{ span: 9 }}>
                            {beginFormItem}
                        </FormItem>
                    </Col>
                    <Col span={7} offset={1}>
                        <FormItem key={`${field.key}End`} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            {endFormItem}
                        </FormItem>
                    </Col>
                </Row>
            </Col>
        )
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
                console.debug('transform field %o to integer BETWEEN component', field)
                beginFormItem = (<InputNumber size="default"
                    placeholder={field.placeholderBegin || '最小值'} {...getFieldDecorator(`${field.key}Begin`) }/>)
                endFormItem = (<InputNumber size="default"
                    placeholder={field.placeholderEnd || '最大值'} {...getFieldDecorator(`${field.key}End`) }/>)
                cols.push(this.betweenColWrapper(beginFormItem, endFormItem, field))
                break
            case 'float':
                console.debug('transform field %o to float BETWEEN component', field)
                beginFormItem = (<InputNumber step={0.01} size="default"
                    placeholder={field.placeholderBegin || '最小值'} {...getFieldDecorator(`${field.key}Begin`) }/>)
                endFormItem = (<InputNumber step={0.01} size="default"
                    placeholder={field.placeholderEnd || '最大值'} {...getFieldDecorator(`${field.key}End`) }/>)
                cols.push(this.betweenColWrapper(beginFormItem, endFormItem, field))
                break
            // datetime类型的between要占用两个Col
            // 不写辅助函数了, 直接这里写jsx吧...
            case 'datetime':
                console.debug('transform field %o to datetime BETWEEN component', field)
                cols.push(
                    <Col key={`${field.key}Begin`} sm={8}>
                        <FormItem key={`${field.key}Begin`} label={field.title} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <DatePicker showTime format="yyyy-MM-dd HH:mm:ss"
                                placeholder={field.placeholderBegin || '开始日期'} {...getFieldDecorator(`${field.key}Begin`) }/>
                        </FormItem>
                    </Col>
                )
                cols.push(<Col key={`${field.key}End`} sm={8}>
                    <FormItem key={`${field.key}End`} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                        <DatePicker showTime format="yyyy-MM-dd HH:mm:ss"
                            placeholder={field.placeholderEnd || '结束日期'} {...getFieldDecorator(`${field.key}End`) }/>
                    </FormItem>
                </Col>)
                break
            default:
                // 理论上来说不会出现这种情况
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
    transformNormal = (field) => {
        const {getFieldDecorator} = this.props.form
        switch (field.dataType) {
            case 'int':
                console.debug('transform field %o to integer input component', field)
                return this.colWrapper((
                    <InputNumber size="default" {...getFieldDecorator(field.key) }/>
                ), field)
            case 'float':
                console.debug('transform field %o to float input component', field)
                return this.colWrapper((
                    <InputNumber step={0.01} size="default" {...getFieldDecorator(field.key) }/>
                ), field)
            case 'datetime':
                console.debug('transform field %o to datetime input component', field)
                return this.colWrapper((
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss"
                        placeholder={field.placeholder || '请选择日期'} {...getFieldDecorator(field.key) }/>
                ), field)
            default:  // 默认就是普通的输入框
                console.debug('transform field %o to varchar input component', field)
                return this.colWrapper((               
                    <Input placeholder={field.placeholder} size="default" {...getFieldDecorator(field.key)} />
                ), field)
        }
    }

    /**
     * 表单的查询条件不能直接传给后端, 要处理一下
     *
     * @param oldObj
     * @returns {{}}
     */
    filterQueryObj(oldObj) {
        // 将提交的值中undefined的去掉
        const newObj = {}

        for (const key in oldObj) {
            if (oldObj[key]) {
                // 对于js的日期类型, 要转换成字符串再传给后端
                if (oldObj[key] instanceof Date) {
                    newObj[key] = oldObj[key].format('yyyy-MM-dd HH:mm:ss')
                } else {
                    newObj[key] = oldObj[key]
                }
            }
        }
        console.debug('old queryObj: %o, new queryObj %o', oldObj, newObj)
        return newObj
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
        const newObj = this.filterQueryObj(oldObj)
        console.log('oldObj', oldObj)
        console.log('newObj', newObj)
        // 还是要交给上层组件处理, 因为要触发table组件的状态变化...
        parentHandleSubmit(newObj)

    }

    handleReset = (e) => {
        e.preventDefault()
        this.props.form.resetFields()
    }

    render() {
        const {schema} = this.props

        const rows = []
        let cols = []

        // 参见antd的布局, 每行被分为24个格子
        // 普通的字段每个占用8格, between类型的字段每个占用16格
        let spaceLeft = 24
        schema.forEach((field) => {
            // 当前列需要占用几个格子? 普通的都是8, 只有datetime between是16
            let spaceNeed = 8
            if (field.showType === 'between' && field.dataType === 'datetime') {
                spaceNeed = 16
            }

            // 如果当前行空间不足, 就换行
            if (spaceLeft < spaceNeed) {
                rows.push(<Row key={rows.length} gutter={16}>{cols}</Row>)
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
                default:
                    cols.push(this.transformNormal(field))
            }

            spaceLeft -= spaceNeed
        })

        // 别忘了最后一行
        if (cols.length > 0) {
            rows.push(<Row key={rows.length} gutter={16}>{cols}</Row>)
        }


        return (
            <Form horizontal className="m-advanced-search-form">
                {rows}
                <Row>
                    <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={this.handleSubmit}><Icon type="search"/>查询</Button>
                        <Button onClick={this.handleReset}><Icon type="cross"/>清除条件</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

// antd中的表单组件还要这么包装一层
InnerForm = Form.create()(InnerForm)

export default InnerForm
