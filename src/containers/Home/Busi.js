import React, { Component } from 'react'
import { Link } from 'react-router'
import {
    Badge,
    Row,
    Col
} from 'antd'

import {
    Title
} from 'COMPONENT'

import './index.less'

class Busi extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <section className="padding-lr m-busi">
                <Row className="list-news-tips">
                    <Col span={3}>
                        <div className="title">我的代办</div>
                    </Col>
                    <Col span={21}>
                        <ul className="clearfix list-badge">
                            <li>
                                <Link to="/busi/approval"><Badge count={20} overflowCount={99} /></Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
                {/*
                    <Row className="list-news-tips">
                    <Col span={3}>
                        <div className="title">租赁管理</div>
                    </Col>
                    <Col span={21}>
                        <ul className="clearfix list-badge">
                            <li>
                                <Link to="/"><span className="name">将到期</span><Badge count={20} overflowCount={99} /></Link>
                            </li>
                            <li>
                                <Link to="/"><span className="name">将到期</span><Badge count={20} overflowCount={99} /></Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row className="list-news-tips">
                    <Col span={3}>
                        <div className="title">资产管理</div>
                    </Col>
                    <Col span={21}>
                        <ul className="clearfix list-badge">
                            <li>
                                <Link to="/"><span className="name">将到期</span><Badge count={20} overflowCount={99} /></Link>
                            </li>
                            <li>
                                <Link to="/"><span className="name">被退回</span><Badge count={20} overflowCount={99} /></Link>
                            </li>
                        </ul>
                    </Col>
                </Row>    
                */}
            </section>
        )
    }
}

export default Busi
