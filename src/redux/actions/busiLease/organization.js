import {
    message
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_ORGANIZATION = 'REQUEST_CONTRACT_ORGANIZATION'
const RECEIVE_CONTRACT_ORGANIZATION = 'RECEIVE_CONTRACT_ORGANIZATION'
const RESET_CONTRACT_ORGANIZATION = 'RESET_CONTRACT_ORGANIZATION'

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

const fetchOrganization = (data) => {
    return dispatch => {
        dispatch(requestContractOrganization())
        xhr('post', paths.leasePath + '/rentpactfullinfocs/selectOrganizationByPhoneOrPartyName', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            // const newRes = []
            console.log('获取【客户信息】数据：', res)
            if (res.result === 'success') {
                hide()
                // res.data.map(item => {
                //     newRes.push({
                //         organization: item.realname,
                //         operationrange: '',
                //         legalperson: '',
                //         idcard: item.certificatenumber,
                //         address: '',
                //         telephone: item.mobilenumber,
                //         bankname: '',
                //         bankaccount: '',
                //         partyid: item.partyid,
                //         partyname: item.partyname
                //     })
                // })
                dispatch(receiveContractOrganization(res.data))
            } else {
                hide()
                dispatch(receiveContractOrganization([]))
                errHandler(res.msg)
            }
        })
    }
}


// 重置
const resetContract = () => ({
    type: RESET_CONTRACT_ORGANIZATION
})
const resetOrganization = (data) => {
    return dispatch => {
        dispatch(resetContract())
    }
}
/* default 导出所有 Actions Creator */
export default {
    fetchOrganization,
    resetOrganization
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
}),
    [RESET_CONTRACT_ORGANIZATION]: (organization) => ({
        ...organization,
        tableData: []
    })
}