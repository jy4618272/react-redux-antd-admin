import React, { Component, PropTypes } from 'react'
import {
    Row,
    Col,
    Icon
} from 'antd'

import {
    Loading
} from 'COMPONENT'

import './WorkFlow.less'

class WorkFlow extends Component {
    render() {
        const {
            flow
        } = this.props

        const workFlow = flow.data.map(item => {
            let status
            if (item.nodestatus === '通过') {
                status = <Icon className="s-green" type="check-circle" />
            } else if (item.nodestatus === '不通过') {
                status = <Icon className="s-yellow" type="check-circle" />
            } else if (item.nodestatus === '待处理') {
                status = <Icon clsssName="s-red" type="exclamation-circle" />
            } else {
                status = <Icon className="s-gray" type="minus-circle" />
            }

            let steps
            if (item.people && item.people.length) {
                steps = item.people.map(des => {
                    return (
                        <p>{des.userName}<span>/</span>{des.flowName}</p>
                    )
                })
            }

            return (
                <Col className="ant-col">
                    <div className="u-icon">
                        {status}
                    </div>
                    <span className="u-line"></span>
                    <div className="flow-content">
                        <h3 className="s-primary">{item.nodeName}</h3>
                        {steps}
                    </div>
                </Col>
            )
        })

        if (flow.loading) {
            return <Loading />
        }

        return (
            <section className="m-work-flow">
                <Row type="flex" justify="start">
                    {workFlow}
                </Row>
            </section>
        );
    }
}

WorkFlow.propTypes = {

};

export default WorkFlow;