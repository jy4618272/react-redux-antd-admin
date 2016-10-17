import React, { Component, PropTypes } from 'react'

import {
    Tabs,
    Row,
    Col
} from 'antd'

const TabPane = Tabs.TabPane

// 房态图图片
import roomRed from './img/house-red.png'
import roomBlue from './img/house-blue.png'
import roomOrange from './img/house-orange.png'

import './index.less'

class RoomState extends Component {
    render() {
        return (
            <div className="tabs-vertical">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="信息交易中心" key="1">
                        <div className="padding">
                            <ul className="clearfix list-room-state-map">
                                <li><img src={roomRed} />预定</li>
                                <li><img src={roomBlue} />未出租</li>
                                <li><img src={roomOrange} />已出租</li>
                            </ul>
                            <div className="m-room-state">
                                <h2>临江公路港</h2>
                                <div className="list-room-state">
                                    <Row gutter={20}>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomOrange} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomBlue} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6} lg={4}>
                                            <div className="list-img"><img src={roomRed} /></div>
                                            <div className="list-txt">2323</div>
                                        </Col>
                                        
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="大仓" key="2">大仓</TabPane>
                    <TabPane tab="零担" key="3">零担</TabPane>
                    <TabPane tab="汽修汽配汽贸" key="4">汽修汽配汽贸</TabPane>
                    <TabPane tab="司机之家" key="5">司机之家</TabPane>
                    <TabPane tab="饭店餐饮" key="6">饭店餐饮</TabPane>
                    <TabPane tab="第3方物流" key="7">第3方物流</TabPane>
                    <TabPane tab="广告位" key="8">广告位</TabPane>
                    <TabPane tab="席位" key="9">席位</TabPane>
                    <TabPane tab="其它" key="10">其它</TabPane>
                </Tabs>
            </div>
        )
    }
}

export default RoomState