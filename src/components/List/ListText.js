import React, { Component, PropTypes } from 'react'
import {
    Row,
    Col
} from 'antd'

class ListText extends Component {
    render() {
        const {
            title,
            dataSource
        } = this.props

        console.log('22222', dataSource)
        
        return (
            <div className="list-text">
                <h3>{title}</h3>
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}

export default ListText