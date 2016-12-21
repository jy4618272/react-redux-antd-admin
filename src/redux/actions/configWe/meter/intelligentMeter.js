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
const ADD_INTELLIGENT_METER = 'ADD_INTELLIGENT_METER';
const EDIT_INTELLIGENT_METER = 'EDIT_INTELLIGENT_METER';
const DEL_INTELLIGENT_METER = 'DEL_INTELLIGENT_METER';
const READ_INTELLIGENT_METER = 'READ_INTELLIGENT_METER'
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

let pageInfo
// 列表
const fetchIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter())
        xhr('post', paths.leasePath + '/roommetercs/selectListByRoomId', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            pageInfo = data;
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之房间智能表', newRes)
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

// 新增
const addIntelligentMeter = (res) => ({
    type: ADD_INTELLIGENT_METER,
    payload: res
});
const fetchAddIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter())
        xhr('post', paths.leasePath + '/roommetercs/insertRoomMeter', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之智能表新增', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '智能表新增数据成功'
                });
                dispatch(addIntelligentMeter(newRes))
                dispatch(fetchIntelligentMeter(pageInfo))
            } else {
                hide()
                dispatch(addIntelligentMeter({}))
                errHandler(res.msg)
            }
        })
    }
}


// 准备修改
const TO_EDIT_INTELLIGENT_METER = 'TO_EDIT_INTELLIGENT_METER'
const requestToEditIntelligentMeter = () => ({
    type: TO_EDIT_INTELLIGENT_METER
});
const toEditIntelligentMeter = () => {
    return dispatch => {
        dispatch(requestToEditIntelligentMeter());
    }
}
// 修改
const editIntelligentMeter = (res) => ({
    type: EDIT_INTELLIGENT_METER,
    payload: res
});
const fetchEditIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter());
        xhr('post', paths.leasePath + '/roommetercs/updateRoomMeter', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电配置之智能表修改', newRes);
            if (res.result === 'success') {
                hide();
                notification.success({
                    message: '修改成功',
                    description: '智能表修改数据成功'
                });
                dispatch(editIntelligentMeter(newRes));
            } else {
                hide();
                dispatch(editIntelligentMeter({}));
                errHandler(res.msg);
            }
        })
    }
}

// 取消修改
const CANCELL_EDIT_INTELLIGENT_METER = 'CANCELL_EDIT_INTELLIGENT_METER'
const requestCancelEditIntelligentMeter = () => ({
    type: CANCELL_EDIT_INTELLIGENT_METER
});
const cancelEditIntelligentMeter = () => {
    return dispatch => {
        dispatch(requestCancelEditIntelligentMeter());
    }
}

// 删除
const delIntelligentMeter = (res) => ({
    type: DEL_INTELLIGENT_METER,
    payload: res
});
const fetchDelIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter())
        xhr('post', paths.leasePath + '/roommetercs/updateRoomMeterDeleted', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电配置之智能表删除', newRes);
            if (res.result === 'success') {
                hide();
                notification.success({
                    message: '删除成功',
                    description: `智能表【${data.metertype}-${data.metername}】`
                });
                dispatch(delIntelligentMeter(newRes));
            } else {
                hide();
                dispatch(delIntelligentMeter({}));
                errHandler(res.msg);
            }
        })
    }
}

// 读取
const readIntelligentMeter = (res) => ({
    type: READ_INTELLIGENT_METER,
    payload: res
});
const fetchReadIntelligentMeter = (data) => {
    return dispatch => {
        dispatch(requestIntelligentMeter());
        xhr('post', paths.leasePath + '/roommetercs/readSurplusNumber', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电配置之智能表读取：', res);
            if (res.result === 'success') {
                hide();
                notification.success({
                    message: '读取成功',
                    description: '智能表读取数据成功'
                });
                dispatch(fetchIntelligentMeter(pageInfo))
                dispatch(readIntelligentMeter(res));
            } else {
                hide();
                dispatch(readIntelligentMeter({}));
                errHandler(res.msg);
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchIntelligentMeter,
    fetchAddIntelligentMeter,
    toEditIntelligentMeter,
    fetchEditIntelligentMeter,
    cancelEditIntelligentMeter,
    fetchDelIntelligentMeter,
    fetchReadIntelligentMeter
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
    [ADD_INTELLIGENT_METER]: (list, { payload: res }) => {
        if (res.sub) {
            list.tableData.unshift(res.sub)
        }
        return {
            ...list,
            tableLoading: false,
            tableData: list.tableData
        }
    },
    [TO_EDIT_INTELLIGENT_METER]: (list) => {
        list.modalForm[0].disabled = true;
        return {
            ...list,
            modalForm: list.modalForm
        } 
    },
    [EDIT_INTELLIGENT_METER]: (list, { payload: res }) => {
        list.tableData.map(item => {
            if (item.roommeterid === res.sub.roommeterid) {
                item.metercode = res.sub.metercode,
                item.metername = res.sub.metername,
                item.meterprice = res.sub.meterprice,
                item.supplier = res.sub.supplier,
                item.firstthreshold = res.sub.firstthreshold,
                item.secondthreshold = res.sub.secondthreshold
            }
        });
        list.modalForm[0].disabled = false;
        return Object.assign({}, list, { 
            tableLoading: false,
            modalForm: list.modalForm,
            tableData: list.tableData 
        });
    },
    [CANCELL_EDIT_INTELLIGENT_METER]: (list) => {
        list.modalForm[0].disabled = false;
        return {
            ...list,
            modalForm: list.modalForm
        } 
    },
    [DEL_INTELLIGENT_METER]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: list.tableData.filter(item =>
            item.roommeterid !== res.sub.roommeterid
        ) 
    }),
    [READ_INTELLIGENT_METER]: (list) => ({
        ...list
    })
}

