import { message } from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_CONTRACT_INFO = 'RECEIVE_CONTRACT_INFO'  // 获取合同模板

// ================================
// Action Creator
// ================================
const receiveContractInfo = (res) => ({
    type: RECEIVE_CONTRACT_INFO,
    payload: res
})

const fetchContractInfo = (data) => {
    return dispatch => {
        xhr('post', paths.leasePath + '/pactprintmodelc', data, (res) => {
            const hide = message.loading('正在查询...', 0)

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
                dispatch(receiveContractInfo(newRes))
            } else {
                dispatch(receiveContractInfo({}))
                errHandler(res.msg)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchContractInfo
}

export const ACTION_HANDLERS = {
    [RECEIVE_CONTRACT_INFO]: (contractInfo, {payload: res}) => contractInfo.map(item =>
        item.key === 'modelname' ?
            Object.assign({}, item, { options: res }) :
            item
    )
}