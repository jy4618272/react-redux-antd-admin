import React, { Component, PropTypes } from 'react';
import {
    Tooltip,
    Icon,
    Input,
    Button,
    notification
} from 'antd'
import { checkMobile } from 'UTIL'
import 'STYLE/form.less';

class EditableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noButton: this.props.noButton ? this.props.noButton : false,
            value: this.props.value,
            editable: this.props.editable ? this.props.editable : false
        };
    }

    // 修改
    handleChange = (e) => {
        const value = e.target.value
        this.setState({ value });
        if(this.props.noButton){
            this.props.parentHandleSaveCell && this.props.parentHandleSaveCell(value);
        }
    }

    // 按钮保存
    check = () => {
        const { value, noButton } = this.state
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
        }

        // 有保存-编辑按钮就会取消输入框
        if (!noButton) {
            this.setState({
                editable: false
            });
            this.props.parentHandleSaveCell && this.props.parentHandleSaveCell(value);
        }
    }

    // 按钮编辑
    edit = () => {
        this.setState({
            editable: true
        })
    }

    render() {
        const { value, editable, noButton } = this.state
        const wrapStyle = noButton ? 'editable-cell' : 'editable-cell editable-cell-buttons'
        return (
            <div className={wrapStyle}>
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