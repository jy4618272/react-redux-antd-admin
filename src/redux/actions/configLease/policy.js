import { message } from 'antd'
import xhr from 'SERVICE'
import {errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_POLICY_TABLE = 'REQUEST_POLICY_TABLE'
const RECEIVE_POLICY_TABLE = 'RECEIVE_POLICY_TABLE'
const RECEIVE_BUSI_POLICY_TABLE = 'RECEIVE_BUSI_POLICY_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPolicyTable = () => ({
    type: REQUEST_POLICY_TABLE
})

// 获取
const receivePolicyTable = (res) => ({
    type: RECEIVE_POLICY_TABLE,
    payload: res
})
const fetchPolicyTable = (data) => {
    return dispatch => {
        dispatch(requestPolicyTable())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectRentPromotionDetail', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receivePolicyTable(newRes))
            } else {
                dispatch(receivePolicyTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

// 获取
const receiveBusiPolicyTable = (res) => ({
    type: RECEIVE_BUSI_POLICY_TABLE,
    payload: res
})
const fetchBusiPolicyTable = (data) => {
    return dispatch => {
        dispatch(requestPolicyTable())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectRentPromotionBySite', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveBusiPolicyTable(newRes))
            } else {
                dispatch(receiveBusiPolicyTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchPolicyTable,
    fetchBusiPolicyTable
}

export const ACTION_HANDLERS = {
    [REQUEST_POLICY_TABLE]: (policyData) => ({
        ...policyData,
        tableLoading: true
    }),
    [RECEIVE_POLICY_TABLE]: (policyData, {payload: res}) => ({
        ...policyData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    }),
    [RECEIVE_BUSI_POLICY_TABLE]: (policyData, {payload: res}) => ({
        ...policyData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

