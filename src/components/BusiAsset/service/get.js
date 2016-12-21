/**
 * import {} from 'COMPONENT/BusiAsset/service/get'
 * 
 */

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    message
} from 'antd'

// 查询资产
/**
 * 根据筛选条件查询资产列表
 * 
 */
export const fetchAssetList = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.leasePath + '/assetcs/selectByIndex', arg, (res) => {
            if (res.result == 'success') {
                resolve(res.data)
            } else {
                reject(res.msg)
            }
        })
    })
}

// 获取处置单打印信息
/**
 * http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectDisposalListByAssetid
 *  参数
 *      {assetid: 123}
 */
export const fetchHandleFormPrintInfo = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.leasePath + '/assetcs/selectDisposalListByAssetid', arg, (res) => {
            if (res.result == 'success') {
                resolve(res.data)
            } else {
                errHandler(res.msg)
                reject(res.msg)
            }
        })
    })

}
