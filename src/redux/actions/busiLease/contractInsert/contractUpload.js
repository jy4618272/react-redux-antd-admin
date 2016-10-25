import { 
    message,
    notification 
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, leasePath } from 'SERVICE/config'

// ================================
// Action Type
// ================================
const RECEIVE_FILE_UPLOAD = 'RECEIVE_FILE_UPLOAD'  // 获取合同模板


// ================================
// Action Creator
// ================================
const receiveFileUpload = (res) => ({
    type: RECEIVE_FILE_UPLOAD,
    payload: res
})

const fetchFileUpload = (data) => {
    return dispatch => {
        xhr('post', leasePath + '/rentpactattachmentcs/insertRentPactAttachment', data, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('文件数据：', res)
            if (res.result === 'success') {
                dispatch(receiveFileUpload(res))
            } else {
                dispatch(receiveFileUpload({}))
                errHandler(res.result)
            }
            hide()
        })
    }
}

/* default 导出所有 Actions Creator */
export default {
    fetchFileUpload
}

export const ACTION_HANDLERS = {
    [RECEIVE_FILE_UPLOAD]: () => null
}