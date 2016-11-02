import {message} from 'antd'
import xhr from 'SERVICE'
import {errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_USER_TABLE = 'REQUEST_USER_TABLE'
const RECEIVE_USER_TABLE = 'RECEIVE_USER_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestUserTable = () => ({
    type: REQUEST_USER_TABLE
})

const receiveUserTable = (res) => ({
    type: RECEIVE_USER_TABLE,
    payload: res
})
const fetchUserTable = (data) => {
    return dispatch => {
        dispatch(requestUserTable())
        xhr('post', paths.leasePath + '/', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('用户管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveUserTable(newRes))
            } else {
                dispatch(receiveUserTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchUserTable
}

export const ACTION_HANDLERS = {
    [REQUEST_USER_TABLE]: (userData) => ({
        ...userData,
        tableLoading: true
    }),
    [RECEIVE_USER_TABLE]: (userData, {payload: res}) => ({
        ...userData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

