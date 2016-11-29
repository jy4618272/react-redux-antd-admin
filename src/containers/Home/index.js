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

        const todos = home.data.rentpact.map(item => {
            if (item.name === '待办') {
                return (
                    <Badge count={item.number} overflowCount={99}>
                        <Link to="/approval" className="u-todo">
                            {item.name}
                        </Link>
                    </Badge>
                )
            }
        })

        return (
            <section className="padding-lr list-todos">
                {todos}
            </section>
        )
    }
}

export default Busi
