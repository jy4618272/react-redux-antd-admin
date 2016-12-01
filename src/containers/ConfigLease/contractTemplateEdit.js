/**
 * 合同模版 新增、编辑 
 *  如果是新增，不需要调用接口初始化
 *  如果是编辑，需要调接口进行初始化
 * 
 * 参数this.props
 *      operateType  edit|add 
 * 
 * 
 */

import React, { Component } from 'react'

import {
    Button,
    Row,
    Col,
    Input
} from 'antd'

import UeditorComponent from 'COMPONENT/Ueditor/index'

class ContractTemplateEdit extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    // 同步编辑器组件的内容到当前组件
    getUeditorContent(html) {
        this.setState({
            html: html
        })
    } 

    /**
     * 渲染
     * 
     */
    render() {
        const tableStyle = { width: '80%' }
        const labelStyle = { lineHeight: '25px', textAlign: 'right', paddingRight: '20px' }
        const containerStyle = { padding: '20px 30px' }
        return (
            <div style={containerStyle}>
                {/* 模版名称、模板内容、合同类型、备注  保存、关闭*/}
                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>模版名称</span>
                        </Col>
                        <Col span={21}>
                            <Input />
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>合同类型</span>
                        </Col>
                        <Col span={21}>
                            <Input />
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>备注</span>
                        </Col>
                        <Col span={21}>
                            <Input />
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>模板内容</span>
                        </Col>
                        <Col span={21}>
                            <UeditorComponent initContent="" getUeditorContent={this.getUeditorContent.bind(this)} />
                        </Col>
                    </Col>
                </Row> <br /> <br />

                <Row>
                    <Col span={2}></Col>
                    <Col span={21}>
                        <Button type="primary" size="large">保存</Button> &nbsp;&nbsp;&nbsp;
                            <Button type="ghost" size="large">关闭</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ContractTemplateEdit