import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { BackTop } from 'antd'
import Header from 'COMPONENT/Header'
import SlideNav from 'COMPONENT/SlideBar'
import Breadcrumb from 'COMPONENT/Breadcrumb'
import Footer from 'COMPONENT/Footer'

import './index.less'
import logo from './img/logo.png'

let DevTools
if (__DEV__ && __COMPONENT_DEVTOOLS__) {
	// 组件形式的 Redux DevTools
	DevTools = require('COMPONENT/DevTools').default
}

@connect(
	({ layout }) => ({ layout }),
	require('ACTION/layout').default
)
class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {layout, slideBarToggle} = this.props
		const layoutStyle = layout.slideBar ? 'm-layout' : 'm-layout m-layout-full'
		return (
			<section className={layoutStyle}>
				<aside className="m-aside" location={this.props.location}>
					<div className="m-logo g-tac">
						<Link to="/"><img src={logo} alt="传化物流园区通" /></Link>
					</div>
					<SlideNav />
				</aside>

				<article className="m-container">
					<Header layout={layout} slideBarToggle={slideBarToggle} />

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
