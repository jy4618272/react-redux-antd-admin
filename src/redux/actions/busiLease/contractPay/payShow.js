import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_PAY_SHOW = 'REQUEST_PAY_SHOW'
const RECEIVE_PAY_SHOW = 'RECEIVE_PAY_SHOW'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPayShow = () => ({
    type: REQUEST_PAY_SHOW
})

const receivePayShow = (res) => ({
    type: RECEIVE_PAY_SHOW,
    payload: res
})

const fetchContractPayShow = (data) => {
    return dispatch => {
        dispatch(requestPayShow())
        xhr('post', paths.leasePath + '/rentpactpayplancs/selectRentPactPayPlanFullInfoById', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            if (res.result === 'success') {
                console.log('合同交款详情：', res)
                hide()
                dispatch(receivePayShow(res.data))
            } else {
                hide()
                dispatch(receivePayShow({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchContractPayShow
}

export const ACTION_HANDLERS = {
    [REQUEST_PAY_SHOW]: (payShow) => ({
        ...payShow,
        loading: true
    }),
    [RECEIVE_PAY_SHOW]: (payShow, {payload: res}) => ({
        ...payShow,
        loading: false,        
        data: res
    })
}

