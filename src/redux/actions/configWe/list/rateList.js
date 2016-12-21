import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_RATE_LIST = 'REQUEST_RATE_LIST'
const RECEIVE_RATE_LIST = 'RECEIVE_RATE_LIST'
const RECEIVE_RATE_ADD = 'RECEIVE_RATE_ADD'
const RECEIVE_RATE_EDIT = 'RECEIVE_RATE_EDIT'
const RECEIVE_RATE_DELETE = 'RECEIVE_RATE_DELETE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestRateList = () => ({
    type: REQUEST_RATE_LIST
})

const receiveRateList = (res) => ({
    type: RECEIVE_RATE_LIST,
    payload: res
})

let pageInfo

// 列表
const fetchRateList = (data) => {
    return dispatch => {
        dispatch(requestRateList())
        xhr('post', paths.leasePath + '/meterchangetypecs/selectListBySite', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            pageInfo = Object.assign({}, data, {
                skipCount: 0
            });
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之单价倍率配置列表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveRateList(newRes))
            } else {
                hide()
                dispatch(receiveRateList({}))
                errHandler(res.msg)
            }
        })
    }
}

// 新增
const receiveRateAdd = (res) => ({
    type: RECEIVE_RATE_ADD,
    payload: res
});
const fetchRateAdd = (data) => {
    return dispatch => {
        dispatch(requestRateList())
        xhr('post', paths.leasePath + '/meterchangetypecs/insertMeterChangeType', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之单价倍率配置新增', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '单价倍率配置新增数据成功'
                });
                dispatch(receiveRateAdd(newRes))
                dispatch(fetchRateList(pageInfo))
            } else {
                hide()
                dispatch(receiveRateAdd({}))
                errHandler(res.msg)
            }
        })
    }
}

// 修改
const receiveRateEdit = (res) => ({
    type: RECEIVE_RATE_EDIT,
    payload: res
});
const fetchRateEdit = (data) => {
    return dispatch => {
        dispatch(requestRateList())
        xhr('post', paths.leasePath + '/meterchangetypecs/updateMeterChangeType', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之单价倍率配置修改', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '修改成功',
                    description: '单价倍率配置修改数据成功'
                });
                dispatch(receiveRateEdit(newRes))
            } else {
                hide()
                dispatch(receiveRateEdit({}))
                errHandler(res.msg)
            }
        })
    }
}

// 删除
const receiveRateDelete = (res) => ({
    type: RECEIVE_RATE_DELETE,
    payload: res
})
const fetchRateDelete = (data) => {
    return dispatch => {
        dispatch(requestRateList())
        xhr('post', paths.leasePath + '/meterchangetypecs/updateMeterChangeTypeDelete', {
            meterchangetypeid: data.meterchangetypeid
        }, function(res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之单价倍率配置删除', newRes);

            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '删除成功',
                    description: `${data.metertype}-${data.meterchangetypeid}删除成功`
                });
                dispatch(receiveRateDelete(newRes))
            } else {
                hide()
                dispatch(receiveRateDelete({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchRateList,
    fetchRateAdd,
    fetchRateEdit,
    fetchRateDelete
}

export const ACTION_HANDLERS = {
    [REQUEST_RATE_LIST]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_RATE_LIST]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [RECEIVE_RATE_ADD]: (list, { payload: res }) => {
        if (res.sub) {
            list.tableData.unshift(res.sub)
        }
        return {
            ...list,
            tableLoading: false,
            tableData: list.tableData
        }
    },
    [RECEIVE_RATE_EDIT]: (list, { payload: res }) => {
        const obj = list.tableData
        obj.map(item => {
            if (item.meterchangetypeid === res.sub.meterchangetypeid) {
                item.metertype  = res.sub.metertype,
                item.chargetype = res.sub.chargetype,
                item.meterprice = res.sub.meterprice,
                item.meterrate  = res.sub.meterrate
            }
        })
        
        return {
            ...list,
            tableLoading: false,
            tableData: obj
        }
    },
    [RECEIVE_RATE_DELETE]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: list.tableData.filter(item =>
            item.meterchangetypeid !== res.sub.meterchangetypeid
        )
    })
}

