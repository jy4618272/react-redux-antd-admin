// 水电业务-手工抄表-水电管理
import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_FINANCE_PAYMENT = 'REQUEST_FINANCE_PAYMENT';
const RECEIVE_FINANCE_PAYMENT = 'RECEIVE_FINANCE_PAYMENT';
const RECEIVE_TRY = 'RECEIVE_TRY';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestFinancePayment = () => ({
    type: REQUEST_FINANCE_PAYMENT
})

const receiveFinancePayment = (res) => ({
    type: RECEIVE_FINANCE_PAYMENT,
    payload: res
})
let historyData
// 列表
const fetchFinancePayment = (data) => {
    return dispatch => {
        dispatch(requestFinancePayment())
        xhr('post', paths.leasePath + '/meterpaymentordercs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0);
            res.data.forEach(item => {
                if (item.dealstatus === '失败') {
                    item.dealstatus = '充值失败';
                } else if (item.dealstatus === '未处理' || item.dealstatus === '处理中') {
                    item.dealstatus = '正在重试';
                } else if (item.dealstatus === '成功') {
                    item.dealstatus = '充值成功';
                }
            });
            historyData = data
            const newRes = Object.assign({}, res, {
                sub: data
            });

            console.log('财务业务之交费返回值：', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveFinancePayment(newRes))
            } else {
                hide()
                dispatch(receiveFinancePayment({}))
                errHandler(res.msg)
            }
        })
    }
}

// 重试
const receiveTry = (res) => ({
    type: RECEIVE_TRY,
    payload: res
})
const fetchTry = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/meterpaymentordercs/initializationMeterPaymentOrderDealStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0);
        
            console.log('财务业务之重试：', res)
            if (res.result === 'success') {
                hide()
                dispatch(fetchFinancePayment(historyData))
                dispatch(receiveTry())
            } else {
                hide()
                dispatch(receiveTry({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchFinancePayment,
    fetchTry
}

export const ACTION_HANDLERS = {
    [REQUEST_FINANCE_PAYMENT]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_FINANCE_PAYMENT]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_TRY]: (list) => ({
        ...list
    })
}