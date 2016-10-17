import {notification} from 'antd'
import xhr from 'SERVICE'
import {errHandler, leasePath} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANAGER_TABLE = 'REQUEST_MANAGER_TABLE'
const RECEIVE_MANAGER_TABLE = 'RECEIVE_MANAGER_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManagerTable = () => ({
    type: REQUEST_MANAGER_TABLE
})

// 获取
const receiveManagerTable = (res) => ({
    type: RECEIVE_MANAGER_TABLE,
    payload: res
})
const fetchManagerTable = (data) => {
    return dispatch => {
        dispatch(requestManagerTable())
        xhr('post', leasePath + '/salercs/selectSalerBySite', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveManagerTable(newRes))
            } else {
                dispatch(receiveManagerTable({}))
                errHandler(res.result)
            }
        })
    }
}

// 查询
const searchManagerTable = (data) => {
    return dispatch => {
        dispatch(requestManagerTable())
        xhr('post', leasePath + '/salercs/selectByDetail', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('客户经理之查询', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveManagerTable(newRes))
            } else {
                dispatch(receiveManagerTable({}))
                errHandler(res.result)
            }
        })
    }
}



/* default 导出所有 Actions Creator */
export default {
    fetchManagerTable,
    searchManagerTable
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

