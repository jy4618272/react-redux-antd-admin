import {message} from 'antd'
import xhr from 'SERVICE'
import {errHandler, leasePath} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_POST_TABLE = 'REQUEST_POST_TABLE'
const RECEIVE_POST_TABLE = 'RECEIVE_POST_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
const requestPostTable = () => ({
    type: REQUEST_POST_TABLE
})

const receivePostTable = (res) => ({
    type: RECEIVE_POST_TABLE,
    payload: res
})
const fetchPostTable = (data) => {
    return dispatch => {
        dispatch(requestPostTable())
        xhr('post', leasePath + '/', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('岗位管理之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receivePostTable(newRes))
            } else {
                dispatch(receivePostTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchPostTable
}

export const ACTION_HANDLERS = {
    [REQUEST_POST_TABLE]: (postData) => ({
        ...postData,
        tableLoading: true
    }),
    [RECEIVE_POST_TABLE]: (postData, {payload: res}) => ({
        ...postData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}

