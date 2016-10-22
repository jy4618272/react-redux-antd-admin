import { notification } from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_CONTRACT_FROM = 'RECEIVE_CONTRACT_FROM'  // 获取合同模板


// ================================
// Action Creator
// ================================
const receiveContractFrom = (res) => ({
    type: RECEIVE_CONTRACT_FROM,
    payload: res
})

const fetchContractFrom = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/pactprintmodelcs/selectTypeBySite', data, (res) => {
            const newRes = []
            res.data.map(item => {
                newRes.push({
                    key: item.modelname,
                    value: item.modelname,
                    pactkind: item.pactkind
                })
            })
            console.log('获取【合同模板】数据：', newRes)
            if (res.result === 'success') {
                dispatch(receiveContractFrom(newRes))
            } else {
                dispatch(receiveContractFrom({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractFrom
}

export const ACTION_HANDLERS = {
    [RECEIVE_CONTRACT_FROM]: (contractFrom, {payload: res}) => contractFrom.map(item => 
        item.key === 'modelname' ? 
            Object.assign({}, item, { options: res}) : 
            item
    )
}