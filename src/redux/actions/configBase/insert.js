import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_BASE_INSERT = 'RECEIVE_BASE_INSERT'


// ================================
// Action Creator
// ================================
// 基地配置新增
const receiveBaseInsert= (res) => ({
    type: RECEIVE_ROOM_ADD,
    payload: res
})

const fetchBaseInsert = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/dd', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('基地配置之表单保存', res)
            if (res.result === 'success') {
                dispatch(receiveBaseInsert(res))
            } else {
                dispatch(receiveBaseInsert({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchBaseInsert
}

export const ACTION_HANDLERS = {
    [RECEIVE_BASE_INSERT]: ({ payload: res }) => []
}
