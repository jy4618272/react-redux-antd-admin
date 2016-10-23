import { message } from 'antd'
import xhr from 'SERVICE'
import {errHandler, leasePath} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CLASSLINE_TABLE = 'REQUEST_CLASSLINE_TABLE'
const RECEIVE_CLASSLINE_TABLE = 'RECEIVE_CLASSLINE_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestClassLineTable = () => ({
    type: REQUEST_CLASSLINE_TABLE
})

const receiveClassLineTable = (res) => ({
    type: RECEIVE_CLASSLINE_TABLE,
    payload: res
})
const fetchClassLineTable = (data) => {
    return dispatch => {
        dispatch(requestClassLineTable())
        xhr('post', leasePath + '/transportlinecs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('班线管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveClassLineTable(newRes))
            } else {
                dispatch(receiveClassLineTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchClassLineTable
}

export const ACTION_HANDLERS = {
    [REQUEST_CLASSLINE_TABLE]: (classLineData) => ({
        ...classLineData,
        tableLoading: true
    }),
    [RECEIVE_CLASSLINE_TABLE]: (classLineData, {payload: res}) => ({
        ...classLineData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

