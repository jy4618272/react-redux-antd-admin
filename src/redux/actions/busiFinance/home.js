import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_FINANCE_TABLE = 'REQUEST_FINANCE_TABLE'
const RECEIVE_FINANCE_TABLE = 'RECEIVE_FINANCE_TABLE'
const RECEIVE_RECEIVE = 'RECEIVE_RECEIVE'
const RECEIVE_REFUND = 'RECEIVE_REFUND'
const RECEIVE_BACK = 'RECEIVE_BACK'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestFinanceTable = () => ({
    type: REQUEST_FINANCE_TABLE
})

const receiveFinanceTable = (res) => ({
    type: RECEIVE_FINANCE_TABLE,
    payload: res
})

const fetchFinanceTable = (data) => {
    return dispatch => {
        dispatch(requestFinanceTable())
        xhr('post', paths.financePath + '/financecollectioncs/selectFinanceCollectionByTypeAndName', data, function (res) {
            const hide = message.loading('正在查询...', 0)

            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('财务业务', newRes)
            if (res.result === 'success') {
                dispatch(receiveFinanceTable(newRes))
            } else {
                dispatch(receiveFinanceTable({}))
                errHandler(res.msg)
            }
            hide()
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
                notification.success({
                    message: '确认收款',
                    description: '确认收款成功'
                })
                dispatch(receiveReceive(res))
            } else {
                dispatch(receiveReceive({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}


// 请求确认退款
const receiveRefund = (res) => ({
    type: RECEIVE_REFUND,
    payload: res
})

const fetchRefund = (data) => {
    return dispatch => {
        xhr('post', paths.financePath + '/financecollectioncs/confirmRefund', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('确认退款', res)
            if (res.result === 'success') {
                notification.success({
                    message: '确认退款',
                    description: '确认退款成功'
                })
                dispatch(receiveRefund(res))
            } else {
                dispatch(receiveRefund({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}


// 退回
const receiveBack = (res) => ({
    type: RECEIVE_BACK,
    payload: res
})

const fetchBack = (data) => {
    return dispatch => {
        xhr('post', paths.financePath + '/financecollectioncs/financeBack', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('退回', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '财务退回',
                    description: '财务退回成功'
                })
                dispatch(receiveBack(res))
            } else {
                hide()

                dispatch(receiveBack({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchFinanceTable,
    fetchReceive,
    fetchRefund,
    fetchBack
}

export const ACTION_HANDLERS = {
    [REQUEST_FINANCE_TABLE]: (finance) => ({
        ...finance,
        tableLoading: true
    }),
    [RECEIVE_FINANCE_TABLE]: (finance, {payload: res}) => ({
                ...finance,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_RECEIVE]: (finance, {payload: res}) => ({
        ...finance,
        tableData: finance.tableData.filter(item =>
            item.financecollectionid !== res.data[0].financeCollectionId
        )
    }),
    [RECEIVE_REFUND]: (finance, {payload: res}) => ({
        ...finance,
        tableData: finance.tableData.filter(item =>
            item.financecollectionid !== res.data[0].financeCollectionId
        )
    }),
    [RECEIVE_BACK]: (finance, {payload: res}) => ({
        ...finance,
        tableData: finance.tableData.filter(item =>
            item.financecollectionid !== res.data[0].financeCollectionId
        )
    })
}

