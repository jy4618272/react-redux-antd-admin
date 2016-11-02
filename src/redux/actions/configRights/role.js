import {message} from 'antd'
import xhr from 'SERVICE'
import {errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_ROLE_TABLE = 'REQUEST_ROLE_TABLE'
const RECEIVE_ROLE_TABLE = 'RECEIVE_ROLE_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestRoleTable = () => ({
    type: REQUEST_ROLE_TABLE
})

const receiveRoleTable = (res) => ({
    type: RECEIVE_ROLE_TABLE,
    payload: res
})
const fetchRoleTable = (data) => {
    return dispatch => {
        dispatch(requestRoleTable())
        xhr('post', paths.leasePath + '/', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('角色管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveRoleTable(newRes))
            } else {
                dispatch(receiveRoleTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchRoleTable
}

export const ACTION_HANDLERS = {
    [REQUEST_ROLE_TABLE]: (roleData) => ({
        ...roleData,
        tableLoading: true
    }),
    [RECEIVE_ROLE_TABLE]: (roleData, {payload: res}) => ({
        ...roleData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

