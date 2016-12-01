import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { BackTop } from 'antd'
import Header from 'COMPONENT/Header'
import SlideNav from 'COMPONENT/SlideBar'
import Breadcrumb from 'COMPONENT/Breadcrumb'
import Footer from 'COMPONENT/Footer'
import actionLayout from 'ACTION/layout'
import actionMenu from 'ACTION/menuList'

import cookie from 'react-cookie'
import {
    Loading
} from 'COMPONENT'

import {
    getUrlPara
} from 'UTIL'
import {
    rootPaths
} from 'SERVICE/config'
import 'STYLE/index.less'
import './index.less';

import logoImg from './img/logo-img.png'
import logoTxt from './img/logo-txt.png'

let DevTools
if (__DEV__ && __COMPONENT_DEVTOOLS__) {
    // 组件形式的 Redux DevTools
    DevTools = require('COMPONENT/DevTools').default
}

const mapDispatchToProps = (dispatch) => ({
    actionLayout: bindActionCreators(actionLayout, dispatch),
    actionMenu: bindActionCreators(actionMenu, dispatch)
})

@connect(
    ({ layout, menuList }) => ({ layout, menuList }),
    mapDispatchToProps
)
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            slideBar: true
        }
        const isUrlSessionKey = window.location.href.indexOf('session_key') > -1
        const isCookieSessionKey = cookie.load('session_key')
		/**
		 * getUrlPara
		 * url或cookie没有跳到登录
		 * url有cookie没有设置cookie
		 */
        if (isUrlSessionKey) {
            cookie.save('session_key', getUrlPara('session_key').split('#')[0], { path: '/', maxAge: 57600 })
        } else{
            if(!isCookieSessionKey){
                // 没有登录跳转到对应环境的登录页面
                window.location.href = rootPaths.configPath + '/myportal/logincs/login'
            }
        }
        console.log('框架', props)
    }

    componentDidMount() {
        this.props.actionMenu.fetchMenuList()
    }

    render() {
        const {layout, menuList, actionLayout} = this.props
        const layoutStyle = layout.slideBar ? 'm-layout' : 'm-layout m-layout-full'
        if (menuList.loading) {
            return <Loading />
        }

        return (
            <section className={layoutStyle}>
                <aside className="m-aside" location={this.props.location}>
                    <div className="m-logo g-tac">
                        <Link to="/"><img src={logoImg} className="logo-img" alt="传化物流园区通" /><img src={logoTxt} className="logo-txt" alt="传化物流园区通" /></Link>
                    </div>
                    <SlideNav menuList={menuList.data} mode="inline" />
                </aside>

                <article className="m-container" id="container">
                    <Header layout={layout} slideBarToggle={actionLayout.slideBarToggle} />
                    <section className="g-padding-lr">
                        {/* 相当于 Vue Demo 中的根 router-view */}
                        <Breadcrumb {...this.props} />
                        {this.props.children}
                    </section>
                    <Footer />
                </article>

                <BackTop />
                {DevTools && <DevTools />}
            </section>
        )
    }
}

export default App
