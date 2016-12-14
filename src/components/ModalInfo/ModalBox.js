import React, { Component, PropTypes } from 'react'
import {
    Modal
} from 'antd'

class ModalBox extends Component {
    constructor(props) {
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
            width,
            footer
        } = this.props

        let modalContent
        if (footer) {
            modalContent = <Modal
                visible={visible}
                title={title}
                width={width}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                footer={footer}>
                {this.props.children}
            </Modal>
        } else {
            modalContent = <Modal
                visible={visible}
                title={title}
                width={width}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}>
                {this.props.children}
            </Modal>
        }

        return modalContent
    }
}

ModalBox.propTypes = {

}

export default ModalBox