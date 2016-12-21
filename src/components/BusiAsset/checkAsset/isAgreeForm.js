import React, { Component } from 'react'

import {
    Form,
    Input,
    Radio,
    Button,
    Row,
    Col
} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group

import {
    Cards
} from 'COMPONENT'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

class IsAgreeForm extends Component {
    constructor() {
        super()
    }

    /**
     * 初始化一些操作
     * 
     */
    componentDidMount() {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            nodestatus: '不同意'
        })
    }

    /**
     * 提交
     * http://myportaltest.tf56.com:8080/workflowAdmin/flownodecs/submitTaskPMSTwo
     */
    handleSvae() {
        const { validateFieldsAndScroll, getFieldsValue } = this.props.form
        validateFieldsAndScroll((err) => {
            const { nodecontent, nodestatus } = getFieldsValue()
            const { id: businessno } = this.props

            xhr('post', paths.workFlowPath + '/flownodecs/submitTaskPMSTwo', {
                nodecontent, nodestatus, businessno,
                pactkind: ''
            }, (res) => {
                if (res.result == 'success') {
                    history.go(0)
                } else {
                    errHandler(res.msg)
                }
            })
        })
    }



    /**
     * 渲染
     * 
     */
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemStyle = {
            labelCol: { span: 2, style: { paddingLeft: '10px' } },
            wrapperCol: { span: 22 },
            style: {
                width: '100%'
            }
        }
        return (
            <Cards title="审核信息">
                <Form inline>
                    <FormItem
                        {...formItemStyle}
                        label="审核结果:">
                        {getFieldDecorator('nodestatus', {
                            rules: [{ required: true }],
                        })(
                            <RadioGroup>
                                <Radio value={'同意'}>同意</Radio>
                                <Radio value={"不同意"}>不同意</Radio>
                            </RadioGroup>
                            )}
                    </FormItem> <br /><br />
                    <FormItem
                        {...formItemStyle}
                        label="审核内容:">
                        {getFieldDecorator('nodecontent', {
                            rules: []
                        })(
                            <Input type="textarea" autosize={{ minRows: 4, maxRows: 10 }}/>
                        )}
                    </FormItem> 
                    <Row> <br />
                        <Col offset={2}>
                            <Button type="primary" onClick={this.handleSvae.bind(this)}>保存</Button>  &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type="default" onClick={() => { history.back() }}>取消</Button>
                        </Col>
                    </Row> <br />
                </Form>
            </Cards>
        )
    }
}

IsAgreeForm = Form.create()(IsAgreeForm)

export default IsAgreeForm