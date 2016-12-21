import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_PRINT_LIST = 'REQUEST_PRINT_LIST'
const RECEIVE_PRINT_LIST = 'RECEIVE_PRINT_LIST'
const RECEIVE_PRINT_ADD = 'RECEIVE_PRINT_ADD'
const RECEIVE_PRINT_EDIT = 'RECEIVE_PRINT_EDIT'
const RECEIVE_PRINT_DELETE = 'RECEIVE_PRINT_DELETE'
// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPrintList = () => ({
    type: REQUEST_PRINT_LIST
})

const receivePrintList = (res) => ({
    type: RECEIVE_PRINT_LIST,
    payload: res
})

let pageInfo

// 列表
const fetchPrintList = (data) => {
    return dispatch => {
        dispatch(requestPrintList())
        xhr('post', paths.leasePath + '/meterprintinfocs/selectByIndex ', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            pageInfo = Object.assign({}, data, {
                skipCount: 0
            });
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之打印参数配置列表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receivePrintList(newRes))
            } else {
                hide()
                dispatch(receivePrintList({}))
                errHandler(res.msg)
            }
        })
    }
}

// 新增
const receivePrintAdd = (res) => ({
    type: RECEIVE_PRINT_ADD,
    payload: res
});
const fetchPrintAdd = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/meterprintinfocs/insertMeterPrintInfo', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之打印参数新增', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '打印参数配置新增数据成功'
                });
                dispatch(receivePrintAdd(newRes))
                dispatch(fetchPrintList(pageInfo))
            } else {
                hide()
                dispatch(receivePrintAdd({}))
                errHandler(res.msg)
            }
        })
    }
}

// 准备修改
const TO_EDIT_PRINT_LIST = 'TO_EDIT_PRINT_LIST'
const requestToEditPrintList = () => ({
    type: TO_EDIT_PRINT_LIST
});
const toEditPrintList = () => {
    return dispatch => {
        dispatch(requestToEditPrintList());
    }
}

// 修改
const receivePrintEdit = (res) => ({
    type: RECEIVE_PRINT_EDIT,
    payload: res
});
const fetchPrintEdit = (data) => {
    return dispatch => {
        dispatch(requestPrintList())
        xhr('post', paths.leasePath + '/meterprintinfocs/updateMeterPrintInfo ', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('返回值：水电配置之打印参数配置', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '修改成功',
                    description: '打印参数配置修改数据成功'
                });
                dispatch(receivePrintEdit(newRes))
            } else {
                hide()
                dispatch(receivePrintEdit({}))
                errHandler(res.msg)
            }
        })
    }
}

// 取消修改
const CANCELL_EDIT_PRINT_LIST = 'CANCELL_EDIT_PRINT_LIST'
const requestCancelEditPrintList = () => ({
    type: CANCELL_EDIT_PRINT_LIST
});
const cancelEditPrintList = () => {
    return dispatch => {
        dispatch(requestCancelEditPrintList());
    }
}


// 删除
const receivePrintDelete = (res) => ({
    type: RECEIVE_PRINT_DELETE,
    payload: res
})
const fetchPrintDelete = (data) => {
    return dispatch => {
        dispatch(requestPrintList())
        xhr('post', paths.leasePath + '/meterprintinfocs/updateMeterPrintInfoDelete', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之打印配置删除', newRes);
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '删除成功',
                    description: `打印参数配置删除数据成功`
                });
                dispatch(receivePrintDelete(newRes))
            } else {
                hide()
                dispatch(receivePrintDelete({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchPrintList,
    fetchPrintAdd,
    toEditPrintList,
    fetchPrintEdit,
    cancelEditPrintList,
    fetchPrintDelete
}

export const ACTION_HANDLERS = {
    [REQUEST_PRINT_LIST]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_PRINT_LIST]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_PRINT_ADD]: (list, { payload: res }) => {
        if (res.sub) {
            list.tableData.unshift(res.sub)
        }
        return {
            ...list,
            tableLoading: false,
            tableData: list.tableData
        }
    },
    [TO_EDIT_PRINT_LIST]: (list) => {
        list.modalForm[0].disabled = true;
        return {
            ...list,
            modalForm: list.modalForm
        }
    },
    [RECEIVE_PRINT_EDIT]: (list, { payload: res }) => {
        if(res && res.sub){
            list.tableData.map(item => {
                if (item.meterprintinfoid === res.sub.meterprintinfoid) {
                    item.waterreadingdate = res.sub.waterreadingdate,
                    item.electricreadingdate = res.sub.electricreadingdate,
                    item.paymentmemo  = res.sub.paymentmemo
                }
            });
        }
        
        return {
            ...list,
            tableLoading: false,
            tableData: list.tableData
        }
    },
    [CANCELL_EDIT_PRINT_LIST]: (list) => {
        list.modalForm[0].disabled = false;
        return {
            ...list,
            modalForm: list.modalForm
        }
    },
    [RECEIVE_PRINT_DELETE]: (list, { payload: res }) => {
        if(res && res.sub){
            list.tableData = list.tableData.filter(item =>
                item.meterprintinfoid !== res.sub.meterprintinfoid
            );
        }
        return {
            ...list,
            tableLoading: false,
            tableData: list.tableData
        }
    }
}

