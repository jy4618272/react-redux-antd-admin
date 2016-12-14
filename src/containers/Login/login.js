import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import md5 from 'md5'
import { Form, Icon, Input, Button, Checkbox, Modal, message, notification } from 'antd'
const FormItem = Form.Item

import { Footer } from 'COMPONENT'
import actionLogin from 'ACTION/login'
import logo from './img/logo.png';
import './login.less';

const mapDispatchToProps = (dispatch) => ({
    actionLogin: bindActionCreators(actionLogin, dispatch)
})
@connect(
    ({ login }) => ({ login }),
    mapDispatchToProps
)
class Login extends Component {
    constructor(props){
        super(props)
        console.log('登录信息：', props)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return
            }

            let newObj = {}
            for (const item in values) {
                if (values[item] !== 'undefined') {
                    if (item === 'password') {
                        newObj[item] = md5(values[item])
                    } else {
                        newObj[item] = values[item]
                    }
                }
            }
            const tmpObj = JSON.stringify(this.props)
            console.log('登录提交值：', newObj)
            this.props.actionLogin.fetchLogin(newObj, tmpObj)
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { login } = this.props
        return (
            <section className="m-login">
                <header className="g-header">
                    <div className="g-wrap">
                        <img src={logo} alt="" />
                    </div>
                </header>
                <div className="m-login-cont">
                    <div className="m-login-form-wp clearfix">
                        <div className="bar"></div>
                        <aside>
                            <ul>
                                <li><i className="icon iconfont icon-earth"></i>互联互通</li>
                                <li><i className="icon iconfont icon-rocket"></i>高效管理</li>
                                <li><i className="icon iconfont icon-resource"></i>资源整合</li>
                            </ul>
                        </aside>
                        <article>
                            <h2>登录账号</h2>
                            <Form onSubmit={this.handleSubmit} className="m-login-form">
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            {
                                                required: true, message: '请输入用户名/工号'
                                            }
                                        ]
                                    })(
                                        <Input size="large" className="g-fs-md g-full" placeholder="请输入用户名/工号" />
                                        )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true, message: '请输入密码'
                                            }
                                        ]
                                    })(
                                        <Input size="large" type="password" className="g-fs-md g-full" placeholder="请输入密码" />
                                        )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: true
                                    })(
                                        <Checkbox className="g-fs-md">记住密码</Checkbox>
                                        )}
                                    <Button type="primary" size="large" disabled={login.loading} id="buttonLogin" className="g-full g-fs-md g-mt20" htmlType="submit">
                                        { login.loadingText }
                                    </Button>
                                </FormItem>
                            </Form>
                        </article>
                    </div>
                </div>
                <Footer />
            </section>
        );
    }
}

Login = Form.create()(Login)
export default Login;