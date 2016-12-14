import React, { Component } from 'react'
import { message, Button } from 'antd'
import { Icons } from 'COMPONENT'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import './print.less';

class PrintPreview extends Component {
    constructor() {
        super()
        this.state = {
            preview: ''  // 打印不同的单据，使用不同的组件
        }
    }

    componentWillMount() {
        this.state.preview = localStorage.getItem('printContent')
    }

    componentDidMount() {
        let wrapPrintContent = document.getElementById('wrapPrintContent')
        wrapPrintContent.innerHTML = this.state.preview
        window.print()
    }
    
    /**
     * 渲染
     * 
     */
    render() {
        return (
            <div>
                <div id="wrapPrintContent" className="m-modal g-padding"></div>

                {/* 打印合同 */}
                <div className="g-padding button-group print-hidden">
                    <Button onClick={() => { window.print() } }><Icons type="print-a" />打印</Button>
                </div>
            </div>
        )
    }
}

export default PrintPreview