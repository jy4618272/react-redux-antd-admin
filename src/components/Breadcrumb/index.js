import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {Breadcrumb, Icon} from 'antd'
const Item = Breadcrumb.Item

import './index.less'

class Bread extends Component {
    constructor(props) {
        super(props)
        console.log('面包屑props', props)
    }

    static inited = false
    static iconMap = new Map()
    static nameMap = new Map()

    init = () => {
        const { menuList } = this.props

        menuList.data.map((level1) => {
            Bread.nameMap.set(level1.key, level1.name)
            Bread.iconMap.set(level1.key, level1.name)

            if (level1.child) {
                level1.child.map((level2) => {
                    Bread.nameMap.set(level2.key, level2.name)
                    if (level2.child) {
                        level2.child.map((level3) => {
                            Bread.nameMap.set(level3.key, level3.name)
                        })
                    }
                })
            }
        })     
    }

    componentDidMount() {
        
    }

    render() {
        if (!this.inited) {
            this.init()
            Bread.inited = true
        }

        const itemArray = []

        // 面包屑导航的最开始都是一个home图标, 并且这个图标时可以点击的
        itemArray.push(<Item key="systemHome" href="#"><Link to="/"><Icon type="home"/>首页</Link></Item>)
    
        for (const route of this.props.routes) {
            const name = Bread.nameMap.get(route.path)
            // console.log('面包屑path', route.path, name) // busi_lease 租赁业务
        
            if (name) {
                const icon = Bread.iconMap.get(route.path)
                if (icon) {
                    itemArray.push(<Item key={name}><Icon type={icon}/>{name}</Item>)
                } else {
                    itemArray.push(<Item key={name}>{name}</Item>)
                }
            }
        }

        return (
            <section className="padding m-breadcrumb clearfix">
                <span className="g-fl">当前位置：</span>
                <Breadcrumb className="g-fl">{itemArray}</Breadcrumb>
            </section>
        )
    }
}

export default Bread
