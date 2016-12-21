import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    message
} from 'antd'

// 终止资产
/**
 * http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/updateAssetEndByAssetId
 * 参数：
 *  arg{assetid: 123}
 * 
 */
export const breakAsset = (arg) => {
    return new Promise((resolve, reject) => {
        xhr('post', paths.leasePath + '/assetcs/updateAssetEndByAssetId', arg, (res) => {
            if (res.result == 'success') {
                message.success('终止成功!')
                resolve(res.data)
            } else {
                message.error(res.msg)
                reject(res.msg)
            }
        })
    })
}
