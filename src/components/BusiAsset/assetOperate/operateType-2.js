/**
 * 处置
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
    Button,
    Radio
} from 'antd'
const RadioGroup = Radio.Group


class OperateType2 extends Component {
    constructor() {
        super()
        this.state = {
            operateTitle: '处置信息',
            czfs: '',
            czjg: '',
            bz: ''
        }
    }

    /**
     * 
     * 
     */
    handleRadioChange(e) {
        const value = e.target.value
        if (value == this.state.czfs) {
            this.setState({
                czfs: ''
            })
        } else {
            this.setState({
                czfs: value
            })
        }

    }

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
     * 渲染
     * 
     */
    render() {
        const { operateTitle, czfs, czjg, bz } = this.state

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
                <div style={titleStyle}>
                    {operateTitle}
                </div>
                <div>
                    <Row>
                        <Col span={8}>
                            <Col span={6} style={labelStyle}><span>处置方式: </span></Col>
                            <Col span={18} style={{ lineHeight: '23px' }}>
                                <RadioGroup onChange={this.handleRadioChange.bind(this)} value={czfs}>
                                    <Radio key="0" value="变卖">变卖</Radio>
                                    <Radio key="1" value="出售给外单位">出售给外单位</Radio>
                                    <Radio key="2" value="其他">其他</Radio>
                                </RadioGroup>
                            </Col>
                        </Col>

                        <Col span={8}>
                            <Col span={8} style={labelStyle}><span>处置价格/元: </span></Col>
                            <Col span={16}>
                                <Input onChange={this.onChangeHandle.bind(this, 'czjg')}/>
                            </Col>
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col span={16}>
                            <Col span={3} style={labelStyle}><span>备注: </span></Col>
                            <Col span={21}>
                                <Input type="textarea" onChange={this.onChangeHandle.bind(this, 'bz')}/>
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

export default OperateType2