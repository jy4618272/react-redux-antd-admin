import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_TABLE = 'REQUEST_CONTRACT_TABLE'
const RECEIVE_CONTRACT_TABLE = 'RECEIVE_CONTRACT_TABLE'
const STATUS_CONTRACT = 'STATUS_CONTRACT'

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
        xhr('post', paths.leasePath + '/pactprintmodelcs/selectList', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('合同模板之列表', newRes)

            if (res.result === 'success') {
                dispatch(receiveContractTable(newRes))
            } else {
                dispatch(receiveContractTable({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 开启/关闭
const statusContract = (res) => ({
    type: STATUS_CONTRACT,
    payload: res
})
const changeStatusContract = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/pactprintmodelcs/updatePactPrintModelStatus', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('合同模板之开启', newRes)

            if (res.result === 'success') {
                dispatch(statusContract(newRes))
            } else {
                dispatch(statusContract({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractTable,
    changeStatusContract
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [STATUS_CONTRACT]: (contractData, {payload: res}) => {
        const obj = contractData.tableData
        obj.map(item => {
            if(item.pactprintmodelid === res.sub.pactprintmodelid){
                item.status = res.sub.status
            }
        })
        return Object.assign({}, contractData, {tableData: obj})
    }
}
