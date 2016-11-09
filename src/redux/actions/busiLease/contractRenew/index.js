import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_RENEW = 'REQUEST_CONTRACT_RENEW'
const RECEIVE_CONTRACT_RENEW = 'RECEIVE_CONTRACT_RENEW'


// ================================
// Action Creator
// ================================
const receiveContractRenew = (res) => ({
    type: RECEIVE_CONTRACT_RENEW,
    payload: res
})

const fetchContractRenew = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpactfullinfocs/selectRentPactFullInfoById', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('获取【合同】数据：', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveContractRenew(res))
            } else {
                hide()
                dispatch(receiveContractRenew({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractRenew
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_RENEW]: (contractRenew) => ({
        ...contractRenew,
        loading: true
    }),
    [RECEIVE_CONTRACT_RENEW]: (contractRenew, {payload: res}) => ({
        ...contractRenew,
        loading: false,
        data: res.data
    })
}