import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_FINANCE_SHOW = 'REQUEST_FINANCE_SHOW'
const RECEIVE_FINANCE_SHOW = 'RECEIVE_FINANCE_SHOW'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestFinanceShow = () => ({
    type: REQUEST_FINANCE_SHOW
})

const receiveFinanceShow = (res) => ({
    type: RECEIVE_FINANCE_SHOW,
    payload: res
})

const fetchFinanceShow = (data) => {
    return dispatch => {
        dispatch(requestFinanceShow())
        xhr('post', paths.financePath + '/financecollectioncs/getFinanceCollectionDetail', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('财务业务', data, res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveFinanceShow(res))
            } else {
                hide()
                dispatch(receiveFinanceShow({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchFinanceShow
}

export const ACTION_HANDLERS = {
    [REQUEST_FINANCE_SHOW]: (show) => ({
        ...show,
        loading: true
    }),
    [RECEIVE_FINANCE_SHOW]: (show, {payload: res}) => ({
        ...show,
        loading: false,
        data: res.data
    })
}