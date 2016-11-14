import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_TABLE = 'REQUEST_CONTRACT_TABLE'
const RECEIVE_CONTRACT_TABLE = 'RECEIVE_CONTRACT_TABLE'
const RECEIVE_CONTRACT_VOID = 'RECEIVE_CONTRACT_VOID'
const RECEIVE_CONTRACT_APPROVAL = 'RECEIVE_CONTRACT_APPROVAL'


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
        xhr('POST', paths.leasePath + '/rentpactcs/selectByKeyword', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('租赁管理-合同获取数据：', newRes)
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


// 提交审核
const statusApprovalContract = (res) => ({
    type: RECEIVE_CONTRACT_APPROVAL,
    payload: res
})

const approvalContract = (data) => {
    return dispatch => {
        xhr('POST', paths.leasePath + '/rentpactcs/submitRentPact', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('合同提交审核数据：', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '合同提交审核',
                    description: '合同提交审核成功'
                })
                dispatch(statusApprovalContract(newRes))
            } else {
                hide()
                dispatch(statusApprovalContract({}))
                errHandler(res.msg)
            }
        })
    }
}

// 作废
const statusContract = (res) => ({
    type: RECEIVE_CONTRACT_VOID,
    payload: res
})

const voidContract = (data) => {
    return dispatch => {
        xhr('POST', paths.leasePath + '/rentpactfullinfocs/cancelRentPact', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('合同作废数据：', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '合同作废',
                    description: '合同作废成功'
                })
                dispatch(statusContract(newRes))
            } else {
                hide()
                dispatch(statusContract({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractTable,
    approvalContract,
    voidContract
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_CONTRACT_VOID]: (contract, {payload: res}) => {
        const obj = contract.tableData
        obj.map(item => {
            if (item.rentpactid == res.sub.rentpactid) {
                item.endtype = '作废'
            }
        })

        return Object.assign({}, contract, {
            tableData: obj
        })
    },
        [RECEIVE_CONTRACT_APPROVAL]: (contract, {payload: res}) => {
            const obj = contract.tableData
            obj.map(item => {
                if (item.rentpactid == res.sub.rentpactid) {
                    item.flowstatus = '审批中'
                }
            })

            return Object.assign({}, contract, {
                tableData: obj
            })
        }
}