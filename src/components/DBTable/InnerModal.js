/**
 * 弹框组件
 */
import React, { Component, PropTypes } from 'react'

class InnerModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,  // modal是否可见
            modalTitle: '新增',  // modal标题
            modalInsert: true,  // 当前modal是用来insert还是update
        }
    }

    /****************************** 
     * 新增，弹出一个内嵌表单的modal
     */
    handleModalAdd = (e) => {
        e.preventDefault()
        // this.props.form.resetFields()
        this.setState({
            modalVisible: true,
            modalTitle: '新增房间物品属性',
            modalInsert: true
        })
    }

    /**
     * 辅助函数
     *
     * @param formItem
     * @param field
     * @returns {XML}
     */
    colWrapper = (formItem, field) => {
        console.log('11111111111', this.props)

        const {getFieldDecorator} = this.props.form

        return (
            <FormItem key={field.key} label={field.title} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator(field.key)(
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
    transFormField = (field) => {
        // 对于主键, 直接返回一个不可编辑的textarea
        if (this.primaryKey === field.key) {
            console.debug('key %o is primary, transform to text area', field)
            return this.colWrapper((
                <Input type="textarea" autosize={{ minRows: 1, maxRows: 10 }} disabled
                    size="default" />
            ), field)
        }

        // switch (field.dataType) {
        //     case 'int':
        //         console.debug('transform field %o to integer input', field)
        //         return this.colWrapper((
        //             <InputNumber size="default" />
        //         ), field)
        //     case 'float':
        //         console.debug('transform field %o to float input', field)
        //         return this.colWrapper((
        //             <InputNumber step={1} size="default" />
        //         ), field)
        //     case 'datetime':
        //         console.debug('transform field %o to datetime input', field)
        //         return this.colWrapper((
        //             <DatePicker showTime format={field.format || "YYYY-MM-dd HH:mm:ss"}
        //                 placeholder={field.placeholder || '请选择日期'} />
        //         ), field)
        //     default:  // 默认就是普通的输入框
        //         console.debug('transform field %o to varchar input', field)
        //         return this.colWrapper((
        //             <Input placeholder={field.placeholder} size="default" />
        //         ), field)
        // }
    }

    /**
     * 隐藏modal
     */
    handleModalHide = () => {
        this.setState({
            modalVisible: false
        })
    }


    // 点击modal中确认按钮
    handleModalOk = () => {
        this.handleHideModal()
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}

InnerModal.propTypes = {

}

export default InnerModal