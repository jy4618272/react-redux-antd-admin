import React, {Component, PropTypes} from 'react'
import {
    Badge
} from 'antd'

class Title extends Component {
    render () {
        const style = this.props.style ? this.props.style : ''
        return (
            <div className={style}>
                <h2>{this.props.title}</h2>
                <Badge count={this.props.number} />
            </div>
        )
    }
}

Title.propTypes = {

}

export default Title