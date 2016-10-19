import { notification } from 'antd'
import xhr from 'SERVICE'
import {
    errHandler,
    leasePath
} from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_ROOM_ADD = 'RECEIVE_ROOM_ADD'
const RECEIVE_BUILD_LIST = 'RECEIVE_BUILD_LIST'
const RECEIVE_CLASSLINE_ADD = 'RECEIVE_CLASSLINE_ADD'
const RECEIVE_POLICY_ADD = 'RECEIVE_POLICY_ADD'
const RECEIVE_MANAGER_ADD = 'RECEIVE_MANAGER_ADD'
const RECEIVE_CONSTRACT_ADD = 'RECEIVE_CONSTRACT_ADD'


// ================================
// Action Creator
// ================================
// 房间设置新增
const receiveRoomAdd = (res) => ({
    type: RECEIVE_ROOM_ADD,
    payload: res
})

const fetchRoomAdd = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentroomcs/insertRentRoom', data, function (res) {
            console.log('房间设置之表单保存', res)
            if (res.result === 'success') {
                if (res.data.rentroomid) {
                    xhr('post', leasePath + '/rentroomconfigcs/insertRentRoomConfig', {
                        rentroomid: res.data.rentroomid,
                        itemname: '32323'
                    }, function (res) {
                        console.log('房间设置之表单保存2', res)
                        if (res.result === 'success') {
                            dispatch(receiveRoomAdd(res))
                        }
                    })
                }
                notification.success({
                    message: '新增成功',
                    description: '房间设置新增数据成功'
                });
                history.back()
            } else {
                dispatch(receiveRoomAdd({}))
                errHandler(res.result)
            }
        })
    }
}

// 获取楼号新增
const receiveBuildList = (res) => ({
    type: RECEIVE_BUILD_LIST,
    payload: res
})
const fetchBuildList = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentroomcs/seleBuildBySiteAndArea', data, function (res) {
            console.log('房间设置之获取楼号：', data, res)
            const options = []
            res.data.map(item => {
                options.push({ key: item.build, value: item.build })
            })
            if (res.result === 'success') {
                dispatch(receiveBuildList(options))
            } else {
                dispatch(receiveBuildList({}))
                errHandler(res.result)
            }
        })
    }
}

// 班线管理新增
const receiveClassLineAdd = (res) => ({
    type: RECEIVE_CLASSLINE_ADD,
    payload: res
})

const fetchClassLineAdd = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/transportlinecs/insertTransportLine', data, function (res) {
            console.log('班线管理之表单保存', res)
            if (res.result === 'success') {
                dispatch(receiveClassLineAdd(res))
                notification.success({
                    message: '新增成功',
                    description: '班线管理新增数据成功'
                });
                history.back()
            } else {
                dispatch(receiveClassLineAdd({}))
                errHandler(res.result)
            }
        })
    }
}

// 政策优惠新增
const receivePolicyAdd = (res) => ({
    type: RECEIVE_POLICY_ADD,
    payload: res
})

const fetchPolicyAdd = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentpromotioncs/insertRentPromotion', data, function (res) {
            console.log('政策优惠之表单保存', res)
            if (res.result === 'success') {
                dispatch(receivePolicyAdd(res))
                notification.success({
                    message: '新增成功',
                    description: '政策优惠新增数据成功'
                });
                history.back()
            } else {
                dispatch(receivePolicyAdd({}))
                errHandler(res.result)
            }
        })
    }
}

// 客户经理新增
const receiveManagerAdd = (res) => ({
    type: RECEIVE_MANAGER_ADD,
    payload: res
})

const fetchManagerAdd = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/salercs/insertSaler', data, function (res) {
            console.log('客户经理之表单保存', res)
            if (res.result === 'success') {
                dispatch(receiveManagerAdd(res))
                notification.success({
                    message: '新增成功',
                    description: '客户经理新增数据成功'
                });
                history.back()
            } else {
                dispatch(receiveManagerAdd({}))
                errHandler(res.result)
            }
        })
    }
}

// 合同模板新增
const receiveContractAdd = (res) => ({
    type: RECEIVE_CONSTRACT_ADD,
    payload: res
})

const fetchContractAdd = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/pactprintmodelcs/insertPactPrintModel ', data, function (res) {
            console.log('合同模板之表单保存', res)
            if (res.result === 'success') {
                dispatch(receiveContractAdd(res))
                notification.success({
                    message: '新增成功',
                    description: '合同模板新增数据成功'
                });
                history.back()
            } else {
                dispatch(receiveContractAdd({}))
                errHandler(res.result)
            }
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchRoomAdd,
    fetchBuildList,
    fetchClassLineAdd,
    fetchPolicyAdd,
    fetchManagerAdd,
    fetchContractAdd
}

export const ACTION_HANDLERS = {
    [RECEIVE_ROOM_ADD]: (roomAdd) => ({
        ...roomAdd
    }),
    [RECEIVE_BUILD_LIST]: (roomAdd, {payload: res}) => {
        roomAdd.room.map((item, index) => {
            if (index == 1) {
                item.options = res
            }
        })
        return roomAdd
    },
    [RECEIVE_CLASSLINE_ADD]: ({ payload: res }) => [],
    [RECEIVE_POLICY_ADD]: ({payload: res}) => [],
    [RECEIVE_MANAGER_ADD]: ({payload: res}) => [],
    [RECEIVE_CONSTRACT_ADD]: ({payload: res}) => []
}