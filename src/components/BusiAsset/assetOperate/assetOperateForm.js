/**
 * 
 * this.props
 *  id 资产id，表单参数
 *  operateType 操作类型，影响显示的表单
 *  isModify  如果是true，说明是修改，需要进行一些初始化
 */

import React, { Component } from 'react'

import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Radio,
    Cascader
} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group

// 自定义
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import { parseArrayToTree } from 'COMPONENT/BusiAsset/component/parseArrayToTree'
import SelectOwner from 'COMPONENT/BusiAsset/component/selectOwner'

class AssetOperateForm extends Component {
    constructor() {
        super()
        this.state = {
            operateForm: '',
            assetAreaTree: [],
            selectOwnerDisplay: false,
            assettransferid: -1, // 这是操作id，第一次保存、提交为-1，如果是保存后的修改，则在初始化的时候，更新为实际assettransferid
        }
    }

    /**
     * 初始化
     *  :operateType  db|调拨   xz|闲置  bf|报废  cz|处置,  ，处置操作的表单和前三者不一样
     */
    componentWillMount() {
        const { isModify } = this.props

        this.fetchAssetAreaData()

        // init:01 如果是修改，需要初始化 
        if (isModify == 'true') {
            this.initForm()
        }

    }

    /**
     * 如果是修改，需要初始化表单
     * http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectAssetAndAssetTransferByAssetId
     * 
     *      参数：
     *      assetid
     */
    initForm() {
        const { setFieldsValue } = this.props.form
        const { id: assetid } = this.props

        console.log('params: ', this.props.params)

        xhr('post', paths.leasePath + '/assetcs/selectAssetAndAssetTransferByAssetId', { assetid }, (res) => {
            if (res.result == 'success') {
                // 操作信息
                let info = res.data.assettransfer
                // 资产区域，string->array
                if (info.toassetarealist) {
                    info.toassetarealist = info.toassetarealist.split('/')
                }
                 console.log('modify operate: ', info)
                //  第二次有真实的操作id，需要初始化一下
                 this.setState({
                     assettransferid: info.assettransferid
                 })
                // 初始化表单
                setFieldsValue(info)
            } else {
                errHandler(res.msg)
            }
        })
    }

    /**
     * 查询区域分类数据
     *  http://dev.zhwladmintest.tf56.com/tfPassParkAdmin/assetareacs/selectAssetAreaBySite
     */
    fetchAssetAreaData() {
        xhr('post', paths.leasePath + '/assetareacs/selectAssetAreaBySite', {}, (res) => {
            if (res.result == 'success') { // 获取数据成功
                if (res.data.count > 0) {  // 判断是否有配置数据
                    this.setState({
                        assetAreaTree: parseArrayToTree(res.data.data)
                    })
                } else {
                    notification.warn({
                        message: '暂无初始化配置信息 请联系管理员!'
                    })
                }
            } else if (res.result == 'error') {// 获取数据失败
                /**
                 * 如果报错，弹出错误提示 res.msg
                 *  */
                errHandler('获取资产区域信息失败!')
                console.log('获取资产区域信息失败!', res.msg)
            }
        })
    }
    /**
     * 选择责任人
     * 
     */
    selectOwner() {
        this.setState({
            selectOwnerDisplay: true
        })


    }

    /**
     * 关闭弹窗时的hook函数
     * 
     */
    selectOwnerCancle() {
        this.setState({
            selectOwnerDisplay: false
        })
    }
    /**
     * modal确定时的hook函数
     * 
     */
    selectOwnerOk(selectedOwner) {
        console.log('selectedOwner: ', selectedOwner)
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            toowner: selectedOwner.owner,
            toassetdeplist: selectedOwner.assetdeplist
        })
    }

    /**
     *  处理参数
     *      
     * 参数
     *      公共：assetid｜资产id  changetype｜操作类型  assettransferid｜操作id   memo｜备注
     *      私有：
     *          db|调拨 xz|闲置 bf|报废：toowner｜现责任人   toassetdeplist｜现部门  toassetarealist｜现责任部门
     *          cz|处置： disposition｜处置方式  dispositionmoney｜处置金额
     * 
     *      :operateType    db|调拨   xz|闲置  bf|报废  
     *                      cz|处置
     */
    getSubmitValues() {
        // 操作id
        const { assettransferid } = this.state
        // 操作类型、资产id
        const { operateType, id: assetid } = this.props
        // 获取表单字段
        const { getFieldsValue } = this.props.form

        // 表单字段，私有参数
        const submitValues = getFieldsValue()

        console.log('submitValues: ', submitValues)

        // 资产区域需要处理成字符串
        submitValues.toassetarealist
            ? (submitValues.toassetarealist = submitValues.toassetarealist.join('/'))
            : ('')

        //  操作类型
        let changetype = '';

        (operateType == 'db') ? (changetype = '调拨') : ('');
        (operateType == 'xz') ? (changetype = '闲置') : ('');
        (operateType == 'bf') ? (changetype = '报废') : ('');
        (operateType == 'cz') ? (changetype = '处置') : ('');

        // 最终参数：将私有参数和公共参数合并
        let arg = Object.assign({}, submitValues, {
            assetid,
            changetype,
            assettransferid
        })

        return arg
    }

    /**
     * 保存, 保存不区分类型，用同一个接口
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assettransfercs/insertAssetTransfer
     */
    handleSave() {
        // 最终参数：将私有参数和公共参数合并
        let arg = this.getSubmitValues()

        console.log('save: ', arg)

        xhr('post', paths.leasePath + '/assettransfercs/insertAssetTransfer', arg, (res) => {
            if (res.result == 'success') {
                history.back()
            } else {
                errHandler(res.msg)
            }
        })
    }


    /**
     * 提交
     *      因为按钮用的是一套，所以需要在这里先判断当前操作类型，然后在进行对应的提交
     *      :operateType    db|调拨   xz|闲置  bf|报废   // http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assettransfercs/submitAssetTransferFlowModel
     *                      cz|处置,  处置操作的表单保存和前三者不一样  // http://abc.myportaltest.tf56.com:8080/tfPassParkAdmin/assettransfercs/submitAssetTransferAside
     */
    handleSubmit() {
        // 操作类型
        const { operateType } = this.props

        // 获取表单字段，表单错误过滤
        const { validateFieldsAndScroll } = this.props.form

        validateFieldsAndScroll((err) => {
            if (!err) {
                let arg = this.getSubmitValues()

                if (operateType == 'db' || operateType == 'xz' || operateType == 'bf') {
                    xhr('post', paths.leasePath + '/assettransfercs/submitAssetTransferFlowModel', arg, (res) => {
                        if (res.result == 'success') {
                            history.back()
                        } else {
                            errHandler(res.msg)
                        }
                    })
                } else if (operateType == 'cz') {
                    xhr('post', paths.leasePath + '/assettransfercs/submitAssetTransferAside', arg, (res) => {
                        if (res.result == 'success') {
                            history.back()
                        } else {
                            errHandler(res.msg)
                        }
                    })
                }
            }
        })


    }

    /**
     * 返回
     * 
     */
    handleCancel() {
        history.back()
    }

    /**
     * 渲染
     * 
     */
    render() {
        const { id, operateType } = this.props
        const { getFieldDecorator } = this.props.form
        const { operateForm } = this.state

        const buttonGroup = (
            <Row>
                <Col span={22} offset={2}>
                    <Button type="primary" onClick={this.handleSave.bind(this)}>保存</Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="default" onClick={this.handleSubmit.bind(this)}>提交</Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="default" onClick={this.handleCancel.bind(this)}>取消</Button>
                </Col>
            </Row>
        )

        if (operateType == 'db' || operateType == 'xz' || operateType == 'bf') {
            // FormItem样式
            const formItemLayout = {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
                style: { width: '100%' }
            }
            // Col控制
            const colAttr = {
                span: 6,
                style: { height: '60px' }
            }
            return (
                <div>
                    <Row>
                        <Col { ...colAttr }>
                            <FormItem label="存放位置" { ...formItemLayout }>
                                {getFieldDecorator('toassetarealist', {
                                    rules: [{ type: 'array', required: true, message: '请选择存放位置' }]
                                })(
                                    <Cascader
                                        showSearch
                                        options={this.state.assetAreaTree}
                                        placeholder="请选择存放位置" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col { ...colAttr }>
                            <FormItem label="责任人" { ...formItemLayout }>
                                {getFieldDecorator('toowner', {
                                    rules: [{ required: true, message: '请选择责任人' }],
                                })(
                                    <Input onClick={this.selectOwner.bind(this)} placeholder="请选择责任人" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col { ...colAttr }>
                            <FormItem label="责任部门" { ...formItemLayout }>
                                {getFieldDecorator('toassetdeplist', {
                                    rules: [],
                                })(
                                    <Input disabled placeholder="请选择责任部门" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }}>
                                {getFieldDecorator('memo', {
                                    rules: [],
                                })(
                                    <Input type="textarea" placeholder="请输入备注" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row><br />
                    {buttonGroup}
                    <SelectOwner
                        selectOwnerOk={this.selectOwnerOk.bind(this)}
                        selectOwnerCancle={this.selectOwnerCancle.bind(this)}
                        selectOwnerDisplay={this.state.selectOwnerDisplay} />
                </div>
            )
        } else if (operateType == 'cz') {
            // FormItem样式
            const formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
                style: { width: '100%' }
            }
            // Col控制
            const colAttr = {
                span: 8,
                style: { height: '60px' }
            }
            return (
                <div>
                    <Row>
                        <Col { ...colAttr }>
                            <FormItem label="处置方式" { ...formItemLayout }>
                                {getFieldDecorator('disposition', {
                                    rules: [],
                                })(
                                    <RadioGroup>
                                        <Radio value="变卖">变卖</Radio>
                                        <Radio value="出售给外单位">出售给外单位</Radio>
                                        <Radio value="其他">其他</Radio>
                                    </RadioGroup>
                                    )}
                            </FormItem>
                        </Col>
                        <Col { ...colAttr }>
                            <FormItem label="处置价格" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                                {getFieldDecorator('dispositionmoney', {
                                    rules: [],
                                })(
                                    <Input placeholder="请输入处置价格" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 11 }}>
                                {getFieldDecorator('memo', {
                                    rules: [],
                                })(
                                    <Input type="textarea" placeholder="请输入备注" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row><br />
                    {buttonGroup}
                </div>
            )
        }
    }
}

export default Form.create()(AssetOperateForm) 