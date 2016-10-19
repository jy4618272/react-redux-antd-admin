import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, financePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_TABLE = 'REQUEST_CONTRACT_TABLE'
const RECEIVE_CONTRACT_TABLE = 'RECEIVE_CONTRACT_TABLE'


// ================================
// Action Creator
// ================================
const requestContractTable = () => ({
    type: REQUEST_CONTRACT_TABLE
})

const receiveContractTable = (res) => ({
    type: RECEIVE_CONTRACT_TABLE,
    payload: res
})

const fetchContractTable = (data) => {
    return dispatch =>
        dispatch(requestContractTable())
}



/* default 导出所有 Actions Creator */
export default {
    fetchContractTable
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_TABLE]: (contract) => ({
        ...contract,
        tableLoading: true
    })
}