import { message, notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANAGER_TABLE = 'REQUEST_MANAGER_TABLE'
const RECEIVE_MANAGER_TABLE = 'RECEIVE_MANAGER_TABLE'
const STATUS_MANAGER = 'STATUS_MANAGER'
const RECEIVE_BUSI_MANAGER_TABLE = 'RECEIVE_BUSI_MANAGER_TABLE'
const RECEIVE_FILTER_MANAGER_TABLE = 'RECEIVE_FILTER_MANAGER_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManagerTable = () => ({
    type: REQUEST_MANAGER_TABLE
})

// 列表获取
const receiveManagerTable = (res) => ({
    type: RECEIVE_MANAGER_TABLE,
    payload: res
})
const fetchManagerTable = (data) => {
    return dispatch => {
        dispatch(requestManagerTable())
        xhr('post', paths.leasePath + '/salercs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之列表', newRes)

            if (res.result === 'success') {
                hide()

                dispatch(receiveManagerTable(newRes))
            } else {
                hide()

                dispatch(receiveManagerTable({}))
                errHandler(res.msg)
            }
        })
    }
}

// 查询-获取
const receiveBusiManagerTable = (res) => ({
    type: RECEIVE_BUSI_MANAGER_TABLE,
    payload: res
})
const fetchBusiManagerTable = (data) => {
    return dispatch => {
        dispatch(requestManagerTable())
        xhr('post', paths.leasePath + '/salercs/selectByDetail', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之列表', newRes)

            if (res.result === 'success') {
                hide()

                dispatch(receiveBusiManagerTable(newRes))
            } else {
                hide()

                dispatch(receiveBusiManagerTable({}))
                errHandler(res.msg)
            }
        })
    }
}

// 过滤获取
const receiveFilterManagerTable = (res) => ({
    type: RECEIVE_FILTER_MANAGER_TABLE,
    payload: res
})
const fetchFilterManagerTable = (data) => {
    return dispatch => {
        dispatch(requestManagerTable())
        xhr('post', paths.leasePath + '/salercs/selectSalerBySite', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之列表', newRes)

            if (res.result === 'success') {
                hide()

                dispatch(receiveFilterManagerTable(newRes))
            } else {
                hide()

                dispatch(receiveFilterManagerTable({}))
                errHandler(res.msg)
            }
        })
    }
}



// 开启/关闭
const statusManager = (res) => ({
    type: STATUS_MANAGER,
    payload: res
})
const changeStatusManager = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/salercs/updateSalerStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之开启', newRes)

            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '状态' + data.status,
                    description: '状态' + data.status + '成功'
                })
                dispatch(statusManager(newRes))
            } else {
                hide()
                dispatch(statusManager({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchManagerTable,
    fetchBusiManagerTable,
    receiveFilterManagerTable,
    changeStatusManager
}

export const ACTION_HANDLERS = {
    [REQUEST_MANAGER_TABLE]: (accountManagerData) => ({
        ...accountManagerData,
        tableLoading: true
    }),
    [RECEIVE_MANAGER_TABLE]: (accountManagerData, {payload: res}) => ({
        ...accountManagerData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_BUSI_MANAGER_TABLE]: (accountManagerData, {payload: res}) => ({
        ...accountManagerData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_FILTER_MANAGER_TABLE]: (accountManagerData, {payload: res}) => ({
        ...accountManagerData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [STATUS_MANAGER]: (accountManagerData, {payload: res}) => {
        const obj = accountManagerData.tableData
        obj.map(item => {
            if (item.salerid === res.sub.salerid) {
                item.status = res.sub.status
            }
        })
        return Object.assign({}, accountManagerData, { tableData: obj })
    }
}

