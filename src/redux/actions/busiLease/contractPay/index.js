import {
    message,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_CONTRACT_PAY = 'REQUEST_CONTRACT_PAY'
const RECEIVE_CONTRACT_PAY = 'RECEIVE_CONTRACT_PAY'
const COMMIT_FINANCE = 'COMMIT_FINANCE'


// ================================
// Action Creator
// ================================
// 请求页面数据
const requestContractPay = () => ({
    type: REQUEST_CONTRACT_PAY
})

const receiveContractPay = (res) => ({
    type: RECEIVE_CONTRACT_PAY,
    payload: res
})

const fetchContractPay = (data) => {
    return dispatch => {
        dispatch(requestContractPay())
        xhr('post', paths.leasePath + '/rentpactpayplancs/selectByKeyword', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('合同交款', newRes)
            if (res.result === 'success') {
                hide()
                dispatch(receiveContractPay(newRes))
            } else {
                hide()
                dispatch(receiveContractPay({}))
                errHandler(res.msg)
            }
        })
    }
}


// 提交财务
const commitFinance = (res) => ({
    type: COMMIT_FINANCE,
    payload: res
})

const fetchCommitFinance = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/rentpactpayplancs/commitToFinance', data, function (res) {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, data)
            if (res.result === 'success') {
                console.log('提交财务：', newRes)
                hide()
                notification.success({
                    message: '财务提交成功',
                    description: '可以去列表查看状态'
                });
                dispatch(commitFinance(newRes.rentpactpayplanid))
            } else {
                hide()
                dispatch(commitFinance({}))
                errHandler(res.msg)
            }
        })
    }
}


/* default 导出所有 Actions Creator */
export default {
    fetchContractPay,
    fetchCommitFinance
}

export const ACTION_HANDLERS = {
    [REQUEST_CONTRACT_PAY]: (contractPay) => ({
        ...contractPay,
        tableLoading: true
    }),
    [RECEIVE_CONTRACT_PAY]: (contractPay, {payload: res}) => ({
        ...contractPay,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [COMMIT_FINANCE]:(contractPay, {payload: res}) => {
        const obj = contractPay.tableData
        obj.map(item => {
            if (item.rentpactpayplanid === res) {
                item.status = '已提交'
            }
        })
        return {
            ...contractPay,
            tableData: obj
        }
    }
}

