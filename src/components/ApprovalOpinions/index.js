import React, { Component, PropTypes } from 'react'
import {
    Row,
    Col,
    Icon
} from 'antd'

import {
    Loading
} from 'COMPONENT'

import './index.less'

class ApprovalOpinions extends Component {
    render() {
        const {
            opinions
        } = this.props

        if (opinions.loading) {
            return <Loading />
        }

        let opinionsContent
        if (parseInt(opinions.data.count) > 0) {
            opinionsContent = opinions.data.data.map((item, index) => {
                if (item.people && item.people.length) {
                    const cont = item.people.map(des => {
                        return (
                            <li>
                                <h3>({des.username})</h3>
                                <Row>
                                    <Col xs={24} sm={12} className="m-title-cont horizontal">
                                        <label className="m-title">
                                            审核状态：
                                        </label>
                                        <div className="m-cont">
                                            {des.nodestatus === '同意' ? <span className="s-green">{des.nodestatus}</span> : <span className="s-red">{des.nodestatus}</span>}
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} className="m-title-cont horizontal">
                                        <label className="m-title">
                                            审核时间：
                                        </label>
                                        <div className="m-cont">
                                            <span className="s-gray">{des.finishdate}</span>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} className="m-title-cont horizontal">
                                        <label className="m-title">
                                            审核意见：
                                        </label>
                                        <div className="m-cont">
                                            {des.nodecontent}
                                        </div>
                                    </Col>
                                </Row>
                            </li>
                        )
                    })

                    return (
                        <Row gutter={15} className="list-approval-opinions">
                            <Col xs={6} sm={4} md={3} lg={2} className="hd g-tar">
                                {index + 1}&nbsp;级审核：
                            </Col>
                            <Col xs={18} sm={20} md={21} lg={22} className="bd">
                                <ul className="list">
                                    {cont}
                                </ul>
                            </Col>
                        </Row>
                    )
                }
            })
        } else {
            opinionsContent = ''
        }

        return (
            <section className="m-work-flow">
                {opinionsContent}
            </section>
        );
    }
}

export default ApprovalOpinions