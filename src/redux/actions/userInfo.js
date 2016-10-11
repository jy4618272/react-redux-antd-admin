import xhr from 'SERVICE'

// import xhr from 'SERVICE/xhr'
// ================================
// Action Type
// ================================
const REQUEST_USER = 'REQUEST_USER'
const RECEIVE_USER = 'RECEIVE_USER'

// ================================
// Action Creator
// ================================
const requestUser = () => ({
    type: REQUEST_USER
})

const receiveUser = (res) => ({
    type: RECEIVE_USER,
    payload: res
})

const fetchUser = () => {
    return dispatch => {
        xhr('post', '/financeParkAdmin/maincs/getUserInfo', {}, function (res) {
            dispatch(receiveUser(res))
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchUser
}


// ================================
// Action handlers for Reducer
// 本来更新 state 是 Reducer 的责任
// 但要把 ActionType 导出又引入实在太麻烦
// 且在 Reducer 中写 switch-case 实在太不优雅
// 故在此直接给出处理逻辑
// ================================
export const ACTION_HANDLERS = {
    [REQUEST_USER]: () => null,
    [RECEIVE_USER]: (userInfo, {payload: res}) => (
        userInfo = res.data
    )
}   
