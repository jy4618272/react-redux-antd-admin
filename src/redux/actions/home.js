import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// import xhr from 'SERVICE/xhr'
// ================================
// Action Type
// ================================
const REQUEST_HOME = 'REQUEST_HOME'
const RECEIVE_HOME = 'RECEIVE_HOME'

// ================================
// Action Creator
// ================================
const requestHome = () => ({
    type: REQUEST_HOME
})

const receiveHome = (res) => ({
    type: RECEIVE_HOME,
    payload: res
})

const fetchHome = () => {
    return dispatch => {
        xhr('post', paths.workFlowPath + '/flownodecs/queryMyTaskNumber', {}, function (res) {
            const hide = message.loading('正在查询...', 0)
            if (res.result === 'success') {
                hide()
                dispatch(receiveHome(res))
            } else {
                hide()
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchHome
}

// ================================
// Action handlers for Reducer
// 本来更新 state 是 Reducer 的责任
// 但要把 ActionType 导出又引入实在太麻烦
// 且在 Reducer 中写 switch-case 实在太不优雅
// 故在此直接给出处理逻辑
// ================================
export const ACTION_HANDLERS = {
    [RECEIVE_HOME]: (home, {payload: res}) => ({
        loading: false,
        data: res.data
    })
}   
