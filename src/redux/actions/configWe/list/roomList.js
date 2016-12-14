import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_ROOM_LIST = 'REQUEST_ROOM_LIST'
const RECEIVE_ROOM_LIST = 'RECEIVE_ROOM_LIST'
const EDIT_CELL_VALUE = 'EDIT_CELL_VALUE'
const SAVE_CELL_VALUE = 'SAVE_CELL_VALUE'
// ================================
// Action Creator
// ================================
// 请求页面数据
const requestRoomList = () => ({
    type: REQUEST_ROOM_LIST
})

const receiveRoomList = (res) => ({
    type: RECEIVE_ROOM_LIST,
    payload: res
})

// 列表
const fetchRoomList = (data) => {
    return dispatch => {
        dispatch(requestRoomList())
        xhr('post', paths.leasePath + '/rentroomcs/selectRommListForMeter', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之房间客户配置列表', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveRoomList(newRes))
            } else {
                hide()
                dispatch(receiveRoomList({}))
                errHandler(res.msg)
            }
        })
    }
}


// 编辑手机号码
const editCell = (res) => ({
    type: 'EDIT_CELL_VALUE',
    payload: res
})

const editCellValue = (data) => {
    return dispatch => {
        dispatch(editCell(data))
    }
}

// 保存手机号码
const saveCell = (res) => ({
    type: 'SAVE_CELL_VALUE',
    payload: res
})

const saveCellValue = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentroomcs/updateTelById', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('水电配置之保存手机号', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(saveCell(newRes))
                notification.success({
                    message: '手机号更改成功',
                    description: `更改后的手机号是【${data.tel}】`
                })
            } else {
                hide()
                dispatch(saveCell({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchRoomList,
    editCellValue,
    saveCellValue
}

export const ACTION_HANDLERS = {
    [REQUEST_ROOM_LIST]: (list) => ({
        ...list,
        tableLoading: true,
        tableData: list.tableData
    }),
    [RECEIVE_ROOM_LIST]: (list, { payload: res }) => ({
        ...list,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: res.sub.pageSize,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / (res.sub.pageSize) + 1)
    }),
    [EDIT_CELL_VALUE]: (list, {payload: res}) => ({
        ...list,
        tableData: res
    }),
    [SAVE_CELL_VALUE]: (list, { payload: res }) => {
        list.tableData.map(item => {
            if(item.rentroomid === res.sub.rentroomid){
                item.tel = res.sub.tel
            }
        })
        return{
            ...list,
            tableData: list.tableData
        }
    }
}

