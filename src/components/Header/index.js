import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import { Icon, message } from 'antd'
import actionUserInfo from 'ACTION/userInfo'


// import xhr from 'SERVICE/xhr'

import hideMenu from './img/hide_menu.png'
import './index.less'

const mapDispatchToProps = (dispatch) => ({
	actionUserInfo: bindActionCreators(actionUserInfo, dispatch) 
})

@connect(
	({ userInfo }) => ({ userInfo }),
	mapDispatchToProps
)
export default class Header extends Component {
	constructor(props) {
		super(props)
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
					<ul className="m-header-menu clearfix">
						<li>
							<Icon type="user" />{userInfo.userName}
						</li>
					</ul>
				</div>
			</header>
		)
	}
}
