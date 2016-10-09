import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Icon } from 'antd'
// import xhr from 'SERVICE/xhr'

import hideMenu from './img/hide_menu.png'
import './index.less'

@connect(
	({ userInfo }) => ({ userInfo }),
	require('ACTION/userInfo').default
)
export default class Header extends Component {
	constructor(props, context) {
		super(props, context)
	}

	componentDidMount() {
		// $.ajax({
		// 	type: 'post',
		// 	url: 'http://dev.jttest.tf56.com/financeParkAdmin/maincs/getUserInfo',
		// 	dataType: 'json',
		// 	data: {}
		// }).done(function (res) {
		// 	console.log('请求结果', res)
		// }).fail(function (e) {
		// 	console.log('请求结果', e)
		// })

		// $.when($.ajax({
		// 	url: 'http://jttest.tf56.com/financeParkAdmin/maincs/getUserInfoByGet',
		// 	dataType: 'jsonp',
		// 	jsonp: 'callback',
		// 	jsonpCallback: 'success_jsonpCallback',
		// 	data: {}
		// })).done(function (res) {
		// 	console.log(JSON.stringify(res))
		// }).fail(function () {
		// 	console.log('打点数据繁忙，请稍后再试')
		// })
		// xhr('/financeParkAdmin/maincs/getUserInfoByGet', {}, 'get')
		// const hide = message.loading('正在获取用户信息...', 0)
	}

	render() {
		const {layout, slideBarToggle} = this.props
		const menuStyle = layout.slideBar ? 'u-arrow' : 'u-arrow u-arrow-right'
		return (
			<header className="m-header clearfix">
				<span className="g-fl m-menu-toggle" onClick={slideBarToggle}>
					<img src={hideMenu} alt="菜单显示/隐藏" className={menuStyle} />
				</span>
				<div className="g-fr">
					<ul className="m-header-menu clearfix">
						<li>
							<Icon type="user" />用户名称
						</li>
					</ul>
				</div>
			</header>
		)
	}
}
