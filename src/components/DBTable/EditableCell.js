import React, { Component, PropTypes } from 'react';
import {
    Tooltip,
    Icon,
    Input,
    Button,
    notification
} from 'antd'
import { checkMobile } from 'UTIL'

class EditableCell extends Component {
    state = {
        value: this.props.value,
        editable: false
    }

    // 修改
    handleChange = (e) => {
        const value = e.target.value
        this.setState({ value })
    }

    // 按钮保存
    check = () => {
        const { value } = this.state
        if (this.props.onChange) {
            this.props.onChange(value);
        }
        // 是否可保存
        if (this.props.validate == 'mobile') {
            if (!checkMobile(value)) {
                notification.error({
                    message: '手机号格式有误',
                    description: '请输入正确的手机号'
                })
                return
            }
            this.setState({
                editable: false
            })
            this.props.parentHandleSaveCell && this.props.parentHandleSaveCell(value)
        }
    }

    // 按钮编辑
    edit = () => {
        this.setState({
            editable: true
        })
    }

    render() {
        const { value, editable } = this.state

        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                ref="cellInput"
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check} />
                            <Tooltip title="保存">
                                <Icon
                                    type="check"
                                    className="editable-cell-icon"
                                    onClick={this.check} />
                            </Tooltip>
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Tooltip title="编辑">
                                <Icon
                                    type="edit"
                                    className="editable-cell-icon"
                                    onClick={this.edit} />
                            </Tooltip>
                        </div>
                }
            </div>
        )
    }
}

EditableCell.propTypes = {

};

export default EditableCell;