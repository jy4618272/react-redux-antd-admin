// 流程
import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_APPROVAL_WORK_FLOW = 'REQUEST_APPROVAL_WORK_FLOW'
const RECEIVE_APPROVAL_WORK_FLOW = 'RECEIVE_APPROVAL_WORK_FLOW'

// ================================
// Action Creator
// ================================
const requestApprovalWorkFlow = () => ({
    type: REQUEST_APPROVAL_WORK_FLOW
})

const receiveApprovalWorkFlow = (res) => ({
    type: RECEIVE_APPROVAL_WORK_FLOW,
    payload: res
})

const fetchApprovalWorkFlow = (data) => {
    return dispatch => {
        dispatch(requestApprovalWorkFlow())
        setTimeout(() => {
            xhr('post', paths.workFlowPath + '/flownodecs/selectWorkFlowInformation', data, (res) => {
                const hide = message.loading('正在查询...', 0)
                console.log('审批流程数据：', res)
                if (res.result === 'success') {
                    hide()
                    dispatch(receiveApprovalWorkFlow(res.data))
                } else {
                    hide()
                    dispatch(receiveApprovalWorkFlow({}))
                    errHandler(res.msg)
                }
            })
        }, 4000)
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchApprovalWorkFlow
}

export const ACTION_HANDLERS = {
    [REQUEST_APPROVAL_WORK_FLOW]: (approvalworkFlow, {payload: res}) => ({
        ...approvalworkFlow,
        loading: true,
        data: []
    }),
    [RECEIVE_APPROVAL_WORK_FLOW]: (approvalworkFlow, {payload: res}) => ({
        ...approvalworkFlow,
        loading: false,
        data: res
    })
}