/**
 * <UeditorComponent initContent="initContent" getUeditorContent={this.getUeditorContent.bind(this)} />
 * import UeditorComponent from 'COMPONENT/Ueditor/index'
 * 
 * 
 */

import React, { Component } from 'react'

import {
    Row,
    Col
} from 'antd'

// ueditor依赖的js文件, 配置文件、编辑器源码文件
import './ueditor/ueditor.config.js'
import './ueditor/ueditor.all.min.js'

class UeditorComponent extends Component {
    constructor() {
        super()
        this.state = {
            ue: null
        }
    }
    /**
     * 组件销毁时，手动销毁编辑器
     */
    componentWillUnmount() {
        this.state.ue.destroy()
    }

    /**
     * DOM挂载完成后，调用编辑器初始化函数
     *  */ 
    componentDidMount() {
        this.initUeditor()
    }

    /**
     * 初始化编辑器函数
     * 
     */
    initUeditor() {
        const self = this

        // 初始化一个编辑器
        var ue = UE.getEditor('myUeditor', this.getUeditorConfig());
        // 把编辑器实例的引用放到state中
        this.setState({
            ue: ue
        })
        // 监测编辑器的内容改变事件，把内容同步到父组件
        ue.addListener('contentChange', function(editor) {
            // 编辑区的内容
            let html = ue.getContent()
            // getUeditorContent 时父组件传入的函数
            self.props.getUeditorContent(html)
        });
    }
    /**
     * 编辑器的配置文件
     * 
     */
    getUeditorConfig() {
        return {
            UEDITOR_HOME_URL: 'http://zhwladmin.tf56.com/webpc/static/third-party/ueditor/',
            serverUrl: 'http://zhwladmintest.tf56.com/',  // 此接口还没有，为了不让控制台报错，先顶着
            lang: 'zh-cn',  // 语言：中文
            enableAutoSave: false, // 关闭自动保存
            saveInterval: 10000000000,  // 每隔一段时间自动保存,  设置一个超大的
            initialFrameHeight: 300, // 初始化高度
        }
    }
    /**
     * 渲染
     * 
     */
    render() {
        const { initContent } = this.props
        return (
            <Row>
                <Col>
                    {/* 编辑器容器 */}
                    <script id="myUeditor" name="myUeditor" type="text/plain">
                        {/* 初始内容 */}
                        {initContent}
                    </script>
                </Col>
            </Row>
        )
    }
}

export default UeditorComponent