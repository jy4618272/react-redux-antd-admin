/**
 * 弹框组件
 */
import React, { Component, PropTypes } from 'react'
import {
    Modal
} from 'antd'
class InnerModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: props.visible,  // modal是否可见
            modalTitle: props.title,
            modalInsert: true  // 当前modal是用来insert还是update
        }
    }

    /**
     * 隐藏modal
     */
    handleModalHide = () => {
        this.setState({
            modalVisible: false
        })
    }


    // 点击modal中确认按钮
    handleModalOk = () => {
        this.handleHideModal()
    }
    render() {
        return (
            <div>33</div>
        )
    }
}

InnerModal.propTypes = {

}

export default InnerModal