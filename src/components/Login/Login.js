import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { postUser } from '../../utils/api'

import { Form, Input, Button, Tooltip, Icon, message } from 'antd'
const createForm = Form.create
const FormItem = Form.Item

import './login.less'
import logo from './img/logo-red.png'

class Login extends Component {
    constructor(props, context) {
        super(props, context);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { auth, login } = this.props
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error('表单出错,提交字段有问题');
                return;
            }

            postUser('POST', "self_media/user/login", {
              "mobile": values.name,
              "password": md5(values.passwd)
            }, function(res){
                console.log('fetch', res);
                if(res.ret == 0){
                    login( res.data.token, values.name);
                    message.success(values.name + ',您已成功登录!');
                    localStorage.token = res.data.token;
                    localStorage.userName = values.name;
                }else{
                    message.error(res.data.msg);
                }
            });
        });
    };

    checkPass = (rule, value, callback) => {
        if(value){
        }
        callback();
    }

    noop(){
        return false;
    }

    componentDidMount() {

    }

    render() {
        const { isFieldValidating, getFieldError, getFieldProps } = this.props.form
        const nameProps = getFieldProps('name', {
            rules: [
                { required:true, min: 11, message: '用户名至少为 11 个字符'}
            ]
        });
        const passwdProps = getFieldProps('passwd', {
            rules: [
                { required:true, min: 3, whitespace: true, message: '密码至少 3 个字符'},
                { validator: this.checkPass}
            ]
        });
        const formItemLayout = {
            labelCol: { span: 0},
            wrapperCol: { span: 24}
        };

        return (
            <article className="m-login-no">
                <div className="content clearfix">
                    <div className="g-layout">
                        <div className="form-login">
                            <div className="g-tac g-mb20">
                                <img src={logo} />
                                <h3>欢迎来到121店</h3>
                            </div>
                            <Form horizontal form={this.props.form}>
                                <FormItem
                                    {...formItemLayout}
                                    label=""
                                    hasFeedback
                                    help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}>
                                    <Input size="large" {...nameProps} placeholder="手机号" />
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="">
                                    <Input size="large" {...passwdProps} type="password" placeholder="密码" autoComplete="off"
                                           onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop} />
                                </FormItem>

                                <FormItem {...formItemLayout}>
                                    <Button type="primary" size="large" className="g-full" onClick={this.handleSubmit}>确定</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </article>
        )
    }
}

Login = createForm()(Login)

export default Login

