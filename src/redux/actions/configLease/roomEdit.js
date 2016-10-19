import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_BUILD_LIST = 'RECEIVE_BUILD_LIST'
const REQUEST_ROOM_EDIT = 'REQUEST_ROOM_EDIT'
const RECEIVE_ROOM_EDIT = 'RECEIVE_ROOM_EDIT'
const REQUEST_ROOM_UPDATE = 'REQUEST_ROOM_UPDATE'
const RECEIVE_ROOM_UPDATE = 'RECEIVE_ROOM_UPDATE'

// ================================
// Action Creator
// ================================

// 房间设置修改
// 获取楼号新增
const receiveBuildList = (res) => ({
    type: RECEIVE_BUILD_LIST,
    payload: res
})
const fetchBuildList = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentroomcs/seleBuildBySiteAndArea', data, function (res) {
            console.log('房间设置之获取楼号：', data, res)
            const options = []
            res.data.map(item => {
                options.push({ key: item.build, value: item.build })
            })
            if (res.result === 'success') {
                dispatch(receiveBuildList(options))
            } else {
                dispatch(receiveBuildList({}))
                errHandler(res.result)
            }
        })
    }
}

// 请求页面数据
const requestRoomEdit = () => ({
    type: REQUEST_ROOM_EDIT
})

const receiveRoomEdit = (res) => ({
    type: RECEIVE_ROOM_EDIT,
    payload: res
})
const fetchRoomEdit = (data) => {
    return dispatch => {
        dispatch(requestRoomEdit())
        xhr('post', leasePath + '/rentroomcs/selectRentRoomById', data, function (res) {
            console.log('房间设置之编辑', data, res)
            if (res.result === 'success') {
                dispatch(receiveRoomEdit(res))
            } else {
                dispatch(receiveRoomEdit({}))
                errHandler(res.result)
            }
        })
    }
}

// 房间设置更新修改
const requestRoomUpdate = () => ({
    type: REQUEST_ROOM_UPDATE
})
const receiveRoomUpdate = (res) => ({
    type: RECEIVE_ROOM_UPDATE,
    payload: res
})

const fetchRoomUpdate = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentroomcs/updateRentRoomStatus', data, function (res) {
            console.log('房间设置之表单更新保存', res)
            if (res.result === 'success') {
                dispatch(receiveRoomUpdate(res))
                notification.success({
                    message: '更新成功',
                    description: '房间设置更新数据成功'
                });
                history.back()
            } else {
                dispatch(receiveRoomUpdate({}))
                errHandler(res.result)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchRoomEdit,
    fetchRoomUpdate
}

export const ACTION_HANDLERS = {
    [RECEIVE_BUILD_LIST]: (roomEdit, {payload: res}) => {
        roomEdit.room.map((item, index) => {
            if (index == 1) {
                item.options = res
            }
        })
        return roomEdit
    },
    [REQUEST_ROOM_EDIT]: (roomEdit) => ({
        ...roomEdit,
        loading: true
    }),
    [RECEIVE_ROOM_EDIT]: (roomEdit, {payload: res}) => ({
        ...roomEdit,
        loading: false,
        data: res.data
    }),
    [REQUEST_ROOM_UPDATE]: (roomEdit) => ({...roomEdit}),
    [RECEIVE_ROOM_UPDATE]: (roomEdit) => ({...roomEdit})
}
