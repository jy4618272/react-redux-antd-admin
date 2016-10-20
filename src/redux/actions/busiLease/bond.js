import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_BOND_TABLE = 'REQUEST_BOND_TABLE'
const RECEIVE_BOND_TABLE = 'RECEIVE_BOND_TABLE'


// ================================
// Action Creator
// ================================
const requestBondTable = () => ({
    type: REQUEST_BOND_TABLE
})

const receiveBondTable = (res) => ({
    type: RECEIVE_BOND_TABLE,
    payload: res
})

const fetchBondTable = (data) => {
    return dispatch => {
        dispatch(requestBondTable())
        xhr('post', leasePath + '/margincs/selectByIndex', data,  (res) => {
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('租赁管理-保证金获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveBondTable(newRes))
            } else {
                dispatch(receiveBondTable({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchBondTable
}

export const ACTION_HANDLERS = {
    [REQUEST_BOND_TABLE]: (bond) => ({
        ...bond,
        tableLoading: true
    }),
    [RECEIVE_BOND_TABLE]: (bond, {payload: res}) => ({
        ...bond,
        tableLoading: false,
        tableData: res.data,
        total: res.count,
        pageSize: 10,
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount)/10 + 1)
    }),
}