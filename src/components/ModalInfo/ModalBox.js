import React, { Component, PropTypes } from 'react'
import {
    Modal
} from 'antd'

class ModalBox extends Component {
    constructor(props){
        super(props)
        console.log('弹框参数props:', props)
    }

    // ok
    handleModalOk = () => {
        // 业务逻辑
        const { parentHandleModalOk  } = this.props
        parentHandleModalOk && parentHandleModalOk()
    }

    // cancel
    handleModalCancel = () => {
        const { parentHandleModalCancel } = this.props
        parentHandleModalCancel && parentHandleModalCancel()    
    }
    
    render() {
        const {
            visible,
            title,
            width
        } = this.props

        return (
            <Modal
                visible={visible}
                title={title}
                width={width}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}>
                {this.props.children}
            </Modal>
        )
    }
}

ModalBox.propTypes = {

}

export default ModalBox