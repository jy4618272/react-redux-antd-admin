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
const RECEIVE_BOND_VOID = 'RECEIVE_BOND_VOID'
const SAVE_BOND_TABLE = 'SAVE_BOND_TABLE'
const COMMIT_FINANCE_BOND = 'COMMIT_FINANCE_BOND'

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
        xhr('post', paths.leasePath + '/margincs/selectByIndex', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })

            console.log('租赁管理-保证金获取数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveBondTable(newRes))
            } else {
                dispatch(receiveBondTable({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

// 作废
const voidChangeBond = (res) => ({
    type: RECEIVE_BOND_VOID,
    payload: res
})

const voidBond = (data) => {
    return dispatch => {
        xhr('POST', paths.leasePath + '/', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('保证金作废数据：', newRes)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '保证金作废',
                    description: '保证金作废成功'
                })
                dispatch(voidChangeBond(newRes))
            } else {
                hide()
                dispatch(voidChangeBond({}))
                errHandler(res.msg)
            }
        })
    }
}

// 提交财务
const commitFinanceBond = (res) => ({
    type: COMMIT_FINANCE_BOND,
    payload: res
})
const fetchCommitFinanceBond = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/margincs/insertFinanceCollection', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('保证金数据：', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '提交财务成功',
                    description: '保证金提交财务成功'
                });
                dispatch(commitFinanceBond(res))
            } else {
                hide()
                dispatch(commitFinanceBond({}))
                errHandler(res.msg)
            }
        })
    }

}

// 新增-保存
const saveBond = (res) => ({
    type: SAVE_BOND_TABLE,
    payload: res
})
const fetchSaveBond = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/margincs/insertMargin', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            const newRes = Object.assign({}, res, {
                sub: data
            })
            console.log('保证金数据：', res)
            if (res.result === 'success') {
                hide()
                notification.success({
                    message: '新增成功',
                    description: '保证金新增成功'
                });
                dispatch(saveBond(newRes))
                history.back()
            } else {
                hide()
                dispatch(saveBond({}))
                errHandler(res.msg)
            }
        })
    }
}




/* default 导出所有 Actions Creator */
export default {
    fetchBondTable,
    voidBond,
    fetchCommitFinanceBond,
    fetchSaveBond
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
        skipCount: res.sub.skipCount <= 1 ? 1 : (parseInt(res.sub.skipCount) / 10 + 1)
    }),
    [RECEIVE_BOND_VOID]: (bond, {payload: res}) => ({
        ...bond,
        tableData: bond.tableData.map(item=>
            item.marginid !== res.marginid
        )
    }),
    [COMMIT_FINANCE_BOND]: (bond, {payload: res}) => ({
        ...bond
    }),
    [SAVE_BOND_TABLE]: (bond, {payload: res}) => ({
        ...bond
    })
}