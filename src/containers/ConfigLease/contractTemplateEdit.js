/**
 * 合同模版 新增、编辑 
 *  如果是新增，不需要调用接口初始化
 *  如果是编辑，需要调接口进行初始化
 * 
 * 参数this.props
 *      id   (-1 新增)  (>0 编辑)
 * 
 * 
 */
import React, { Component } from 'react'

import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

import {
    Button,
    Row,
    Col,
    Input,
    Select,
    message
} from 'antd'

const Option = Select.Option

// ueditor依赖的js文件, 配置文件、编辑器源码文件
import 'THIRDPARTY/ueditor/ueditor.config.js'
import 'THIRDPARTY/ueditor/ueditor.all.min.js'

import UeditorComponent from 'COMPONENT/Ueditor/index'

class ContractTemplateEdit extends Component {
    constructor() {
        super()
        this.state = {
            initContent: '',  // 初始化编辑器
            modeltext: '', // 模版内容
            modelname: '', // 模版名称
            memo: '',   // 备注
            status: '',   // 状态   开启｜关闭
            pactkind: '', // 合同类型
            ue: null,   // 指向编辑器的引用
            whetherOk: false,  // 标示富文本编辑器是否准备就绪，默认null，准备就绪时为true
            mySetInterval: null   // 一个计时器
        }
    }

    /**
     * DOM挂载完成，需要初始化编辑器，获取数据
     * 
     */
    componentDidMount() {
        const { id } = this.props
        // 初始化编辑器要卸载获取数据之前
        this.initUeditor()
        //  id != -1 是编辑，需要获取已经存在的数据
        if (id != -1) {
            this.fetchContractInfo()
        }
    }

    /**
     * 组件销毁时，手动销毁编辑器
     */
    componentWillUnmount() {
        this.state.ue.destroy()
    }

    // 同步编辑器组件的内容到当前组件
    getUeditorContent(html) {
        this.state.modeltext = html
    }

    /**
     * 如果是编辑，需要获取原来就有的数据
     * 
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/pactprintmodelcs/selectPactPrintModelById 
     * 
     * 参数
     *  pactprintmodelid  合同打印模板id 
     */
    fetchContractInfo() {
        // 编辑的合同id
        const { id: pactprintmodelid } = this.props
        const hide = message.loading('正在加载合同数据...', 0);
        xhr('post', paths.leasePath + '/pactprintmodelcs/selectPactPrintModelById', {
            pactprintmodelid
        }, (res) => {
            hide()

            // 需要同步到this.state的数据
            const { modelname, memo, status, modeltext, pactkind } = res.data
            if (res.result == 'success') {
                this.setState({
                    modelname, memo, status, modeltext, pactkind
                })
                /**
                 * 当获取合同信息成功后
                 *  启动一个计数器不停的询问(this.state.whetherOk)编辑器是否准备就绪
                 *      如果准备继续：设置编辑器默认内容，并清除计时器
                 *      如果没有：那么过100毫秒再问一下
                 *  */
                this.state.mySetInterval = setInterval(() => {
                    if (this.state.whetherOk) {
                        clearInterval(this.state.mySetInterval)
                        this.state.ue.setContent(modeltext)
                    }               
                }, 100)

            } else {
                message.warning('获取合同数据失败...')
            }
        })
    }

    /**
     * 新增合同模版
     * 
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/pactprintmodelcs/insertPactPrintModel
     * 
     * 参数
     *  modelname 模版名称
     *  memo 备注
     *  status 状态 开启｜关闭  修改前必须 检查合同是否使用 
     *  modeltext 模版内容
     *  pactkind 合同类型
     */
    addContractTemplate() {
        // 参数
        const { modelname, memo, modeltext, pactkind } = this.state

        xhr('post', paths.leasePath + '/pactprintmodelcs/insertPactPrintModel', {
            modelname, memo, status: '开启', modeltext, pactkind
        }, (res) => {
            if (res.result == 'success') {
                message.success('新增成功!')
                // 返回列表页
                history.back()
            } else {
                message.error(res.msg)
            }
        })
    }

    /**
     * 修改合同模版
     * 
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/pactprintmodelcs/updatePactPrintModel
     * 参数：
     *  modelname  模版名称
     *  memo 备注
     *  status 状态 开启｜关闭   修改前必须 检查合同是否使用
     *  modeltext 模版内容
     *  pactprintmodelid 合同打印模版id
     *  pactkind 合同类型 
     */
    saveContractTemplate() {
        // 修改时需要带上模版id
        const { id: pactprintmodelid } = this.props
        // 其他参数
        const { modelname, memo, status, modeltext, pactkind } = this.state
        xhr('post', paths.leasePath + '/pactprintmodelcs/updatePactPrintModel', {
            modelname, memo, status, modeltext, pactkind, pactprintmodelid
        }, (res) => {
            if (res.result == 'success') {
                message.success('修改成功!')
                // 返回列表页
                history.back()
            } else {
                message.error(res.msg)
            }
        })
    }

    /**
     * 修改表单内容
     * 
     */
    handleChange(formName, e) {
        this.setState({
            [formName]: e.target.value
        })
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
        this.state.ue = ue
        // 监测编辑器的内容改变事件，把内容同步到父组件
        ue.addListener('contentChange', function (editor) {
            // 编辑区的内容
            let html = ue.getContent()
            // getUeditorContent 时父组件传入的函数
            self.getUeditorContent(html)
        });
        // 当编辑器准备就绪，需要告诉react
        ue.addListener('ready', (editor) => {
            console.log('编辑器准备就绪。。。')
            this.setState({
                whetherOk: true
            })
        })
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
            elementPathEnabled: false,   // 去掉元素路径
            wordCount: false    // 去掉字数统计
        }
    }

    /**
     * 渲染
     * 
     */
    render() {
        const tableStyle = { width: '80%' }
        const labelStyle = { lineHeight: '25px', textAlign: 'right', paddingRight: '20px' }
        const containerStyle = { padding: '20px 30px' }

        // 保存有两种，   编辑已选在的合同模版后保存 和  新增保存
        const saveContractTemplate = this.props.id == -1 ? this.addContractTemplate : this.saveContractTemplate

        return (
            <div style={containerStyle}>
                {/* 模版名称、模板内容、合同类型、备注  保存、关闭*/}
                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>模版名称</span>
                        </Col>
                        <Col span={8}>
                            <Input value={this.state.modelname} onChange={this.handleChange.bind(this, 'modelname')} />
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>合同类型</span>
                        </Col>
                        <Col span={10}>
                            <Select
                                style={{ width: '80px' }}
                                value={this.state.pactkind}
                                onChange={(value) => { this.setState({ pactkind: value }) } }>
                                <Option value="合同">合同</Option>
                                <Option value="协议">协议</Option>
                            </Select>
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>备注</span>
                        </Col>
                        <Col span={10}>
                            <Input value={this.state.memo} onChange={this.handleChange.bind(this, 'memo')} />
                        </Col>
                    </Col>
                </Row> <br />

                <Row>
                    <Col>
                        <Col span={2} style={labelStyle}>
                            <span>模板内容</span>
                        </Col>
                        <Col span={21}>
                            {/*<UeditorComponent
                                initContent={ this.state.initContent }
                                getUeditorContent={ this.getUeditorContent.bind(this) } />*/}
                            {/* 编辑器容器 */}
                            <script id="myUeditor" name="myUeditor" type="text/plain">
                                {/* 初始内容 */}
                            </script>
                        </Col>
                    </Col>
                </Row> <br /> <br />

                <Row>
                    <Col span={2}></Col>
                    <Col span={21}>
                        <Button type="primary" size="large"
                            onClick={saveContractTemplate.bind(this)}>
                            保存
                        </Button> &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" size="large" onClick={() => { history.back() } }>关闭</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ContractTemplateEdit