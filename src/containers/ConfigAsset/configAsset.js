/**
 * 资产配置页
 *  有两个tab，tab组件的相对位置: ./tabComponent/assetAreaConfig   .tabComponent/assetSortConfig
 *  */
import React, { Component } from 'react'

import {
    Tabs
} from 'antd'

const TabPane = Tabs.TabPane

import AssetAreaConfig from 'CONTAINER/ConfigAsset/tabComponent/assetAreaConfig'
import AssetSortConfig from 'CONTAINER/ConfigAsset/tabComponent/assetSortConfig'

class ConfigAsset extends Component {
    constructor() {
        super()
    }

    /**
     * 渲染
     *
     * */
    render() {
        return (
            <div style={{ margin: '10px 20px', minHeight: '450px' }}>
                <Tabs
                    type="card"
                    defaultActiveKey="1"
                    >
                    <TabPane
                        tab="资产分类配置"
                        key="1"
                        >
                        <AssetSortConfig />
                    </TabPane>
                    <TabPane
                        tab="资产区域配置"
                        key="2"
                        >
                        <AssetAreaConfig />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}


export default ConfigAsset