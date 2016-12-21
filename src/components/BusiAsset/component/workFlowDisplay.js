/**
 * 流程图展示, 需要一个参数type，type是接下来要进行操作的类型，因为不同的操作可能审核人是不一样的
 * 
 *  this.props
 *      arg [Object] {type: ''}
 *           type的取值范围：
 *              动产新增、不动产新增、低值易耗品新增、动产调拨、不动产调拨、低值易耗品调拨、动产处置、不动产处置、
 *              低值易耗品处置、动产报废、不动产报废、低值易耗品报废
 * 
 * 
 * 
 */

// ajax
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

// 新增、修改各种类型资产时的流程图数据
/**
 * http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectWorkFlowByType
 * arg {type: ''}
 */
export const getNewAssetWorkFlow = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.leasePath + '/assetcs/selectWorkFlowByType', arg, (res) => {
            if (res.result == 'success') { // 查询成功
                resolve(res)
            } else {  // 查询失败
                reject(res.msg)
            }
        })
    })
}

// 审核页面流程图
/**
 * 8.1.3
 * url:http://myportaltest.tf56.com:8080/workflowAdmin/flownodecs/selectWorkFlowInformation
 * arg {businessno: '业务号', pactkind: '这个直接用空字符串占位即可'}
 */
export const getCheckWorkFlow = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.workFlowPath + '/flownodecs/selectWorkFlowInformation', arg, (res) => {
            if (res.result == 'success') { // 查询成功
                resolve(res)
            } else {  // 查询失败Ï
                reject(res.msg)
            }
        })
    })
}

// 详情页面流程图
/**
 * 8.1.25
 * http://myportaltest.tf56.com:8080/workflowAdmin/flownodecs/selectWorkFlowInformationInService
 * 
 * arg {id: '资产id，即assetid', servicetype: '资产，这个是固定的参数值'}
 */
export const getAssetDetailWorkFlow = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.workFlowPath + '/flownodecs/selectWorkFlowInformationInService', arg, (res) => {
            if (res.result == 'success') { // 查询成功
                resolve(res)
            } else {  // 查询失败
                reject(res.msg)
            }
        })
    })
}