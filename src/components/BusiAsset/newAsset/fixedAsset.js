import React, { Component } from 'react'

import {
    Row,
    Col,
    Input,
    Button,
    Select
} from 'antd'

const Option = Select.Option

class FixedAsset extends Component {
    constructor() {
        super()
    }
    /**
     * 渲染
     * 
     */
    render() {
        const styleLable = { textAlign: 'right', paddingRight: '10px', lineHeight: '25px' }

        return (
            <div>
                <div style={{ paddingRight: '50px' }}>
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>资产名称:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>价格/元:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>规格型号:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>资产分类:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>是否信息化:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>台账编号:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>存放位置:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>责任人:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>责任部门:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>供应商:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>质保期/年:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>录入时间:</lable>
                        </Col>
                        <Col span={6}>
                            <Input />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>土地面积:</lable>
                        </Col>
                        <Col span={3}>
                            <Input />
                        </Col>
                        <Col span={3}>
                            &nbsp;&nbsp;&nbsp;
                            <Select style={{width: '75%'}} defaultValue={'平方千米'}>
                                <Option value="平方">平方</Option>
                                <Option value="平方千米">平方千米</Option>
                                <Option value="亩">亩</Option>
                                <Option value="公顷">公顷</Option>
                                <Option value="顷">顷</Option>                                
                            </Select>
                        </Col>
                        <Col span={2} style={styleLable}>
                            <lable>建筑面积:</lable>
                        </Col>
                        <Col span={3}>
                            <Input />
                        </Col>
                        <Col span={3}>
                            &nbsp;&nbsp;&nbsp;
                            <Select style={{width: '75%'}} defaultValue={'平方千米'}>
                                <Option value="平方">平方</Option>
                                <Option value="平方千米">平方千米</Option>
                                <Option value="亩">亩</Option>
                                <Option value="公顷">公顷</Option>
                                <Option value="顷">顷</Option>                                
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={2} style={styleLable}>
                            <lable>备注:</lable>
                        </Col>
                        <Col span={22}>
                            <Input type="textarea" />
                        </Col>
                    </Row>
                </div>
                <div style={{ margin: '30px 0px' }}>
                    <Col span={2} style={styleLable}></Col>
                    <Col span={22}>
                        <Button>保存</Button>  &nbsp;&nbsp;
                        <Button>提交</Button>  &nbsp;&nbsp;
                        <Button>取消</Button>
                    </Col>
                </div>
            </div>
        )
    }
}

export default FixedAsset