import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_MANAGER = 'RECEIVE_MANAGER'  // 获取合同模板
const RECEIVE_PACTCODE = 'RECEIVE_PACTCODE'

// ================================
// Action Creator
// ================================
// 获取客户经理
const receiveManager = (res) => ({
    type: RECEIVE_MANAGER,
    payload: res
})

const fetchManager = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/salercs/selectSalerBySite', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = []
            res.data.map(item => {
                newRes.push({
                    key: item.username,
                    value: item.username
                })
            })
            console.log('获取【客户经理】数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveManager(newRes))
            } else {
                dispatch(receiveManager({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 合同号
const receivePactCode = (res) => ({
    type: RECEIVE_PACTCODE,
    payload: res
})

const fetchPactCode = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpactcs/getPactCode', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('获取【合同号】数据：', res)
            if (res.result === 'success') {
                hide()
                dispatch(receivePactCode(newRes))
            } else {
                hide()
                dispatch(receivePactCode({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchManager,
    fetchPactCode
}

export const ACTION_HANDLERS = {
    [RECEIVE_MANAGER]: (tabs, {payload: res}) => tabs.map(item =>
        item.key === 'saler' ? Object.assign({}, item, { options: res }) :
            item
    ),
    [RECEIVE_PACTCODE]: (tabs, {payload: res}) => tabs.map(item =>
        item.key === 'pactcode' ? Object.assign({}, item, { options: res }) :
            item
    )
}