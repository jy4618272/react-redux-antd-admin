import {notification} from 'antd'
import xhr from 'SERVICE'
import {errHandler} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_FINANCE_TABLE = 'RECEIVE_FINANCE_TABLE'
const REQUEST_FINANCE_TABLE = 'REQUEST_FINANCE_TABLE'

// ================================
// Action Creator
// ================================

const requestFinanceTable = () => ({
    type: REQUEST_FINANCE_TABLE
})

const receiveFinanceTable = (res) => ({
    type: RECEIVE_FINANCE_TABLE,
    payload: res
})

const fetchFinanceTable = (data) => {
    
    return dispatch => {
        dispatch(requestFinanceTable())
        xhr('post', '/financeParkAdmin/financecollectioncs/selectFinanceCollectionByTypeAndName', data, function (res) {
            console.log('21111111', res)

            if (res.result === 'success') {
                dispatch(receiveFinanceTable(res))
            } else {
                dispatch(receiveFinanceTable({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchFinanceTable
}

export const ACTION_HANDLERS = {
    [REQUEST_FINANCE_TABLE]: (finance) => ({
        ...finance,
        tableLoading:true
    }),
    [RECEIVE_FINANCE_TABLE]: (finance, {payload: res}) => ({
        ...finance,
        tableLoading:false,
        tableData: res.data
    })
}
