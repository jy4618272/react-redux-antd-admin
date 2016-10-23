import React, {Component, PropTypes} from 'react'
import {
    Badge
} from 'antd'

import './index.less'
class Title extends Component {
    render () {
        return (
            <div className="clearfix m-title">
                <h2>{this.props.title}</h2>
                <Badge count={this.props.number} />
            </div>
        )
    }
}

Title.propTypes = {

}

export default Title