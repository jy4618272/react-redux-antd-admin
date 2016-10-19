import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_LINE_EDIT = 'REQUEST_LINE_EDIT'
const RECEIVE_LINE_EDIT = 'RECEIVE_LINE_EDIT'
const REQUEST_LINE_UPDATE = 'REQUEST_LINE_UPDATE'
const RECEIVE_LINE_UPDATE = 'RECEIVE_LINE_UPDATE'




// ================================
// Action Creator
// ================================
// 请求页面数据
const requestLineEdit = () => ({
    type: REQUEST_LINE_EDIT
})

const receiveLineEdit = (res) => ({
    type: RECEIVE_LINE_EDIT,
    payload: res
})
const fetchClassLineEdit = (data) => {
    return dispatch => {
        dispatch(requestLineEdit())
        xhr('post', leasePath + '/transportlinecs/selectTransportLineById', data, function (res) {
            console.log('班线管理之编辑', data, res)
            if (res.result === 'success') {
                dispatch(receiveLineEdit(res))
            } else {
                dispatch(receiveLineEdit({}))
                errHandler(res.result)
            }
        })
    }
}

// 班线管理更新修改
const requestClassLineUpdate = () => ({
    type: REQUEST_LINE_UPDATE
})
const receiveClassLineUpdate = (res) => ({
    type: RECEIVE_LINE_UPDATE,
    payload: res
})

const fetchClassLineUpdate = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/transportlinecs/updateTransportLine', data, function (res) {
            console.log('班线管理之表单更新保存', res)
            if (res.result === 'success') {
                dispatch(receiveClassLineUpdate(res))
                notification.success({
                    message: '更新成功',
                    description: '班线管理更新数据成功'
                });
                history.back()
            } else {
                dispatch(receiveClassLineUpdate({}))
                errHandler(res.result)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchClassLineEdit,
    fetchClassLineUpdate
}

export const ACTION_HANDLERS = {
    [REQUEST_LINE_EDIT]: (lineEdit) => ({
        ...lineEdit,
        loading: true
    }),
    [RECEIVE_LINE_EDIT]: (lineEdit, {payload: res}) => ({
        ...lineEdit,
        loading: false,
        data: res.data
    }),
    [REQUEST_LINE_UPDATE]: () => ({}),
    [RECEIVE_LINE_UPDATE]: () => ({})
}

