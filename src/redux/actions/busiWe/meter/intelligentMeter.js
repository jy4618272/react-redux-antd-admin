import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_INTELLIGENT_METER = 'REQUEST_INTELLIGENT_METER';
const RECEIVE_INTELLIGENT_METER = 'RECEIVE_INTELLIGENT_METER';
const RECEIVE_REMINDERS = 'RECEIVE_REMINDERS';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestIntelligentMeter = () => ({
    type: REQUEST_INTELLIGENT_METER
})

const receiveIntelligentMeter = (res) => ({
    type: RECEIVE_INTELLIGENT_METER,
    payload: res
})

// 列表
const fetchIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter())
        xhr('post', paths.leasePath + '/roommetercs/selectNoopsycheMeterByKeyword', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电业务之房间智能表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveIntelligentMeter(newRes))
            } else {
                hide()
                dispatch(receiveIntelligentMeter({}))
                errHandler(res.msg)
            }
        })
    }
}

// 催交
const receiveReminders = (res) => ({
    type: RECEIVE_REMINDERS,
    payload: res
})

const fetchReminders = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/roommetercs/callById', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电业务之催交', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveReminders(newRes))
            } else {
                hide()
                dispatch(receiveReminders({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchIntelligentMeter,
    fetchReminders
}

export const ACTION_HANDLERS = {
    [REQUEST_INTELLIGENT_METER]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_INTELLIGENT_METER]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_REMINDERS]: (list) => ({
        ...list
    })
}

