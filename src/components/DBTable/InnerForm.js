/**
 * 表单组件
 */
import React, { Component } from 'react'
import {
    Form
} from 'antd'
import {
    FormLayout
} from 'COMPONENT'

class InnerForm extends Component {
    render() {
        const {formStyle} = this.props
        
        return (
            <section className={formStyle}>
                <Form horizontal>
                    <FormLayout
                        schema={this.props.schema}
                        form={this.props.form}
                        showSearch={this.props.showSearch}
                        showSave={this.props.showSave}
                        parentHandleSelect={this.props.parentHandleSelect}
                        parentHandleSubmit={this.props.parentHandleSubmit}
                        parentHandleSave ={this.props.parentHandleSave}
                        setFields={this.props.setFields}
                        sessionShouldGet={this.props.sessionShouldGet}>
                        {this.props.children}
                    </FormLayout>
                </Form>
            </section>
        )
    }
}

// antd中的表单组件还要这么包装一层
InnerForm = Form.create()(InnerForm)

export default InnerForm