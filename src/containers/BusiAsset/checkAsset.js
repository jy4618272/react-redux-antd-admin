import React, { Component } from 'react'

import StepsComponent from 'COMPONENT/BusiAsset/component/stepsComponent'
import AssetInfoParse from 'COMPONENT/BusiAsset/component/assetInfoParse'

class CheckAsset extends Component {
    constructor() {
        super()
        this.state = {
            current: 2,
            steps: [   // stepsComponent
                { title: '内勤1', description: '张琪亚 ｜ 新增' },
                { title: '管理员', description: '李媛风 ｜ 审核' },
                { title: '财务员', description: '母庆业 ｜ 审核' },
                { title: '完成', description: '' }
            ]
        }
    }
    /**
     * 渲染
     * */
    render() {
        return (
            <div>
                <div>
                    <StepsComponent current={this.state.current} steps={this.state.steps}/>
                </div>
                <div>
                    <AssetInfoParse />
                </div>
            </div>
        )
    }
}


export default CheckAsset