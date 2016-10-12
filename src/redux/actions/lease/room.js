import {notification} from 'antd'
import xhr from 'SERVICE'
import {errHandler} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_AREA = 'RECEIVE_AREA'
const REQUEST_ROOM_TABLE = 'REQUEST_ROOM_TABLE'
const RECEIVE_ROOM_TABLE = 'RECEIVE_ROOM_TABLE'

// ================================
// Action Creator
// ================================
// 请求区域
const receiveArea = (res) => ({
    type: RECEIVE_AREA,
    payload: res
})

const fetchArea = () => {
    return dispatch =>
        xhr('post', '/tfPassParkAdmin/rentroomcs/seleAreaBySite', {}, function (res) {
            console.log('房间设置之区域', res)
        })
}

// 请求页面数据
const requestRoomTable = () => ({
    type: REQUEST_ROOM_TABLE
})

const receiveRoomTable = (res) => ({
    type: RECEIVE_ROOM_TABLE,
    payload: res
})
const fetchRoomTable = (data) => {
    return dispatch => {
        dispatch(requestRoomTable())
        xhr('post', '/tfPassParkAdmin/rentroomcs/selectByStatus', data, function (res) {
            // const newRes = Object.assign({}, res, {
            //     sub: data
            // })

            console.log('房间设置之列表', res)
            if (res.result === 'success') {
                dispatch(receiveRoomTable(res))
            } else {
                dispatch(receiveRoomTable({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchArea,
    fetchRoomTable
}

export const ACTION_HANDLERS = {
    [RECEIVE_AREA]: (payload) => ({
        payload
    }),
    [REQUEST_ROOM_TABLE]: (lease) => ({
        ...lease,
        tableLoading: true
    }),
    [RECEIVE_ROOM_TABLE]: (lease) => ({
            ...lease,
        tableLoading: false
    })
}

