import {notification} from 'antd'
import xhr from 'SERVICE'
import {errHandler, leasePath} from 'SERVICE/config'

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
        xhr('post', leasePath + '/rentroomcs/seleAreaBySite', {}, function (res) {
            console.log('房间设置之区域', res)
            const options = []
            res.data.map(item => {
                options.push({ key: item.area, value: item.area })
            })
            sessionStorage.setItem('areaBySite', JSON.stringify(options))
            dispatch(receiveArea(options))
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
        xhr('post', leasePath + '/rentroomcs/selectByStatus', data, function (res) {
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
        })
    }
}

// 查询接口
const searchRoomTable = (data) => {
    return dispatch => {
        dispatch(requestRoomTable())
        xhr('post', leasePath + '/rentroomcs/selectByAreaAndBuild', data, function (res) {
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
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchArea,
    fetchRoomTable,
    searchRoomTable
}

export const ACTION_HANDLERS = {
    [RECEIVE_AREA]: (roomData, {payload: res}) => ({
        ...roomData,
        room:[
            {
                key: 'area',  // 传递给后端的字段名
                title: '区域',  // 前端显示的名称
                dataType: 'varchar',
                showType: 'select',
                options: res
            },
            {
                key: 'key',
                title: '关键字',
                dataType: 'varchar',
                placeholder: '请输入楼号/房间号'
            }    
        ]
    }),
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

