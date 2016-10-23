import {message} from 'antd'
import xhr from 'SERVICE'
import {errHandler, leasePath} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_TABLE = 'REQUEST_CONTRACT_TABLE'
const RECEIVE_CONTRACT_TABLE = 'RECEIVE_CONTRACT_TABLE'

// ================================
// Action Creator
// ================================
// 请求页面数据
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
        xhr('post', leasePath + '/pactprintmodelcs/selectList', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('合同模板之列表', newRes)
            
            if (res.result === 'success') {
                dispatch(receiveContractTable(newRes))
            } else {
                dispatch(receiveContractTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractTable
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_TABLE]: (contractData) => ({
        ...contractData,
        tableLoading: true
    }),
    [RECEIVE_CONTRACT_TABLE]: (contractData, {payload: res}) => ({
        ...contractData,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    })
}
