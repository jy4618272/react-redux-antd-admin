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

        const colNum = 24 / (flow.data.length)
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
            return (
                <Col className="ant-col" sm={colNum}>
                    <div className="u-icon">
                        {status}
                    </div>
                    <div className="flow-content">
                        <span className="u-line s-primary">——</span>
                        <h3 className="s-primary">{item.nodeName}</h3>
                        <p>{item.userName}<span>/</span>{item.flowName}</p>
                    </div>
                </Col>
            )
        })

        if (flow.loading) {
            return <Loading />
        }

        return (
            <section className="m-work-flow">
                <Row>
                    {workFlow}
                </Row>
            </section>
        );
    }
}

WorkFlow.propTypes = {

};

export default WorkFlow;