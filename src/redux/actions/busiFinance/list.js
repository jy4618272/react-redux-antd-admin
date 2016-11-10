import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_FINANCE_LIST = 'REQUEST_FINANCE_LIST'
const RECEIVE_FINANCE_LIST = 'RECEIVE_FINANCE_LIST'
// ================================
// Action Creator
// ================================
// 请求页面数据
const requestFinanceList = () => ({
    type: REQUEST_FINANCE_LIST
})

const receiveFinanceList = (res) => ({
    type: RECEIVE_FINANCE_LIST,
    payload: res
})

const fetchFinanceList = (data) => {
    return dispatch => {
        dispatch(requestFinanceList())
        xhr('post', paths.financePath + '/financecollectioncs/selectMoneyFileList', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('财务列表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveFinanceList(newRes))
            } else {
                hide()

                dispatch(receiveFinanceList({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchFinanceList
}

export const ACTION_HANDLERS = {
    [REQUEST_FINANCE_LIST]: (list) => ({
        ...list,
    tableLoading: true
    }),
    [RECEIVE_FINANCE_LIST]: (list, {payload: res}) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    })
}

