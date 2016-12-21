// 水电业务-后付费（未提交）- 提交财务
import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import moment from 'moment';
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANUAL_METER_NOTCONFIRMED = 'REQUEST_MANUAL_METER_NOTCONFIRMED';
const RECEIVE_MANUAL_METER_NOTCONFIRMED = 'RECEIVE_MANUAL_METER_NOTCONFIRMED';
const RECEIVE_COMMIT_FINANCE = 'RECEIVE_COMMIT_FINANCE';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManualMeterNotConfirmed = () => ({
    type: REQUEST_MANUAL_METER_NOTCONFIRMED
})

// 列表
const receiveManualMeterNotConfirmed = (res) => ({
    type: RECEIVE_MANUAL_METER_NOTCONFIRMED,
    payload: res
});
const fetchManualMeterNotConfirmed = (data) => {
    return dispatch => {
        dispatch(requestManualMeterNotConfirmed())
        xhr('post', paths.leasePath + '/meterbillcs/selectMeterPayment', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电业务之人工抄表未提交', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveManualMeterNotConfirmed(newRes))
            } else {
                hide()
                dispatch(receiveManualMeterNotConfirmed({}))
                errHandler(res.msg)
            }
        })
    }
}

// 提交财务
const receiveCommitFinance = (res) => ({
    type: RECEIVE_COMMIT_FINANCE,
    payload: res
});
const fetchCommitFinance = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/meterpaymentcs/subbitFinance', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电业务之提交财务：', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message:'提交财务成功',
                    description: `成功提交${res.count}条财务数据`
                })
                dispatch(receiveCommitFinance(res));
                dispatch(fetchManualMeterNotConfirmed({
                    checkdate: moment().subtract(1, 'months').format('YYYY-MM') + '-01',
                    pageSize:30,
                    skipCount:0
                }));
            } else {
                hide()
                dispatch(receiveCommitFinance({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchManualMeterNotConfirmed,
    fetchCommitFinance
}

export const ACTION_HANDLERS = {
    [REQUEST_MANUAL_METER_NOTCONFIRMED]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_MANUAL_METER_NOTCONFIRMED]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_COMMIT_FINANCE]: (list) => ({
        ...list
    })
}

