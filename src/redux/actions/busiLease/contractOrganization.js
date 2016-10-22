import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_CONTRACT_ORGANIZATION = 'RECEIVE_CONTRACT_ORGANIZATION'  // 获取合同模板

// ================================
// Action Creator
// ================================
const receiveContractOrganization = (res) => ({
    type: RECEIVE_CONTRACT_ORGANIZATION,
    payload: res
})

const fetchContractOrganization = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentpactfullinfocs/selectOrganizationByPhoneOrPartyName', data, (res) => {
            console.log('获取【客户信息】数据：', res)
            if (res.result === 'success') {
                dispatch(receiveContractOrganization(res))
            } else {
                dispatch(receiveContractOrganization({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractOrganization
}

export const ACTION_HANDLERS = {
    [RECEIVE_CONTRACT_ORGANIZATION]: (contractOrganization, {payload: res}) => []
}