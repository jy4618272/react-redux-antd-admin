import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
    Badge,
    Row,
    Col
} from 'antd'

import {
    Loading,
    Title
} from 'COMPONENT'
import actionHome from 'ACTION/home'
import './index.less'


const mapDispatchToProps = (dispatch) => ({
    actionHome: bindActionCreators(actionHome, dispatch)
})

@connect(
    ({ home }) => ({ home }),
    mapDispatchToProps
)
class Busi extends Component {
    constructor(props) {
        super(props)
        console.log('首页', props)
    }

    componentDidMount() {
        this.props.actionHome.fetchHome()
    }

    render() {
        const {
            home
        } = this.props
        if (home.loading) {
            return <Loading />
        }

        const dd = home.data.rentpact.map(item => {
            if (item.name === '待办') {
                return (
                    <Link to="/approval">
                        <Col span={6}>
                            <Row>
                                <Col span={6}>
                                    <div className="title">{item.name}</div>
                                </Col>
                                <Col span={18}>
                                    <div className="val">
                                        <Badge count={item.number} overflowCount={99} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Link>
                )
            }
        })


        return (
            <section className="padding-lr m-busi">
                <Row className="list-news-tips">
                    {dd}
                </Row>
            </section>
        )
    }
}

export default Busi
