import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_ROOM_STATE = 'REQUEST_ROOM_STATE'
const RECEIVE_ROOM_STATE = 'RECEIVE_ROOM_STATE'


// ================================
// Action Creator
// ================================
const requestRoomState = () => ({
    type: REQUEST_ROOM_STATE
})

const receiveRoomState = (res) => ({
    type: RECEIVE_ROOM_STATE,
    payload: res
})

const fetchRoomState = (data) => {
    return dispatch => {
        dispatch(requestRoomState())
        xhr('post', leasePath + '/rentroomcs/selectByAreaAndStatus', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('房态图获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveRoomState(newRes))
            } else {
                dispatch(receiveRoomState({}))
                errHandler(res.result)
            }
        })
    }
}



/* default 导出所有 Actions Creator */
export default {
    fetchRoomState
}

export const ACTION_HANDLERS = {
    [REQUEST_ROOM_STATE]: (roomState) => ({
        ...roomState,
        loading: true
    }),
    [RECEIVE_ROOM_STATE]: (roomState, {payload: res}) => ({
        ...roomState,
        loading: false,
        roomStateData: res.data,
        total: res.count,
        pageSize: 24,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/24 + 1)
    })
}
