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
const REQUEST_WORK_FLOW = 'REQUEST_WORK_FLOW'
const RECEIVE_WORK_FLOW = 'RECEIVE_WORK_FLOW'

// ================================
// Action Creator
// ================================
const receiveWorkFlow = (res) => ({
    type: RECEIVE_WORK_FLOW,
    payload: res
})

const fetchWorkFlow = (data) => {
    return dispatch => {
        dispatch({
            type: REQUEST_WORK_FLOW
        })
        xhr('post', paths.leasePath + '/rentpactcs/selectWorkFlowByType', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('流程数据：', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveWorkFlow(res.data))
            } else {
                hide()
                dispatch(receiveWorkFlow({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchWorkFlow
}

export const ACTION_HANDLERS = {
    [RECEIVE_WORK_FLOW]: (workFlow, {payload: res}) => ({
        ...workFlow,
        loading: false,
        data: res
    })
}