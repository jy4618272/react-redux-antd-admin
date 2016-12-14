import React, { Component } from 'react'

import './icon.less';

class Icon extends Component {
    render () {
        const { type } = this.props
        return (
            <i className={`icon iconfont icon-${type}`}></i>
        )
    }
}

export default Icon