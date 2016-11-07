import { message, notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_MANAGER_EDIT = 'REQUEST_MANAGER_EDIT'
const RECEIVE_MANAGER_EDIT = 'RECEIVE_MANAGER_EDIT'
const RECEIVE_MANAGER_UPDATE = 'RECEIVE_MANAGER_UPDATE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestManagerEdit = () => ({
    type: REQUEST_MANAGER_EDIT
})

const receiveManagerEdit = (res) => ({
    type: RECEIVE_MANAGER_EDIT,
    payload: res
})
const fetchManagerEdit = (data) => {
    return dispatch => {
        dispatch(requestManagerEdit())
        xhr('post', paths.leasePath + '/salercs/selectSalerById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('客户经理之编辑', data, res)
            if (res.result === 'success') {
                dispatch(receiveManagerEdit(res))
            } else {
                dispatch(receiveManagerEdit({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

// 客户经理更新修改
const receiveMangerUpdate = (res) => ({
    type: RECEIVE_MANAGER_UPDATE,
    payload: res
})

const fetchManagerUpdate = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/salercs/updateSaler', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('客户经理之表单更新保存', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveMangerUpdate(res))
                notification.success({
                    message: '更新成功',
                    description: '客户经理更新数据成功'
                });
                history.back()
            } else {
                hide()

                dispatch(receiveMangerUpdate({}))
                errHandler(res.result)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchManagerEdit,
    fetchManagerUpdate
}

export const ACTION_HANDLERS = {
    [REQUEST_MANAGER_EDIT]: (managerEdit) => ({
        ...managerEdit,
        loading: true
    }),
    [RECEIVE_MANAGER_EDIT]: (managerEdit, {payload: res}) => ({
        ...managerEdit,
        loading: false,
        data: res.data
    }),
    [RECEIVE_MANAGER_UPDATE]: (managerData) => ({...managerData})
}

