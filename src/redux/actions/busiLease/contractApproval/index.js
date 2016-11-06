import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_APPROVAL_TABLE = 'REQUEST_APPROVAL_TABLE'
const RECEIVE_APPROVAL_TABLE = 'RECEIVE_APPROVAL_TABLE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const receiveApprovalTable = (res) => ({
    type: RECEIVE_APPROVAL_TABLE,
    payload: res
})

const fetchApprovalTable = (data) => {
    return dispatch => {
        dispatch({
            type: REQUEST_APPROVAL_TABLE
        })
        xhr('post', paths.workFlowPath + '/flownodecs/queryMyTask', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('我的代办', newRes)
            if (res.result === 'success') {
                hide()

                dispatch(receiveApprovalTable(newRes))
            } else {
                hide()

                dispatch(receiveApprovalTable({}))
                errHandler(res.result)
            }
        })
    }
}


// 请求确认收款
const receiveReceive = (res) => ({
    type: RECEIVE_RECEIVE,
    payload: res
})

const fetchReceive = (data) => {
    return dispatch => {
        xhr('post', paths.financePath + '/financecollectioncs/confirmPay', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('确认收款', res)
            if (res.result === 'success') {
                dispatch(receiveReceive(res))
            } else {
                dispatch(receiveReceive({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchApprovalTable
}

export const ACTION_HANDLERS = {
    [REQUEST_APPROVAL_TABLE]: (approval) => ({
        ...approval,
        tableLoading: true
    }),
    [RECEIVE_APPROVAL_TABLE]: (approval, {payload: res}) => ({
         ...approval,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    })
}

