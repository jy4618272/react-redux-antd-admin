import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_NOTCONTRACT_TABLE = 'REQUEST_NOTCONTRACT_TABLE'
const RECEIVE_NOTCONTRACT_TABLE = 'RECEIVE_NOTCONTRACT_TABLE'


// ================================
// Action Creator
// ================================
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
        xhr('post', paths.leasePath + '/boothpaymentcs/selectByKeyword', data,  (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('租赁管理-临时摊位获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveNotContractTable(newRes))
            } else {
                dispatch(receiveNotContractTable({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchNotContractTable
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    }),
}