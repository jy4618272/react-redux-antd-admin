/**
 * 
 * 此组件需要的props?
 *      assetid
 */

import React, { Component } from 'react'

// ajax 工具
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    Cards
} from 'COMPONENT'

import {
    Row,
    Col
} from 'antd'

class AssetInfo extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            assetData: []
        }
    }

    /**
     * 
     * 初始化一些数据
     */
    componentWillMount() {
        this.handleAssetInfo()
    }

    /**
     * 将资产信息处理成需要的格式
     * 
     *  */
    handleAssetInfo() {
        const assetInfoPromise = this.fetchAssetInfoById()

        assetInfoPromise.then((assetInfo) => {
            console.log('assetInfo', assetInfo)
            // 处理后的资产信息
            const assetData = this.parseAssetInfo(assetInfo)
            this.setState({
                title: '资产信息: ' + assetInfo.assettypename2 + ' ' + assetInfo.assetstatus,
                assetData: assetData
            })

        })
    }

    /**
     * 将对象格式的资产信息解析成一个数组，[{key: '', value: ''}, {}...]
     * 
     */
    parseAssetInfo(assetInfo) {
        const mapRule = this.mapDisplayRule()
        let display = []
        // 
        for (let key in mapRule) {
            // displayValue是根据mapDisplayRule的配置从要展示的数据中获取的实际value，可能不存在
            let displayValue = assetInfo[key]
            // 如果存在，则把mapRule[key]和assetInfo[key]组合成一个对象
            if (displayValue) {
                // todo 建筑面积、等数据需要加单位
                display.push({
                    key: mapRule[key],
                    value: displayValue
                })
            }
        }
        // console.log('display', display)
        return display
    }

    /**
     * 映射关系 
     *  需要展示的数据
     */
    mapDisplayRule() {
        return {
            assetname: '资产名称:',
            originalprice: '价格/元:',
            assetspec: '规格型号:',
            assettypelist: '资产分类:',
            isinformation: '是否信息化:',
            parameternumber: '台账编号:',
            assetarealist: '存放位置:',
            owner: '责任人:',
            assetdeplist: '责任部门:',
            enabledate: '启用时间:',
            guaranteeperiod: '质保期/年:',
            inputdate: '录入时间:',
            supplier: '供应商:',
            landarea: '土地面积:',
            coveredarea: '建筑面积:',
            memo: '备注:'
        }
    }


    /**
     * 根据id获取资产信息
     *  http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectAssetById
     */
    fetchAssetInfoById() {
        const { assetid } = this.props
        return new Promise((resolve, reject) => {
            xhr('post', paths.leasePath + '/assetcs/selectAssetById', { assetid }, (res) => {
                if (res.result == 'success') {
                    // 如果获取数据成功，返回获取到的数据
                    resolve(res.data) 
                } else {
                    // 如果获取数据失败，直接报错,不需要返回数据
                    errHandler(res.msg)
                }
            })
        })
    }
    /**
     * 渲染
     * 
     */
    render() {
        const { title, assetData } = this.state

        const oneLine = {
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'      
        }
        const keyStyle = Object.assign({}, oneLine, {
            textAlign: 'right'
        }) 
        const valueStyle = Object.assign({}, oneLine, {
            paddingLeft: '10px'
        })

        return (
            <div>
                <Cards title={title}>
                    <Row>
                        {
                            assetData.map((v, i, a) => {
                                return (
                                    <Col span={6} style={{ height: '30px' }}>
                                        <Col 
                                            title={v.key} 
                                            span={6} 
                                            style={ keyStyle }>
                                                {v.key}
                                        </Col>

                                        <Col 
                                            title={v.value} 
                                            span={18} 
                                            style={ valueStyle }>
                                                {v.value}
                                        </Col>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Cards>
            </div>
        )
    }

}

export default AssetInfo