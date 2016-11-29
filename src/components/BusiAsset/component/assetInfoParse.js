/**
 * 资产类型不同，需要展示的信息字段也不同，在这个组件里处理成统一的格式，传递给<AssetInfoDisplay />
 *  assetType: '动产'  
 *  data: [{key: '资产名称', value: '三星电视'}, {}, {}, ...]
 * 
 * 此组件需要的props?
 */

import React, { Component } from 'react'

import AssetInfoDisplay from 'COMPONENT/BusiAsset/component/assetInfoDisplay'

class AssetInfo extends Component {
    constructor() {
        super()
        this.state = {
            assetType: '',
            assetData: []
        }
    }
    handleAssetInfo() {
        this.setState({
            assetType: '动产',
            assetData: [
                { key: '资产名称1', value: '三星电视' },
                { key: '资产名称2', value: '三星电视' },
                { key: '资产名称3', value: '三星电视' },
                { key: '资产名称4', value: '三星电视' },
                { key: '资产名称5', value: '三星电视' },
                { key: '资产名称1', value: '三星电视' },
                { key: '资产名称2', value: '三星电视' },
                { key: '资产名称3', value: '三星电视' },
                { key: '资产名称4', value: '三星电视' },
                { key: '资产名称5', value: '三星电视' },
                { key: '资产名称1', value: '三星电视' },
                { key: '资产名称2', value: '三星电视' },
                { key: '资产名称3', value: '三星电视' },
                { key: '资产名称4', value: '三星电视' },
                { key: '资产名称5', value: '三星电视' }
            ]
        })
    }
    componentWillMount() {
        this.handleAssetInfo()
    }
    /**
     * 渲染
     * 
     */
    render() {
        return (
            <div style={{ margin: '20px 20px' }}>
                <AssetInfoDisplay assetType={this.state.assetType} assetData={this.state.assetData} />
            </div>
        )
    }

}

export default AssetInfo