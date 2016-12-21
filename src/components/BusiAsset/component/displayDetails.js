/**
 * this.props
 *      title    这是给Cards用的
 *      displayData{}     要展示的字段
 * 
 */

import React, { Component } from 'react'

import {
    Cards
} from 'COMPONENT'

import {
    Row,
    Col
} from 'antd'

class DisplayDetails extends Component {
    constructor() {
        super()
        this.state = {
            displayData: []
        }
    }

    componentWillMount() {
        // init01 
        this.parseData()
    }

    /**
     * 将对象格式的信息解析成一个数组，[{key: '', value: ''}, {}...]
     * 
     */
    parseData() {
        // 要展示的数据
        const { displayData } = this.props
        // 映射规则
        const mapRule = this.mapDisplayRule()
        // 处理结果
        let display = []
        // 
        for (let key in mapRule) {
            // displayValue是根据mapDisplayRule的配置从要展示的数据中获取的实际value，可能不存在
            let displayValue = displayData[key]
            // 如果存在，则把mapRule[key]和assetInfo[key]组合成一个对象
            if (displayValue) {
                // todo 建筑面积、等数据需要加单位
                display.push({
                    key: mapRule[key],
                    value: displayValue
                })
            }
        }
        
        this.setState({
            displayData: display
        })
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

            handleDate: '处置时间:',
            inputman: '经办人:',

            toassetarealist: '存放位置:',
            toowner: '责任人:',
            toassetdeplist: '责任部门:',
            disposition: '处置方式:',
            dispositionmoney: '处置价格:',

            scrapdate: '报废时间:',
            scrapreason: '报废原因:',

            username: '审核人:',

            memo: '备注:'
        }
    }

    /**
     * 渲染
     * 
     */
    render() {
        // Cards 的title属性
        const { title } = this.props
        // 要展示的数据，已经处理成一个数组
        const { displayData } = this.state

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
                            displayData.map((v, i, a) => {
                                return (
                                    <Col span={6} style={{ height: '30px' }}>
                                        <Col
                                            title={v.key}
                                            span={6}
                                            style={keyStyle}>
                                            {v.key}
                                        </Col>

                                        <Col
                                            title={v.value}
                                            span={18}
                                            style={valueStyle}>
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

export default DisplayDetails