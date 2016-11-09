import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_APPROVAL_SHOW = 'RECEIVE_APPROVAL_SHOW'


// ================================
// Action Creator
// ================================
// 请求页面数据
const receiveApprovalShow = (res) => ({
    type: RECEIVE_APPROVAL_SHOW,
    payload: res
})

const fetchApprovalShow = (data) => {
    return dispatch => {
        xhr('post', paths.workFlowPath + '/flowrecordcs/selectFlowDetailsByBusinessNo', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            if (res.result === 'success') {
                hide()
                dispatch(receiveApprovalShow(res))
            } else {
                hide()
                dispatch(receiveApprovalShow({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchApprovalShow
}

export const ACTION_HANDLERS = {
    [RECEIVE_APPROVAL_SHOW]: (approval, {payload: res}) => ({
        ...approval,
        loading: false,
        data:res.data
    })
}

