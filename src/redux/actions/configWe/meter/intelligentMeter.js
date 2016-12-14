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
            pageInfo = Object.assign({}, data, {
                skipCount: 0
            });
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

// 删除
const delIntelligentMeter = (res) => ({
    type: DEL_Intelligent_METER,
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
                    description: `删除数据【${data.metertype}表-${data.metername}】`
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

/* default 导出所有 Actions Creator */
export default {
    fetchIntelligentMeter,
    fetchAddIntelligentMeter,
    fetchEditIntelligentMeter,
    fetchDelIntelligentMeter
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
    [EDIT_INTELLIGENT_METER]: (list, { payload: res }) => {
        list.tableData.map(item => {
            if (item.metertype === res.sub.metertype) {
                item.metercode = res.sub.metercode,
                item.metername = res.sub.metername,
                item.meterprice = res.sub.meterprice,
                item.readtype = res.sub.readtype,
                item.supplier = res.sub.supplier,
                item.surplusnumber = res.sub.surplusnumber,
                item.firstthreshold = res.sub.firstthreshold,
                item.secondthreshold = res.sub.secondthreshold,
                item.roommeterid = res.sub.roommeterid
            }
        });
        list.modalForm[0].disabled = false;
        return Object.assign({}, list, { 
            tableLoading: false,
            modalForm: list.modalForm,
            tableData: list.tableData 
        });
    },
    [DEL_INTELLIGENT_METER]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: list.tableData.filter(item =>
            item.roommeterid !== res.sub.roommeterid
        ) 
    })
}

