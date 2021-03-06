import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'
import moment from 'moment'

// ================================
// Action Type
// ================================
const REQUEST_POLICY_EDIT = 'REQUEST_POLICY_EDIT'
const RECEIVE_POLICY_EDIT = 'RECEIVE_POLICY_EDIT'
const REQUEST_POLICY_UPDATE = 'REQUEST_POLICY_UPDATE'
const RECEIVE_POLICY_UPDATE = 'RECEIVE_POLICY_UPDATE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPolicyEdit = () => ({
    type: REQUEST_POLICY_EDIT
})

const receivePolicyEdit = (res) => ({
    type: RECEIVE_POLICY_EDIT,
    payload: res
})
const fetchPolicyEdit = (data) => {
    return dispatch => {
        dispatch(requestPolicyEdit())
        xhr('post', paths.leasePath + '/rentpromotioncs/selectRentPromotionById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('政策优惠之编辑', res)
            const oldObj = res.data
            const newObj = {}
            for (const key in oldObj) {
                if (oldObj[key]) {
                    if (key.indexOf('date') > -1) {
                        newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
                    } else {
                        newObj[key] = oldObj[key]
                    }
                }
            }

            if (res.result === 'success') {
                hide()
                dispatch(receivePolicyEdit(newObj))
            } else {
                hide()
                dispatch(receivePolicyEdit({}))
                errHandler(res.msg)
            }
        })
    }
}

// 政策优惠更新修改
const receivePolicyUpdate = (res) => ({
    type: RECEIVE_POLICY_UPDATE,
    payload: res
})

const fetchPolicyUpdate = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpromotioncs/updateRentPromotion', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('政策优惠之表单更新保存', res)
            if (res.result === 'success') {
                hide()
                dispatch(receivePolicyUpdate(res))
                notification.success({
                    message: '更新成功',
                    description: '政策优惠更新数据成功'
                });
                history.back()
            } else {
                hide()
                dispatch(receivePolicyUpdate({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchPolicyEdit,
    fetchPolicyUpdate
}

export const ACTION_HANDLERS = {
    [REQUEST_POLICY_EDIT]: (policyEdit) => ({
        ...policyEdit,
    loading: true
    }),
[RECEIVE_POLICY_EDIT]: (policyEdit, {payload: res}) => ({
        ...policyEdit,
    loading: false,
    data: res
}),
    [REQUEST_POLICY_UPDATE]: (policyData) => ({
        ...policyData
    }),
        [RECEIVE_POLICY_UPDATE]: (policyData) => ({
        ...policyData
        })
}

