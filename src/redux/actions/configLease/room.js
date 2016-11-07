import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_ROOM_TABLE = 'REQUEST_ROOM_TABLE'
const RECEIVE_ROOM_TABLE = 'RECEIVE_ROOM_TABLE'
const LIE_ROOM = 'LIE_ROOM'
const VOID_ROOM = 'VOID_ROOM'


// ================================
// Action Creator
// ================================
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
        xhr('post', paths.leasePath + '/rentroomcs/selectByStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('房间设置之列表', data, newRes)

            if (res.result === 'success') {
                dispatch(receiveRoomTable(newRes))
            } else {
                dispatch(receiveRoomTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

// 查询接口
const searchRoomTable = (data) => {
    return dispatch => {
        dispatch(requestRoomTable())
        xhr('post', paths.leasePath + '/rentroomcs/selectByAreaAndBuild', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('房间设置之查询', data, newRes)

            if (res.result === 'success') {
                dispatch(receiveRoomTable(newRes))
            } else {
                dispatch(receiveRoomTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

// 查询按钮搜索
const searchButtonRoomTable = (data) => {
    return dispatch => {
        dispatch(requestRoomTable())
        xhr('post', paths.leasePath + '/rentroomcs/selectByStatus', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('房间设置之按钮查询', data, newRes)

            if (res.result === 'success') {
                dispatch(receiveRoomTable(newRes))
            } else {
                dispatch(receiveRoomTable({}))
                errHandler(res.result)
            }
        })
    }
}

// 闲置
const receiveLieRoom = (res) => ({
    type: LIE_ROOM,
    payload: res
})
const lieRoom = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentroomcs/updateRentRoomStatus', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('房间设置之闲置', newRes)         
            if (res.result === 'success') {
                dispatch(receiveLieRoom(newRes))
            } else {
                dispatch(receiveLieRoom({}))
                errHandler(res.result)
            }
        })
    }
}

// 作废
const receiveVoidRoom = (res) => ({
    type: VOID_ROOM,
    payload: res
})
const voidRoom = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentroomcs/updateRentRoomStatus', data, function (res) {
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('房间设置之作废', newRes)         
            if (res.result === 'success') {
                dispatch(receiveVoidRoom(newRes))
            } else {
                dispatch(receiveVoidRoom({}))
                errHandler(res.result)
            }
        })
    }
}



/* default 导出所有 Actions Creator */
export default {
    fetchRoomTable,
    searchRoomTable,
    searchButtonRoomTable,
    lieRoom,
    voidRoom
}

export const ACTION_HANDLERS = {
    [REQUEST_ROOM_TABLE]: (roomData) => ({
        ...roomData,
        tableLoading: true
    }),
    [RECEIVE_ROOM_TABLE]: (roomData, {payload: res}) => ({
            ...roomData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [LIE_ROOM]:(roomData, {payload: res}) => {
        const obj = roomData.tableData
        obj.map(item => {
            if(item.rentroomid === res.sub.rentroomid){
                item.status = '未出租'
            }
        })
        return Object.assign({}, roomData, {tableData: obj})
    },
    [VOID_ROOM]:(roomData, {payload: res}) => {
        const obj = roomData.tableData
        obj.map(item => {
            if(item.rentroomid === res.sub.rentroomid){
                item.status = '作废'
            }
        })
        return Object.assign({}, roomData, {tableData: obj})
    }
}