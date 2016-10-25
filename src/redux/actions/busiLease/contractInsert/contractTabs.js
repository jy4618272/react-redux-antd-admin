import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_MANAGER = 'RECEIVE_MANAGER'  // 获取合同模板


// ================================
// Action Creator
// ================================
const receiveManager = (res) => ({
    type: RECEIVE_MANAGER,
    payload: res
})

const fetchManager = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/salercs/selectSalerBySite', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = []
            res.data.map(item => {
                newRes.push({
                    key: item.username,
                    value: item.username
                })
            })
            console.log('获取【客户经理】数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveManager(newRes))
            } else {
                dispatch(receiveManager({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchManager
}

export const ACTION_HANDLERS = {
    [RECEIVE_MANAGER]: (tabs, {payload: res}) => tabs.map(item =>
        item.key === 'saler' ? Object.assign({}, item, { options: res }) :
            item
    )
}