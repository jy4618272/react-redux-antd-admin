/**
 * 展示资产信息
 * this.props
 *  assetType   资产名字
 *  assetData   需要展示的资产信息   [{key: '资产名称', value: '三星电视'}, {}, {}, ...]
 * 
 */

import React, { Component } from 'react'

import {
    Row,
    Col
} from 'antd'

class AssetInfo extends Component {
    constructor() {
        super()
    }
    /**
     * 渲染
     * 
     */
    render() {
        const {assetType, assetData} = this.props
        // 容器的样式
        const containerStyle = {borderTop: '1px solid #cccccc', borderBottom: '1px solid #cccccc' }
        // 头部样式
        const headerStyle = {fontSize: '14px', padding: '15px 0 10px 5px'}
        // 外层的col
        const colStyle = { marginBottom: '15px' }
        // 内部的两个col，一个包裹key，一个包裹value
        const leftStyle = { textAlign: 'right', paddingRight: '8px' }
        const rightStyle = { paddingLeft: '10px' }
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <span>资产信息</span> &nbsp;| &nbsp;
                    <span>{assetType}</span>
                </div>
                <Row>
                    {
                        assetData.map((v, i, arr) => {
                            return (
                                <Col key={i} span={6} style={colStyle}>
                                    <Col span={9} style={leftStyle}>{v.key}:</Col>
                                    <Col span={15} style={rightStyle}>{v.value}</Col>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        )
    }
}


export default AssetInfo