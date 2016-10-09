import React, {Component} from 'react'
import {Icon} from 'antd'
import './index.less'

class Error extends Component {
    render () {
        const {errorMsg} = this.props
        return (
            <div className="m-not-found">
                <div className="u-error"><Icon type="frown"/></div>
                <h1>{errorMsg || '真是个糟糕的事'}</h1>
            </div>
        )
    }
}

export default Error
