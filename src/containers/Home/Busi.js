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

import './busi.less'

class Busi extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <section className="padding-lr m-busi">
                <Title title="我的代办" number="20" />
                <Row className="list-news-tips">
                    <Col span={3}>
                        <span className="name">租赁管理</span>
                    </Col>
                    <Col span={21} className="clearfix">
                        <Badge count={20} overflowCount={99}>
                            <Link to="/" className="">将到期</Link>
                        </Badge>
                        <Badge count={20} overflowCount={99}>
                            <Link to="/" className="">将到期</Link>
                        </Badge>
                    </Col>
                </Row>
                <Row className="list-news-tips">
                    <Col span={3}>
                        <span className="name">资产管理</span>
                    </Col>
                    <Col span={21} className="clearfix">
                        <Badge count={20} overflowCount={99}>
                            <Link to="/" className="">被退回</Link>
                        </Badge>
                    </Col>
                </Row>
            </section>
        )
    }
}

export default Busi
