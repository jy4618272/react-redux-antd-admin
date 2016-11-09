import { message } from 'antd'
import xhr from 'SERVICE'
import {errHandler, paths} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CLASSLINE_TABLE = 'REQUEST_CLASSLINE_TABLE'
const RECEIVE_CLASSLINE_TABLE = 'RECEIVE_CLASSLINE_TABLE'
const STATUS_CLASS_LINE = 'STATUS_CLASS_LINE'

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
        xhr('post', paths.leasePath + '/transportlinecs/selectByIndex', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('班线管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveClassLineTable(newRes))
            } else {
                dispatch(receiveClassLineTable({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}


// 开启/关闭
const statusClassLine = (res) => ({
    type: STATUS_CLASS_LINE,
    payload: res
})
const changeStatusClassLine = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/transportlinecs/updateTransportLineStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('班线之开启', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(statusClassLine(newRes))
            } else {
                hide()
                dispatch(statusClassLine({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchClassLineTable,
    changeStatusClassLine
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
    }),
    [STATUS_CLASS_LINE]: (classLineData, {payload: res}) => {
        const obj = classLineData.tableData
        obj.map(item => {
            if (item.transportlineid === res.sub.transportlineid) {
                item.status = res.sub.status
            }
        })
        return Object.assign({}, classLineData, { tableData: obj })
    }
}

