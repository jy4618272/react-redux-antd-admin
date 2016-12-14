import { message, notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_NOTCONTRACT_TABLE = 'REQUEST_NOTCONTRACT_TABLE'
const RECEIVE_NOTCONTRACT_TABLE = 'RECEIVE_NOTCONTRACT_TABLE'
const RECEIVE_NOTCONTRACT_VOID = 'RECEIVE_NOTCONTRACT_VOID'
const SAVE_NOTCONTRACT_TABLE = 'SAVE_NOTCONTRACT_TABLE'
const COMMIT_NOTCONTRACT_FINANCE = 'COMMIT_NOTCONTRACT_FINANCE'
// ================================
// Action Creator
// ================================
// 初始化
const requestNotContractTable = () => ({
    type: REQUEST_NOTCONTRACT_TABLE
})

const receiveNotContractTable = (res) => ({
    type: RECEIVE_NOTCONTRACT_TABLE,
    payload: res
})

const fetchNotContractTable = (data) => {
    return dispatch => {
        dispatch(requestNotContractTable())
        xhr('post', paths.leasePath + '/boothpaymentcs/selectByKeyword', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('租赁管理-临时摊位获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveNotContractTable(newRes))
            } else {
                dispatch(receiveNotContractTable({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 提交财务
const commitFinance = (res) => ({
    type: COMMIT_NOTCONTRACT_FINANCE,
    payload: res
})

const fetchCommitFinanceNotContract = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/boothpaymentcs/submitFinance', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, data)
            if (res.result === 'success') {
                console.log('提交财务：', data)
                hide()
                notification.success({
                    message: '财务提交成功',
                    description: '可以去列表查看状态'
                });
                dispatch(commitFinance(newRes.boothpaymentid))
            } else {
                hide()
                dispatch(commitFinance({}))
                errHandler(res.msg)
            }
        })
    }
}

// 作废
const voidChangeNotContract = (res) => ({
    type: RECEIVE_NOTCONTRACT_VOID,
    payload: res
})

const voidNotContract = (data) => {
    return dispatch => {
        xhr('POST', paths.leasePath + '/boothpaymentcs/updateBoothPaymentStatus', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('临时摊位作废数据：', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '临时摊位作废',
                    description: '临时摊位作废成功'
                })
                dispatch(voidChangeNotContract(newRes))
            } else {
                hide()
                dispatch(voidChangeNotContract({}))
                errHandler(res.msg)
            }
        })
    }
}

// 新增-保存
const saveNotContract = (res) => ({
    type: SAVE_NOTCONTRACT_TABLE,
    payload: res
})
const fetchSaveNotContract = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/boothpaymentcs/insertBoothPayment', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('保存临时摊位数据：', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '临时摊位新增成功'
                });
                dispatch(saveNotContract(newRes))
                history.back()
            } else {
                hide()
                dispatch(saveNotContract({}))
                errHandler(res.msg)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchNotContractTable,
    voidNotContract,
    fetchCommitFinanceNotContract,
    fetchSaveNotContract
}

export const ACTION_HANDLERS = {
    [REQUEST_NOTCONTRACT_TABLE]: (notContract) => ({
        ...notContract,
    tableLoading: true
    }),
[RECEIVE_NOTCONTRACT_TABLE]: (notContract, {payload: res}) => ({
            ...notContract,
    tableLoading: false,
    tableData: res.data,
    total: res.count,
    pageSize: 10,
    skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
}),
    [SAVE_NOTCONTRACT_TABLE]:(notContract, {payload: res}) => ({
        ...notContract
    }),
    [RECEIVE_NOTCONTRACT_VOID]:(notContract, {payload: res}) => {
        const obj = notContract.tableData
        obj.map(item => {
            if (item.boothpaymentid == res.sub.boothpaymentid) {
                item.status = '作废'
            }
        })

        return Object.assign({}, notContract, {
            tableData: obj
        })
    },
    [COMMIT_NOTCONTRACT_FINANCE]:(notContract, {payload: res}) => {
        const obj = notContract.tableData
        obj.map(item => {
            if (item.boothpaymentid === res) {
                item.status = '已提交'
            }
        })
        return {
            ...notContract,
            tableData: obj
        }
    }
}