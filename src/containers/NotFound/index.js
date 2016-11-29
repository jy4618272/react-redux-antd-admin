import React, { Component } from 'react'
import { Link } from 'react-router'

import './index.less'
import notFoundImg from './img/not-found.png'

class NotFound extends Component {
	render() {
		return (
			<section className="clearfix m-not-found">
				<div className="m-img">
					<img src={notFoundImg} alt="传化物流园区通" />
				</div>
				<div className="m-cont">
					<h2>杯具啊，404！</h2>
					<p>师傅，您一定是迷路了，回到始发站，重新出发吧...</p>
					<p>您可以<Link to="/">【返回智慧园区首页】</Link></p>
				</div>
			</section>
		)
	}
}

export default NotFound
