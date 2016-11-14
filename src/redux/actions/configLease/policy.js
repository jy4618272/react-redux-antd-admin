import { message, notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_POLICY_TABLE = 'REQUEST_POLICY_TABLE'
const RECEIVE_POLICY_TABLE = 'RECEIVE_POLICY_TABLE'
const RECEIVE_BUSI_POLICY_TABLE = 'RECEIVE_BUSI_POLICY_TABLE'
const RECEIVE_FILTER_POLICY_TABLE = 'RECEIVE_FILTER_POLICY_TABLE'
const STATUS_POPLICY = 'STATUS_POPLICY'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPolicyTable = () => ({
    type: REQUEST_POLICY_TABLE
})

// 列表获取
const receivePolicyTable = (res) => ({
    type: RECEIVE_POLICY_TABLE,
    payload: res
})
const fetchPolicyTable = (data) => {
    return dispatch => {
        dispatch(requestPolicyTable())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之列表', newRes)

            if (res.result === 'success') {
                hide()
                dispatch(receivePolicyTable(newRes))
            } else {
                hide()
                dispatch(receivePolicyTable({}))
                errHandler(res.msg)
            }
        })
    }
}

// 查询获取
const receiveBusiPolicyTable = (res) => ({
    type: RECEIVE_BUSI_POLICY_TABLE,
    payload: res
})
const fetchBusiPolicyTable = (data) => {
    return dispatch => {
        dispatch(requestPolicyTable())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectRentPromotionDetail', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之列表', newRes)

            if (res.result === 'success') {
                dispatch(receiveBusiPolicyTable(newRes))
            } else {
                dispatch(receiveBusiPolicyTable({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 过滤获取
const receiveFilterPolicyTable = (res) => ({
    type: RECEIVE_FILTER_POLICY_TABLE,
    payload: res
})
const fetchFilterPolicyTable = (data) => {
    return dispatch => {
        dispatch(requestPolicyTable())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectRentPromotionBySite', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之列表', newRes)

            if (res.result === 'success') {
                hide()
                dispatch(receiveFilterPolicyTable(newRes))
            } else {
                hide()
                dispatch(receiveFilterPolicyTable({}))
                errHandler(res.msg)
            }
        })
    }
}

// 开启/关闭
const statusPolicy = (res) => ({
    type: STATUS_POPLICY,
    payload: res
})
const changeStatusPolicy = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpromotioncs/updateRentPromotionStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('政策优惠之开启', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '状态' + data.status,
                    description: '状态' + data.status + '成功'
                })
                dispatch(statusPolicy(newRes))
            } else {
                hide()
                dispatch(statusPolicy({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchPolicyTable,
    fetchBusiPolicyTable,
    fetchFilterPolicyTable,
    changeStatusPolicy
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
    skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
}),
    [RECEIVE_BUSI_POLICY_TABLE]: (policyData, {payload: res}) => ({
        ...policyData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_FILTER_POLICY_TABLE]: (policyData, {payload: res}) => ({
        ...policyData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
        [STATUS_POPLICY]: (policyData, {payload: res}) => {
            const obj = policyData.tableData
            obj.map(item => {
                if (item.rentpromotionid === res.sub.rentpromotionid) {
                    item.status = res.sub.status
                }
            })
            return Object.assign({}, policyData, { tableData: obj })
        }
}

