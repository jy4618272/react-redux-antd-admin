/**
 * 步骤条组件
 *  this.props
 *      current   表示当前状态，见注解1
 *      steps[{title, description}, {...}, ...]  每个状态的title和描述
 * 
 * 注解1: antd的 Steps 组件的current是从0开始计算的，为了便于理解，我们自己在使用时current从1开始，所以在<Steps current={current - 1}>
 */


import React, { Component } from 'react'

import {
    Steps
} from 'antd'

const Step = Steps.Step

class StepsComponent extends Component {
    constructor() {
        super()
    }
    /**
     * 渲染
     * this.props.current 
     * 
     */
    render() {
        const {current, steps} = this.props
        console.log('current: ', current)
        return (
            <div style={{ margin: '10px 200px' }}>
                <Steps current={current - 1}>
                    {
                        steps.map(step => <Step title={step.title} description={step.description} />)
                    }
                </Steps>
            </div>
        )
    }
}

export default StepsComponent