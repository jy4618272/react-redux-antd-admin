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
        if (opinions.data.count > 0) {
            opinionsContent = opinions.data.data.map((item, index) => {
                if (item.people && item.people.length) {
                    const cont = item.people.map(des => {
                        return (
                            <li>
                                <h3>({des.username})</h3>
                                <Row>
                                    <Col sm={12}>
                                        审核状态：{des.nodestatus === '同意' ? <span className="s-green">{des.nodestatus}</span> : <span className="s-red">{des.nodestatus}</span>}
                                    </Col>
                                    <Col sm={12}>
                                        审核时间： <span className="s-gray">{des.finishdate}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={24}>
                                        审核意见：{des.nodecontent}
                                    </Col>
                                </Row>
                            </li>
                        )
                    })

                    return (
                        <Row gutter={15} className="list-approval-opinions">
                            <Col sm={3} className="hd g-tar">
                                {index + 1}&nbsp;级审核：
                            </Col>
                            <Col sm={21} className="bd">
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