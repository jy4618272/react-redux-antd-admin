import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANUAL_METER_INPUT = 'REQUEST_MANUAL_METER_INPUT';
const RECEIVE_RELOAD_METER_BILL = 'RECEIVE_RELOAD_METER_BILL';
const RECEIVE_MANUAL_METER_INPUT = 'RECEIVE_MANUAL_METER_INPUT';
const EDIT_CURRENTREADOUT = 'EDIT_CURRENTREADOUT';
const SAVE_MANUAL_METER_INPUT = 'SAVE_MANUAL_METER_INPUT';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManualMeterInput = () => ({
    type: REQUEST_MANUAL_METER_INPUT
})

// 生成账单
const reLoadMeterBill = (res) => ({
    type: RECEIVE_RELOAD_METER_BILL,
    payload: res
});

const fetchReLoadMeterBill = (data) => {
    return dispatch => {
        dispatch(requestManualMeterInput())
        xhr('post', paths.leasePath + '/meterbillcs/reLoadMeterBill', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电业务之生成账单', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '生成账单结果',
                    description: res.msg
                });
                dispatch(reLoadMeterBill({}))                
                dispatch(fetchManualMeterInput({ ...data}));
            } else {
                hide()
                dispatch(reLoadMeterBill({}))
                errHandler(res.msg)
            }
        })
    }
}

// 列表
const receiveManualMeterInput = (res) => ({
    type: RECEIVE_MANUAL_METER_INPUT,
    payload: res
});
const fetchManualMeterInput = (data) => {
    return dispatch => {
        dispatch(requestManualMeterInput())
        xhr('post', paths.leasePath + '/meterbillcs/selectByKeyword', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电业务水电录入', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveManualMeterInput(newRes))
            } else {
                hide()
                dispatch(receiveManualMeterInput({}))
                errHandler(res.msg)
            }
        })
    }
}

// 修改本期示数
const editCurrentreadout = (res) => ({
    type: 'EDIT_CURRENTREADOUT',
    payload: res
});
const fetchEditCurrentreadout = (data) => {
    return dispatch => {
        dispatch(requestManualMeterInput())
        dispatch(editCurrentreadout(data))
    }
}


// 保存
const saveManualMeterInput = (res) => ({
    type: 'SAVE_MANUAL_METER_INPUT',
    payload: res
});
const fetchSaveManualMeterInput = (data) => {
    return dispatch => {
        dispatch(requestManualMeterInput())
        xhr('post', paths.leasePath + '/meterbillcs/saveMeterBill', data, function(res) {
            const hide = message.loading('正在查询...', 0);
    
            console.log('水电业务水电录入', data)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message:'保存成功',
                    description: '请查看数据'
                })
                dispatch(saveManualMeterInput(res))
            } else {
                hide()
                dispatch(saveManualMeterInput({}))
                errHandler(res.msg)
            }
        });
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchManualMeterInput,
    fetchReLoadMeterBill,
    fetchEditCurrentreadout,
    fetchSaveManualMeterInput
}

export const ACTION_HANDLERS = {
    [REQUEST_MANUAL_METER_INPUT]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_RELOAD_METER_BILL]: (list,{payload: res}) => ({
        ...list,
        tableLoading: false
    }),
    [RECEIVE_MANUAL_METER_INPUT]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [EDIT_CURRENTREADOUT]: (list, {payload: res}) => {
        console.log('正在修改:', res.meterbillid)
        if(list.tableData[res.index].meterbillid === res.meterbillid){
            list.tableData[res.index].currentreadout = res.currentreadout;
            list.tableData[res.index].currentamount = res.currentamount;
            list.tableData[res.index].currentmoney = res.currentmoney;
        }
        return {
            ...list,
            tableLoading:false,
            tableData: list.tableData
        }
    },
    [SAVE_MANUAL_METER_INPUT]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false
    }),
}

