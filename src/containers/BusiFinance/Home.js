import React, { Component } from 'react'
import {
    DatePicker,
    Form,
    Input,
    Button
} from 'antd'
const FormItem = Form.Item

import moment from 'moment'

class Busi extends Component {
    componentDidMount() {
        const oldObj = {
            startdate: "2015-10-12 12:12:12"
        }
        console.log('oldObj', oldObj)
        
        const newObj = {}

        for (const key in oldObj) {
            if (oldObj[key]) {
                if (key.indexOf('date') > -1) {
                    newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
                } else {
                    newObj[key] = oldObj[key]
                }
            }
        }
        console.log('newObj', newObj)

        this.props.form.setFieldsValue(newObj)
    }
    handleSave = (e) => {
        e.preventDefault()
        const {form} = this.props
        const oldObj = form.getFieldsValue()
        const newObj = {}

        for (const key in oldObj) {
            if (oldObj[key]) {
                if (key.indexOf('date') > -1) {
                    newObj[key] = oldObj[key].format('YYYY-MM-DD HH:mm:ss')
                } else {
                    newObj[key] = oldObj[key]
                }
            }
        }
        console.log(newObj)
    }



    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form horizontal>
                    {/*<FormItem
                        sm={8}
                        key="startdate"
                        label="关键字"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        {getFieldDecorator(`keyword`)(
                            <Input />
                        )}
                    </FormItem>*/}
                    <FormItem
                        sm={8}
                        key="startdate"
                        label="日期"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}>
                        {getFieldDecorator(`startdate`)(
                            <DatePicker
                                format={'YYYY-MM-DD HH:mm:ss'}
                                showTime
                                />
                        )}
                    </FormItem>

                    <Button onClick={this.handleSave}>保存</Button>
                </Form>

            </div>
        )
    }
}

Busi = Form.create()(Busi)

export default Busi
