import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANUAL_METER = 'REQUEST_MANUAL_METER';
const RECEIVE_MANUAL_METER = 'RECEIVE_MANUAL_METER';
const ADD_MANUAL_METER = 'ADD_MANUAL_METER';
const EDIT_MANUAL_METER = 'EDIT_MANUAL_METER';
const DEL_MANUAL_METER = 'DEL_MANUAL_METER';

const VALIDATE_METER_CODE = 'VALIDATE_METER_CODE';
const VALIDATE_METER_NAME = 'VALIDATE_METER_NAME';
const SELECT_METER_TYPE = 'SELECT_METER_TYPE';

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManualMeter = () => ({
    type: REQUEST_MANUAL_METER
});

const receiveManualMeter = (res) => ({
    type: RECEIVE_MANUAL_METER,
    payload: res
});

let pageInfo
// 列表
const fetchManualMeter = (data) => {
    return dispatch => {
        dispatch(requestManualMeter())
        xhr('post', paths.leasePath + '/roommetercs/selectListByRoomId', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            pageInfo = Object.assign({}, data, {
                skipCount: 0
            });
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电配置之房间人工抄表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveManualMeter(newRes))
            } else {
                hide()
                dispatch(receiveManualMeter({}))
                errHandler(res.msg)
            }
        })
    }
}

// 新增
const addManualMeter = (res) => ({
    type: ADD_MANUAL_METER,
    payload: res
});
const fetchAddManualMeter = (data) => {
    return dispatch => {
        dispatch(requestManualMeter())
        xhr('post', paths.leasePath + '/roommetercs/insertRoomMeter', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之人工抄表新增', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '人工抄表新增数据成功'
                });
                dispatch(addManualMeter(newRes))
                dispatch(fetchManualMeter(pageInfo))
            } else {
                hide()
                dispatch(addManualMeter({}))
                errHandler(res.msg)
            }
        })
    }
}

// 修改
const editManualMeter = (res) => ({
    type: EDIT_MANUAL_METER,
    payload: res
});
const fetchEditManualMeter = (data) => {
    return dispatch => {
        dispatch(requestManualMeter())
        xhr('post', paths.leasePath + '/roommetercs/updateRoomMeter', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电配置之人工抄表修改', newRes);
            if (res.result === 'success') {
                hide();
                notification.success({
                    message: '修改成功',
                    description: '人工抄表修改数据成功'
                });
                dispatch(editManualMeter(newRes));
            } else {
                hide();
                dispatch(editManualMeter({}));
                errHandler(res.msg);
            }
        })
    }
}

// 删除
const delManualMeter = (res) => ({
    type: DEL_MANUAL_METER,
    payload: res
});
const fetchDelManualMeter = (data) => {
    return dispatch => {
        dispatch(requestManualMeter())
        xhr('post', paths.leasePath + '/roommetercs/updateRoomMeterDeleted', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            const newRes = Object.assign({}, res, {
                sub: data
            });
            console.log('水电配置之人工抄表删除', newRes);
            if (res.result === 'success') {
                hide();
                notification.success({
                    message: '删除成功',
                    description: `删除数据【${data.metertype}表-${data.metername}】`
                });
                dispatch(delManualMeter(newRes));
            } else {
                hide();
                dispatch(delManualMeter({}));
                errHandler(res.msg);
            }
        })
    }
}


// 验证设备号
const validateOnlyMetercode = (res) => ({
    type: VALIDATE_METER_CODE,
    payload: res
});
const validateMetercode = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/roommetercs/selectRoomMeterByname', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电配置之设备号检测', res);
            hide()
            if (res.result === 'success') {
                notification.success({
                    message: res.msg,
                    description: `设备号【${data.metercode}】`
                })
                dispatch(validateOnlyMetercode(res))
            } else {
                dispatch(validateOnlyMetercode({}))
                errHandler(res.msg)
            }
        })
    }
}

// 验证设备号
const validateOnlyMetername = (res) => ({
    type: VALIDATE_METER_CODE,
    payload: res
});
const validateMetername = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/roommetercs/selectMeterNameByname', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电配置之表名称检测', res);
            hide()
            if (res.result === 'success') {
                notification.success({
                    message: res.msg,
                    description: `表名称【${data.metername}】`
                })
                dispatch(validateOnlyMetername(res))
            } else {
                dispatch(validateOnlyMetername({}))
                errHandler(res.msg)
            }
        })
    }
}

// 选择类型
const receiveSelectMeterType = (res) => ({
    type: SELECT_METER_TYPE,
    payload: res
})
const selectMeterType = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/roommetercs/selectChangeTypeListByMeterType', data, function(res) {
            const hide = message.loading('正在查询...', 0);
            console.log('水电配置之人工抄表类型选择：', res);
            hide()
            if (res.result === 'success') {
                dispatch(receiveSelectMeterType(res))
            } else {
                dispatch(receiveSelectMeterType({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchManualMeter,
    fetchAddManualMeter,
    fetchEditManualMeter,
    fetchDelManualMeter,
    validateMetercode,
    validateMetername,
    selectMeterType
}

export const ACTION_HANDLERS = {
    [REQUEST_MANUAL_METER]: (list) => ({
        ...list,
        tableLoading: true
    }),
    [RECEIVE_MANUAL_METER]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [ADD_MANUAL_METER]: (list, { payload: res }) => {
        if (res.sub) {
            list.tableData.unshift(res.sub)
        };
        list.modalForm[3].options = [];        
        return Object.assign({}, list, {
            tableLoading: false,
            modalForm: list.modalForm,
            tableData: list.tableData
        });
    },
    [EDIT_MANUAL_METER]: (list, { payload: res }) => {
        list.tableData.map(item => {
            if (item.metertype === res.sub.metertype) {
                item.metercode = res.sub.metercode,
                item.metername = res.sub.metername,
                item.readtype = res.sub.readtype,
                item.chargetype = res.sub.chargetype,
                item.meterrate = res.sub.meterrate,
                item.defaultreadout = res.sub.defaultreadout,
                item.roommeterid = res.sub.roommeterid
            }
        });
        list.modalForm[3].options = [];
        return Object.assign({}, list, { 
            tableLoading: false,
            modalForm: list.modalForm,
            tableData: list.tableData 
        });
    },
    [DEL_MANUAL_METER]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: list.tableData.filter(item =>
            item.roommeterid !== res.sub.roommeterid
        ) 
    }),
    [VALIDATE_METER_CODE]: (list) => ({
        ...list
    }),
    [VALIDATE_METER_NAME]: (list) => ({
        ...list
    }),
    [SELECT_METER_TYPE]: (list, {payload: res}) => {
        let arr = [];
        res.data.map(item => {
            arr.push({
                key: item.chargetype,
                value: item.chargetype,                
                meterchangetypeid: item.meterchangetypeid,
                meterprice: item.meterprice,
                meterrate:item.meterrate,
                metertype: item.metertype
            });
        });
        list.modalForm[3].options = arr;
        return { 
            ...list,
            modalForm: list.modalForm
        } 
    }
}

