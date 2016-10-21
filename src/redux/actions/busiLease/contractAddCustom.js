import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

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
    return dispatch => {
        dispatch(requestContractTable())
        xhr('post', leasePath + '/rentpactcs/selectByKeyword', data,  (res) => {
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('租赁管理-合同获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveContractTable(newRes))
            } else {
                dispatch(receiveContractTable({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractTable
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_TABLE]: (contract) => ({
        ...contract,
        tableLoading: true
    }),
    [RECEIVE_CONTRACT_TABLE]: (contract, {payload: res}) => ({
        ...contract,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}