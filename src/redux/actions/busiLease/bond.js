import { 
    message,
    notification 
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const REQUEST_BOND_TABLE = 'REQUEST_BOND_TABLE'
const RECEIVE_BOND_TABLE = 'RECEIVE_BOND_TABLE'
const REQUEST_BOND_INSERT = 'REQUEST_BOND_INSERT'
const RECEIVE_BOND_INSERT = 'RECEIVE_BOND_INSERT'


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
        xhr('post', paths.leasePath + '/margincs/selectByIndex', data,  (res) => {
            const hide = message.loading('正在查询...', 0)
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
            hide()
        })
    }
}

// 保证金新增
const requestBondInsert = () => ({
    type: REQUEST_BOND_INSERT
})

const receiveBondInsert = (res) => ({
    type: RECEIVE_BOND_INSERT,
    payload: res
})

const bondInsert = (data) => {
    return dispatch => {
        dispatch(requestBondInsert())
        xhr('post', paths.leasePath + '/margincs/selectByIndex', data,  (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('租赁管理-保证金新增：', res)
            if (res.result === 'success') {
                dispatch(receiveBondInsert(res))
            } else {
                dispatch(receiveBondInsert({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchBondTable,
    bondInsert
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
    [REQUEST_BOND_INSERT]: (bond) => ({
        ...bond,
        tableLoading: true
    }),
    [RECEIVE_BOND_INSERT]: (bond, {payload: res}) => ({
        ...bond,
        tableLoading: false,
        tableData: res
    }),
}