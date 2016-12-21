import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_METER_DETAIL = 'REQUEST_METER_DETAIL';
const RECEIVE_METER_DETAIL = 'RECEIVE_METER_DETAIL';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestMeterDetail = () => ({
    type: REQUEST_METER_DETAIL
})

const receiveMeterDetail = (res) => ({
    type: RECEIVE_METER_DETAIL,
    payload: res
})

// 列表
const fetchMeterDetail = (data) => {
    return dispatch => {
        dispatch(requestMeterDetail())
        xhr('post', paths.leasePath + '/meterbillcs/selectAllByPartyId', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电业务之详情：', newRes);
            if (res.result === 'success') {
                hide()
                dispatch(receiveMeterDetail(newRes))
            } else {
                hide()
                dispatch(receiveMeterDetail({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchMeterDetail
}

export const ACTION_HANDLERS = {
    [REQUEST_METER_DETAIL]: (list) => ({
        ...list,
        tableLoading: true
    }),
    [RECEIVE_METER_DETAIL]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    })
}

