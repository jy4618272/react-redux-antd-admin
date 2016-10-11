import React, { Component } from 'react'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { BackTop } from 'antd'
import Header from 'COMPONENT/Header'
import SlideNav from 'COMPONENT/SlideBar'
import Breadcrumb from 'COMPONENT/Breadcrumb'
import Footer from 'COMPONENT/Footer'
import actionLayout from 'ACTION/layout'

import './index.less'
import logo from './img/logo.png'

let DevTools
if (__DEV__ && __COMPONENT_DEVTOOLS__) {
	// 组件形式的 Redux DevTools
	DevTools = require('COMPONENT/DevTools').default
}

const mapDispatchToProps = (dispatch) => ({
	actionLayout: bindActionCreators(actionLayout, dispatch)
})

@connect(
	({ layout, menuList }) => ({ layout, menuList }),
	mapDispatchToProps
)
class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {layout, menuList, actionLayout} = this.props
		const layoutStyle = layout.slideBar ? 'm-layout' : 'm-layout m-layout-full'
		return (
			<section className={layoutStyle}>
				<aside className="m-aside" location={this.props.location}>
					<div className="m-logo g-tac">
						<Link to="/"><img src={logo} alt="传化物流园区通" /></Link>
					</div>
					<SlideNav menuList= {menuList} mode="inline" />
				</aside>

				<article className="m-container" id="container">
					<Header layout={layout} slideBarToggle={actionLayout.slideBarToggle} />

					<Breadcrumb {...this.props} />
					{/* 相当于 Vue Demo 中的根 router-view */}

					{ this.props.children }
					<Footer />
				</article>

				<BackTop />
				{ DevTools && <DevTools /> }
			</section>
		)
	}
}

export default App
