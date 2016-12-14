import { message, notification } from 'antd'
import cookie from 'react-cookie'
import { hashHistory } from 'react-router'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

const REQUEST_LOGIN = 'REQUEST_LOGIN'
const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
const REQUEST_LOGOUT = 'REQUEST_LOGOUT'
const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT'

// 登录
const requestLogin = () => ({
    type: REQUEST_LOGIN
})

const receiveLogin = (res) => ({
    type: RECEIVE_LOGIN,
    payload: res
})

// 登出
const requestLogout = () => ({
    type: REQUEST_LOGOUT
})

const receiveLogout = (res) => ({
    type: RECEIVE_LOGOUT,
    payload: res
})


// 登录
const fetchLogin = (data, props) => {
    return dispatch => {
        dispatch(requestLogin())
        xhr('post', paths.leasePath + '/logincs/login_md5', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            if (res.result === 'success') {
                hide()
                if (cookie.load('session_key')) {
                    cookie.remove('session_key')
                }
                cookie.save('session_key', res.code, { path: '/', maxAge: 57600 })
                if (sessionStorage.getItem('site')) {
                    sessionStorage.removeItem('site')
                }
                sessionStorage.setItem('site', res.data.facility)
                notification.success({
                    message: '登录成功',
                    description: '正在进入园区通管理中心页'
                })
                dispatch(receiveLogin(res))
                props = JSON.parse(props)
                if (props.location && props.location.state) {
                    hashHistory.push(props.location.state.nextPathname)
                } else {
                    hashHistory.push('/')
                }
            } else {
                hide()
                dispatch(receiveLogin({}))                
                errHandler(res.msg)
            }
        })
    }
}

// 登出
const fetchLogout = (data) => {
    return dispatch => {
        dispatch(requestLogout())
        xhr('post', paths.leasePath + '/logincs/loginOut', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            if (res.result === 'success') {
                hide()
                cookie.remove('session_key')
                sessionStorage.removeItem('site')
                notification.success({
                    message: '退出成功',
                    description: '正在前往园区通登录界面'
                })
                dispatch(receiveLogout(res))
                hashHistory.push('login')
            } else {
                hide()
                errHandler(res.msg)
            }
        })
    }
}

export default {
    fetchLogin,
    fetchLogout
}

export const ACTION_HANDLERS = {
    [REQUEST_LOGIN]: ( login, { payload: res }) => ({
        loading: true,
        loadingText: '努力登录中...'
    }),
    [RECEIVE_LOGIN]: ( login, { payload: res }) => ({
        loading: false,
        loadingText: '登录',
        data: res
    }),
    [RECEIVE_LOGOUT]: (logout, {payload: res}) => ({
        loading: false,
        loadingText: '登录',
        data: res
    })
}   