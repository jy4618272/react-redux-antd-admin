import {notification} from 'antd'
import xhr from 'SERVICE'
import {errHandler} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_LEASE_TABLE = 'REQUEST_LEASE_TABLE'
const RECEIVE_LEASE_TABLE = 'RECEIVE_LEASE_TABLE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestLeaseTable = () => ({
    type: REQUEST_LEASE_TABLE
})

const receiveLeaseTable = (res) => ({
    type: RECEIVE_LEASE_TABLE,
    payload: res
})
const fetchLeaseTable = (data) => {
    return dispatch => {
        dispatch(requestLeaseTable())
        // xhr('post', '/financeParkAdmin/financecollectioncs/selectFinanceCollectionByTypeAndName', data, function (res) {
        //     const newRes = Object.assign({}, res, {
        //         sub: data
        //     })
            
        //     console.log('表格数据111', newRes)
        //     if (res.result === 'success') {
        //         dispatch(receiveFinanceTable(newRes))
        //     } else {
        //         dispatch(receiveFinanceTable({}))
        //         errHandler(res.result)
        //     }
        // })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchLeaseTable
}

export const ACTION_HANDLERS = {
    [REQUEST_LEASE_TABLE]: (lease) => ({
        ...lease,
        tableLoading: true
    }),
    [RECEIVE_LEASE_TABLE]: (lease) => ({
        ...lease,
        tableLoading: false 
    })
}

