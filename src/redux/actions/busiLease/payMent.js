import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_PAY_MENT = 'REQUEST_PAY_MENT'
const RECEIVE_PAY_MENT = 'RECEIVE_PAY_MENT'

// ================================
// Action Creator
// ================================
// 打印缴款单
const requestPayMent = () => ({
    type: REQUEST_PAY_MENT
})
// 请求页面数据
const receivePayMent = (res) => ({
    type: RECEIVE_PAY_MENT,
    payload: res
})

// 合同缴款单
const fetchContractPayMent = (data) => {
    return dispatch => {
        dispatch(requestPayMent())
        xhr('post', paths.leasePath + '/rentpactpayplancs/selectRentPactPayPlanFullInfoById', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            if (res.result === 'success') {
                console.log('合同交款详情：', res)
                hide()
                dispatch(receivePayMent(res.data))
            } else {
                hide()
                dispatch(receivePayMent({}))
                errHandler(res.msg)
            }
        })
    }
}


// 保证金
const fetchBondPayMent = (data) => {
    return dispatch => {
        dispatch(requestPayMent())
        xhr('post', paths.leasePath + '/margincs/selectMarginById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            if (res.result === 'success') {
                console.log('临时摊位详情：', res)
                hide()
                dispatch(receivePayMent(res.data))
            } else {
                hide()
                dispatch(receivePayMent({}))
                errHandler(res.msg)
            }
        })
    }
}


// 临时摊位
const fetchNotContractPayMent = (data) => {
    return dispatch => {
        dispatch(requestPayMent())
        xhr('post', paths.leasePath + '/boothpaymentcs/selectBoothPaymentById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            if (res.result === 'success') {
                console.log('临时摊位详情：', res)
                hide()
                dispatch(receivePayMent(res.data))
            } else {
                hide()
                dispatch(receivePayMent({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchContractPayMent,
    fetchBondPayMent,
    fetchNotContractPayMent
}

export const ACTION_HANDLERS = {
    [REQUEST_PAY_MENT]: (payMent) => ({
        ...payMent,
        loading: true
    }),
    [RECEIVE_PAY_MENT]: (payMent, {payload: res}) => ({
        ...payMent,
        loading: false,        
        data: res
    })
}

