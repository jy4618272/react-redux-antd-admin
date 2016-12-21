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
const REQUEST_MANUAL_METER_CONFIRMED = 'REQUEST_MANUAL_METER_CONFIRMED';
const RECEIVE_MANUAL_METER_CONFIRMED = 'RECEIVE_MANUAL_METER_CONFIRMED';
const MANUAL_METER_PRINT_PAYMENT = 'MANUAL_METER_PRINT_PAYMENT';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManualMeterConfirmed = () => ({
    type: REQUEST_MANUAL_METER_CONFIRMED
})

const receiveManualMeterConfirmed = (res) => ({
    type: RECEIVE_MANUAL_METER_CONFIRMED,
    payload: res
})

// 列表
const fetchManualMeterConfirmed = (data) => {
    return dispatch => {
        dispatch(requestManualMeterConfirmed())
        xhr('post', paths.leasePath + '/meterpaymentcs/selectByKeyword', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电业务之人工抄表已提交', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveManualMeterConfirmed(newRes))
            } else {
                hide()
                dispatch(receiveManualMeterConfirmed({}))
                errHandler(res.msg)
            }
        })
    }
}

// 打印交款单
const receivePrintPayment = (res) => ({
    type: MANUAL_METER_PRINT_PAYMENT,
    payload: res
})

const fetchPrintPayment = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/meterpaymentcs/printByPartyid', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电业务之打印交款单: ', res)
            if (res.result === 'success') {
                hide()
                dispatch(receivePrintPayment(res))
            } else {
                hide()
                dispatch(receivePrintPayment({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchManualMeterConfirmed,
    fetchPrintPayment
}

export const ACTION_HANDLERS = {
    [REQUEST_MANUAL_METER_CONFIRMED]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_MANUAL_METER_CONFIRMED]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [MANUAL_METER_PRINT_PAYMENT]: (list, { payload: res }) => ({
        ...list,
        printPayment: {
            tableLoading: false,
            tableData:res.data
        }
    })
}

