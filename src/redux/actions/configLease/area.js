import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_AREA = 'RECEIVE_AREA'

// 请求区域
const receiveArea = (res) => ({
    type: RECEIVE_AREA,
    payload: res
})

const fetchArea = (data) => {
    return dispatch =>
        xhr('post', paths.leasePath + '/rentroomcs/seleAreaBySite', data, function (res) {
            console.log('房间设置之区域', res)

            if (res.result === 'success') {
                const options = []
                res.data.map(item => {
                    options.push({ key: item.area, value: item.area })
                })
                // sessionStorage.setItem('areaBySite', JSON.stringify(options))
                dispatch(receiveArea(options))
            } else {
                dispatch(receiveArea({}))
                errHandler(res.msg)
            }
        })
}

/* default 导出所有 Actions Creator */
export default {
    fetchArea
}

export const ACTION_HANDLERS = {
    [RECEIVE_AREA]: (roomData, {payload: res}) => ({
        ...roomData,
        loading: false,
        data: res
    })
}