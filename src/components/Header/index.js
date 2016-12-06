import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import { Icon, message, Menu } from 'antd'
import cookie from 'react-cookie'
import { rootPaths } from 'SERVICE/config'

import hideMenu from './img/hide_menu.png'
import './index.less'

import actionUserInfo from 'ACTION/userInfo'
import actionLogin from 'ACTION/login'
const mapDispatchToProps = (dispatch) => ({
	actionUserInfo: bindActionCreators(actionUserInfo, dispatch),
	actionLogin: bindActionCreators(actionLogin, dispatch)
})

@connect(
	({ userInfo }) => ({ userInfo }),
	mapDispatchToProps
)
export default class Header extends Component {
	constructor(props) {
		super(props)
	}	

	// 退出登录
	logout = () => {
		// cookie.remove('session_key')
		// window.location.href = rootPaths.configPath + '/myportal/logincs/logout'
		this.props.actionLogin.fetchLogout({
			token: cookie.load('session_key')
		})
	}

	componentDidMount() {
		const {actionUserInfo} = this.props
		actionUserInfo.fetchUser()
	}

	render() {
		const {layout, userInfo, slideBarToggle} = this.props
		const menuStyle = layout.slideBar ? 'u-arrow' : 'u-arrow u-arrow-right'
		return (
			<header className="m-header clearfix">
				<span className="g-fl m-menu-toggle" onClick={slideBarToggle}>
					<img src={hideMenu} alt="菜单显示/隐藏" className={menuStyle} />
				</span>
				<div className="g-fr">
					<ul className="m-header-menu g-fl clearfix">
						<li>
							<Link to="/"><Icon type="inbox" />管理中心</Link>
						</li>
						<li>
							<Icon type="user" />{userInfo.userName}
						</li>

						<li onClick={this.logout}><Icon type="poweroff" />退出</li>
					</ul>
				</div>
			</header>
		)
	}
}
