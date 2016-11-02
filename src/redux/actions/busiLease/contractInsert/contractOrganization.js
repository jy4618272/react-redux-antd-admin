import {
    message
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_ORGANIZATION = 'REQUEST_CONTRACT_ORGANIZATION'  // 获取合同模板
const RECEIVE_CONTRACT_ORGANIZATION = 'RECEIVE_CONTRACT_ORGANIZATION'  // 获取合同模板

// ================================
// Action Creator
// ================================
const requestContractOrganization = () => ({
    type: REQUEST_CONTRACT_ORGANIZATION
})
const receiveContractOrganization = (res) => ({
    type: RECEIVE_CONTRACT_ORGANIZATION,
    payload: res
})

const fetchContractOrganization = (data) => {
    return dispatch => {
        dispatch(requestContractOrganization())
        xhr('post', paths.leasePath + '/rentpactfullinfocs/selectOrganizationByPhoneOrPartyName', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = []
            console.log('获取【客户信息】数据：', res)
            if (res.result === 'success') {
                hide()
                res.data.map(item => {
                    newRes.push({
                        organization: item.realname,
                        operationrange: '',
                        legalperson: '',
                        idcard: item.certificatenumber,
                        address: '',
                        telephone: item.mobilenumber,
                        bankname: '',
                        bankaccount: '',
                        partyid: item.partyid,
                        partyname: item.partyname
                    })
                })
                dispatch(receiveContractOrganization(newRes))
            } else {
                hide()
                dispatch(receiveContractOrganization([]))
                errHandler(res.result + '，' + res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractOrganization
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_ORGANIZATION]: (organization) => ({
        ...organization,
        tableLoading: true
    }),
    [RECEIVE_CONTRACT_ORGANIZATION]: (organization, {payload: res}) => ({
        ...organization,
        tableLoading: false,
        tableData: res
    })
}