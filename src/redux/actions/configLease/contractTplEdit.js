import { 
    message, 
    notification 
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_EDIT = 'REQUEST_CONTRACT_EDIT'
const RECEIVE_CONTRACT_EDIT = 'RECEIVE_CONTRACT_EDIT'
const REQUEST_CONTRACT_UPDATE = 'REQUEST_CONTRACT_UPDATE'
const RECEIVE_CONTRACT_UPDATE = 'RECEIVE_CONTRACT_UPDATE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestContractEdit = () => ({
    type: REQUEST_CONTRACT_EDIT
})

const receiveContractEdit = (res) => ({
    type: RECEIVE_CONTRACT_EDIT,
    payload: res
})
const fetchContractEdit = (data) => {
    return dispatch => {
        dispatch(requestContractEdit())
        xhr('post', paths.leasePath + '/pactprintmodelcs/selectPactPrintModelById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('合同模板之编辑', data, res)
            if (res.result === 'success') {
                dispatch(receiveContractEdit(res))
            } else {
                dispatch(receiveContractEdit({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

// 合同模板更新修改
const requestContractUpdate = () => ({
    type: REQUEST_CONTRACT_UPDATE
})
const receiveContractUpdate = (res) => ({
    type: RECEIVE_CONTRACT_UPDATE,
    payload: res
})

const fetchContractUpdate = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/pactprintmodelcs/updatePactPrintModel', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('合同模板之表单更新保存', res)
            if (res.result === 'success') {
                dispatch(receiveContractUpdate(res))
                notification.success({
                    message: '更新成功',
                    description: '合同模板更新数据成功'
                });
                history.back()
            } else {
                dispatch(receiveContractUpdate({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchContractEdit,
    fetchContractUpdate
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_EDIT]: (contractEdit) => ({
        ...contractEdit,
        loading: true
    }),
    [RECEIVE_CONTRACT_EDIT]: (contractEdit, {payload: res}) => ({
        ...contractEdit,
        loading: false,
        data: res.data
    }),
    [REQUEST_CONTRACT_UPDATE]: () => ({}),
    [RECEIVE_CONTRACT_UPDATE]: () => ({})
}

