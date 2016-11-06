import { 
    message,
    notification
 } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_BASE_INSERT = 'RECEIVE_BASE_INSERT'
const RECEIVE_BASE_INSERT = 'RECEIVE_BASE_INSERT'
const RECEIVE_BASE_SAVE = 'RECEIVE_BASE_SAVE'

// ================================
// Action Creator
// ================================
// 基地配置新增
const receiveBaseInsert = (res) => ({
    type: RECEIVE_BASE_INSERT,
    payload: res
})

const fetchBaseInsert = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/sitepactconfigcs/selectBySite', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            console.log('基地配置返回数据', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveBaseInsert(res.data))
            } else {
                hide()
                dispatch(receiveBaseInsert({}))
                errHandler(res.result)
            }
        })
    }
}

// 基地配置保存
const receiveBaseSave = (res) => ({
    type: RECEIVE_BASE_SAVE,
    payload: res
})

const saveBaseInsert = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/sitepactconfigcs/updateSitePactConfig', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('基地配置提交数据', data)            
            console.log('基地配置保存数据', res)
            if (res.result === 'success') {
                hide()
                dispatch(receiveBaseSave(newRes.sub))
                notification.success({
                    message: '保存成功',
                    description: '基地配置保存成功'
                })
            } else {
                hide()
                dispatch(receiveBaseSave({}))
                errHandler(res.result)
            }
        })
    }
}



/* default 导出所有 Actions Creator */
export default {
    fetchBaseInsert,
    saveBaseInsert
}

export const ACTION_HANDLERS = {
   [RECEIVE_BASE_INSERT]: (baseData, { payload: res }) => ({
        ...baseData,
        loading: false,
        data: res
    }),
    [RECEIVE_BASE_SAVE]: (baseData, { payload: res }) => ({
        ...baseData,
        loading: false,
        data: res
    })
}
