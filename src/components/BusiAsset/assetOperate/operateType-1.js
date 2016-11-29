/**
 * 调拨，闲置，报废
 * 
 * 标题
 * 表单数据：存放位置，责任人，责任部门，原因
 * 操作：保存，提交，取消
 */

import React, { Component } from 'react'

import {
    Row,
    Col,
    Input,
    Button
} from 'antd'

class OperateType1 extends Component {
    constructor() {
        super()
        this.state = {
            operateTitle: ''
        }
    }

    /**
     * 用this.state控制表单，如果是第一次新建，则数据全部为空，如果是编辑，则需要用this.props进行初始化
     * 
     */
    componentWillMount() {
        const { operateTitle, formData } = this.props
        this.state = {
            operateTitle,
            ...formData
        }
    }

    /**
     * 父组件第一次传入的值为''，需要在后续操作中完成真正赋值
     * 
     */
    // componentWillUpdate() {
    //     const { operateTitle, formData } = this.props
    //     this.state = {
    //         operateTitle,
    //         ...formData
    //     }
    // }

    /**
     * onChange  同步表单modal和ui
     * 
     */
    onChangeHandle(stateName, event) {
        const value = event.target.value
        this.setState({
            [stateName]: value
        })
    }

    /**
     * 保存 ,真正的保存操作需要使用父组件传入的函数
     * 
     */
    handleSave() {
        console.log('保存信息：', this.state)
    }

    /**
     * 
     * 
     */
    handleSubmit() {
        console.log('提交信息：', this.state)
    }

    /**
     *  渲染
     * 
     */
    render() {
        const { operateTitle, cfwz, zrr, zrbm, yy } = this.state
        // 容器样式
        const containerStyle = { margin: '0 20px' }
        // 标题样式
        const titleStyle = { fontSize: '14px', paddingBottom: '10px', paddingLeft: '5px' }
        // 表单控件说明文字样式
        const labelStyle = { lineHeight: '25px', textAlign: 'right', paddingRight: '8px' }
        // 按钮容器样式
        const buttonContainerStyle = { margin: '30px 0px' }
        return (
            <div style={containerStyle}>
                <div style={titleStyle}>{operateTitle}</div>
                <div>
                    <Row>
                        <Col span={8}>
                            <Col span={6} style={labelStyle}><span>存放位置: </span></Col>
                            <Col span={16}>
                                <Input value={cfwz} onChange={this.onChangeHandle.bind(this, 'cfwz')} />
                            </Col>
                        </Col>
                        <Col span={8}>
                            <Col span={6} style={labelStyle}><span>责任人: </span></Col>
                            <Col span={16}>
                                <Input value={zrr} onChange={this.onChangeHandle.bind(this, 'zrr')} />
                            </Col>
                        </Col>
                        <Col span={8}>
                            <Col span={6} style={labelStyle}><span>责任部门: </span></Col>
                            <Col span={16}>
                                <Input value={zrbm} onChange={this.onChangeHandle.bind(this, 'zrbm')} />
                            </Col>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={16}>
                            <Col span={3} style={labelStyle}><span>原因: </span></Col>
                            <Col span={20}>
                                <Input type="textarea" value={yy} onChange={this.onChangeHandle.bind(this, 'yy')} />
                            </Col>
                        </Col>
                    </Row>
                    <Row style={buttonContainerStyle}>
                        <Col span={2} style={labelStyle}></Col>
                        <Col span={22}>
                            <Button onClick={this.handleSave.bind(this)}>保存</Button>  &nbsp;&nbsp;
                            <Button onClick={this.handleSubmit.bind(this)}>提交</Button>  &nbsp;&nbsp;
                            <Button>取消</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

}


export default OperateType1