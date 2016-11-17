import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_APPROVAL_OPINIONS = 'REQUEST_APPROVAL_OPINIONS'
const RECEIVE_APPROVAL_OPINIONS = 'RECEIVE_APPROVAL_OPINIONS'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestApprovalOpinions = () => ({
    type: REQUEST_APPROVAL_OPINIONS
})

const receiveApprovalOpinions = (res) => ({
    type: RECEIVE_APPROVAL_OPINIONS,
    payload: res
})

const fetchApprovalOpinions = (data) => {
    return dispatch => {
        dispatch(requestApprovalOpinions())
        xhr('post', paths.workFlowPath + '/flownodecs/selectWorkFlowOpinion', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('审核意见', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveApprovalOpinions(res))
            } else {
                hide()
                dispatch(receiveApprovalOpinions({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchApprovalOpinions
}

export const ACTION_HANDLERS = {
    [REQUEST_APPROVAL_OPINIONS]: (approval) => ({
        ...approval,
        loading: true
    }),
    [RECEIVE_APPROVAL_OPINIONS]: (approval, {payload: res}) => ({
         ...approval,
        loading: false,
        data: res
    })
}

