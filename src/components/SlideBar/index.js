import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const MenuItem = Menu.Item

import './index.less'

class SlideNav extends Component {
    constructor(props) {
        super(props)
        // alert(localStorage.slideMenuCurrent)
        this.state = {
            current: localStorage.slideMenuCurrent || '/'
        }
    }

    handleClick = (e) => {
        console.log('click ', e)
        localStorage.slideMenuCurrent = e.key
        this.setState({
            current: e.key
        })
    }

    transFormMenuItem(level, paths) {
        const parsePath = paths.join('/')

        return (
            <MenuItem key={level.key}>
                { level.child ? level.name : <Link to={`/${parsePath}`}>{level.name}</Link> }
            </MenuItem>
        )
    }

    componentWillMount() {
        let { menuList } = this.props
        const paths = []
        const defaultOpenKeys = []

        const menuStr = menuList.map((level1) => {
            paths.push(level1.key)
            // console.log(paths)
            
            if (defaultOpenKeys.length === 0) {
                defaultOpenKeys.push(level1.key)
            }

            // 一级菜单
            if (level1.child) {
                const level2menu = level1.child.map((level2) => {
                    paths.push(level2.key)

                    // console.log(paths)

                    // 二级菜单
                    if (level2.child) {
                        const level3menu = level2.child.map((level3) => {
                            paths.push(level3.key)

                            // console.log(paths)
                            const tmp = this.transFormMenuItem(level3, paths)
                            paths.pop()
                            return tmp
                        })

                        paths.pop()
                        return (
                            <MenuItemGroup key={level2.key} title={level2.name}>
                                {level3menu}
                            </MenuItemGroup>
                        )
                    } else {
                        const tmp = this.transFormMenuItem(level2, paths)
                        paths.pop()
                        return tmp
                    }
                })

                paths.pop()
                return (
                    <SubMenu key={level1.key} title={<span><Icon type={level1.icon } />{level1.name}</span>}>
                        {level2menu}
                    </SubMenu>
                )
            } else {
                const tmp = this.transFormMenuItem(level1, paths)
                paths.pop()
                return tmp
            }
        })

        this.menuStr = menuStr
        this.defaultOpenKeys = defaultOpenKeys
    }

    render() {
        const {mode} = this.props
        return (
            <nav>
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={this.defaultOpenKeys}
                    selectedKeys={[this.state.current]}
                    mode={mode}>
                    {this.menuStr}
                </Menu>
            </nav>
        )
    }
}

export default SlideNav



