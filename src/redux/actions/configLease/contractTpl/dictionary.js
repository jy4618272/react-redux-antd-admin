import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_DICTIONARY = 'REQUEST_DICTIONARY'
const RECEIVE_DICTIONARY = 'RECEIVE_DICTIONARY'
const RESET_DICTIONARY = 'RESET_DICTIONARY'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestDictionary = () => ({
    type: REQUEST_DICTIONARY
})

const receiveDictionary = (res) => ({
    type: RECEIVE_DICTIONARY,
    payload: res
})
const fetchDictionary = (data) => {
    return dispatch => {
        dispatch(requestDictionary())
        xhr('post', paths.leasePath + '/pactprintmodelcs/getPrintModelVariables', data, function(res) {
            const hide = message.loading('正在查询...', 0)
            console.log('字典查询之编辑', data, res)
            if (res.result === 'success') {
                hide()

                dispatch(receiveDictionary(res))
            } else {
                hide()

                dispatch(receiveDictionary({}))
                errHandler(res.msg)
            }
        })
    }
}

// 清除
const resetContent = () => ({
    type: RESET_DICTIONARY
})
const resetDictionary = () => {
    return dispatch => {
        dispatch(resetContent())
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchDictionary,
    resetDictionary
}

export const ACTION_HANDLERS = {
    [REQUEST_DICTIONARY]: (dictionary) => ({
        ...dictionary,
        loading: true
    }),
    [RECEIVE_DICTIONARY]: (dictionary, {payload: res}) => ({
        ...dictionary,
        loading: false,
        data: res.data
    }),
    [RESET_DICTIONARY]: (dictionary, {payload: res}) => ({
        ...dictionary,
        loading: false,
        data: []
    }),
}

