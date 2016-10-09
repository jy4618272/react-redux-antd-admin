import React, { Component } from 'react'
import { Button } from 'antd'

import './index.less'

export default class NotFound extends Component {
	static contextTypes = {
		router: React.PropTypes.object.isRequired
	}

	goHome = () => {
		this.context.router.replace('/')
	}

	render() {
		// 非实体组件需显式返回 null
		return (
			<section className="m-error-404 clearfix">
				<div className="m-txt">
					<h2>杯具啊！</h2>
					<p>HTTP 404……<br />可能这个页面已经飞走了</p>
				</div>
				<Button type="primary" size="large" onClick={this.goHome}>回首页</Button>				
			</section>
		)
	}
}
