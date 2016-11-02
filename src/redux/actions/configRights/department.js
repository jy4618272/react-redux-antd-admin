import {message} from 'antd'
import xhr from 'SERVICE'
import {errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_DEPARTMENT_TABLE = 'REQUEST_DEPARTMENT_TABLE'
const RECEIVE_DEPARTMENT_TABLE = 'RECEIVE_DEPARTMENT_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestDepartmentTable = () => ({
    type: REQUEST_DEPARTMENT_TABLE
})

const receiveDepartmentTable = (res) => ({
    type: RECEIVE_DEPARTMENT_TABLE,
    payload: res
})
const fetchDepartmentTable = (data) => {
    return dispatch => {
        dispatch(requestDepartmentTable())
        xhr('post', paths.leasePath + '/', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('部门管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveDepartmentTable(newRes))
            } else {
                dispatch(receiveDepartmentTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchDepartmentTable
}

export const ACTION_HANDLERS = {
    [REQUEST_DEPARTMENT_TABLE]: (departmentData) => ({
        ...departmentData,
        tableLoading: true
    }),
    [RECEIVE_DEPARTMENT_TABLE]: (departmentData, {payload: res}) => ({
        ...departmentData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

