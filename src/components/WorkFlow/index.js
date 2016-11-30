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
            flow,
            notShowLoading
        } = this.props

        let workFlow
        if(flow.data && flow.data.length){
            workFlow = flow.data.map(item => {
                let status
                if (item.processnodestatus === '同意') {
                    status = <span className="s-green"><Icon type="check-circle" /></span>
                } else if (item.processnodestatus === '不同意') {
                    status = <span className="s-yellow"><Icon type="check-circle" /></span>
                } else if (item.processnodestatus === '待处理') {
                    status = <span className="s-red"><Icon type="exclamation-circle" /></span>
                } else {
                    status = <span className="s-gray"><Icon type="minus-circle" /></span>
                }

                let steps
                if (item.people && item.people.length) {
                    steps = item.people.map(des => {
                        return (
                            <p>{des.username}<span>/</span>{des.jobcard}</p>
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
                            <h3 className="s-primary">{item.nodename}</h3>
                            {steps}
                        </div>
                    </Col>
                )
            })
        }else {
            workFlow = <Col sm={24} className="g-tac s-red">合同流程暂无内容</Col>
        }

        if (flow.loading) {
            if (notShowLoading) {
                return <Col sm={24} className="g-tac g-pb20 s-red">请先选择合同模板，才能显示合同流程</Col>
            }
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