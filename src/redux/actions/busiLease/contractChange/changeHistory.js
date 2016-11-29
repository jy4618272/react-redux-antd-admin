import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_CONTRACT_HISTORY = 'RECEIVE_CONTRACT_HISTORY'
const RECEIVE_CONTRACT_HISTORY_SHOW = 'RECEIVE_CONTRACT_HISTORY_SHOW'

// ================================
// Action Creator
// ================================
const receiveContractHistory = (res) => ({
    type: RECEIVE_CONTRACT_HISTORY,
    payload: res
})

const fetchContractHistory = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpactaltercs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('合同变更历史：', newRes)
            if (res.result === 'success') {
                dispatch(receiveContractHistory(newRes))
            } else {
                dispatch(receiveContractHistory({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 合同变更审批详情
const receiveContractHistoryShow = (res) => ({
    type: RECEIVE_CONTRACT_HISTORY,
    payload: res
})

const fetchContractHistoryShow = (data) => {
    return dispatch => {
        xhr('post', paths.workFlowPath + '/flowrecordcs/selectFlowDetailsByBusinessNo', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('合同变更审批历史：', newRes)
            if (res.result === 'success') {
                dispatch(receiveContractHistoryShow(newRes))
            } else {
                dispatch(receiveContractHistoryShow({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractHistory,
    fetchContractHistoryShow
}

export const ACTION_HANDLERS = {
    [RECEIVE_CONTRACT_HISTORY]: (contractHistory, {payload: res}) => ({
        ...contractHistory,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_CONTRACT_HISTORY_SHOW]: (contractHistoryShow, {payload: res}) => ({
        ...contractHistoryShow,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    })
}