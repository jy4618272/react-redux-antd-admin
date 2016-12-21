/**
 * 这个表单用于编辑(新增、修改)资产信息，新增和修改需要进行的初始化操作是不一样的
 *  
 * 需要的参数
 *     ？？？ operateType   操作类型有 新增和修改   这个影响初始化规则，需要注意，新增资产的assetid=-1,修改时有真实id
 *      addAssetType  有  1｜2｜3 分别是 动产｜不动产｜低值易耗品   这个影响UI
 *      assetid       真实id 或 －1， 前者表示修改操作，后者表示新增
 * 
 * 
 * 删除标记为“临时使用”的代码
 */

// react 套餐
import React, { Component } from 'react'

// antd
import {
    Form,
    Input,
    Icon,
    Button,
    Row,
    Col,
    Cascader,
    Select,
    DatePicker,
    Modal,
    AutoComplete,
    Table
} from 'antd'
const FormItem = Form.Item
const Option = Select.Option

// moment
import moment from 'moment'

// 自定义
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import { parseArrayToTree } from 'COMPONENT/BusiAsset/component/parseArrayToTree'

import {
    InnerForm,
    InnerPagination,
    InnerTable
} from 'COMPONENT'

class AssetForm extends Component {
    constructor() {
        super()
        this.state = {
            assetTypeTree: [],
            assetAreaTree: [],
            visible: false,
            jobCard: '',
            pageSize: 10,   // 每页条数
            page: 1,   // 页码
            ownerDataSource: [], // 责任人
            isLoading: false,  // 搜索责任制时，loding
            selectedOwner: {},  // 用来保存被选中的责任人
            total: 0,
            assetid: null      // 新增的保存和提交都为-1，后续操作都有真实id
        }
    }

    /**
     * 在这里初始化表单，分为新增和修改两种情况
     *  
     */
    componentWillMount() {
        const { setFieldsValue, setFields } = this.props.form
        const { assetid } = this.props

        // 资产类型
        this.fetchAssetTypeData()
        // 区域类型
        this.fetchAssetAreaData()

        /**
         * assetid == -1  新增
         * 
         */
        if (assetid == -1) {
            // 初始化asseetid，这个是表单隐性参数
            this.state.assetid = -1

            setFieldsValue({
                landunit: '平方米',
                coveredunit: '平方米'
            })

            // 台账编号、录入时间
            this.fetchInfo()
        }

        /**
         * assetid != -1  修改
         * 
         */
        if (assetid != -1) {
            // 初始化asseetid，这个是表单隐性参数
            this.state.assetid = assetid
            // 获取资产信息
            let assetInfoPromise = this.fetchAssetInfoById()

            assetInfoPromise.then((assetInfo) => {
                console.log('assetInfo:', assetInfo)
                const {
                    assetname, originalprice,
                    assetspec, isinformation,
                    parameternumber, owner,
                    assetdeplist, guaranteeperiod,
                    inputdate, supplier,
                    memo,
                    assettypelist, assetarealist,  // 资产类型、区域，需要处理 
                    enabledate,  //启用时间
                    coveredarea, coveredunit, landarea, landunit
                } = assetInfo

                setFieldsValue({
                    assetname,
                    originalprice: originalprice + '',
                    assetspec, isinformation,
                    parameternumber, owner,
                    assetdeplist,
                    guaranteeperiod: guaranteeperiod ? (guaranteeperiod + '') : '',
                    inputdate, supplier,
                    memo,
                    coveredarea, coveredunit, landarea, landunit,
                    assettypelist: assettypelist.split('/'),
                    assetarealist: assetarealist.split('/'),
                    enabledate: moment(enabledate)
                })
            })


        }


    }

    /**
     * 根据id获取资产信息
     *  http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/selectAssetById
     */
    fetchAssetInfoById() {
        const { assetid } = this.state
        return new Promise((resolve, reject) => {
            xhr('post', paths.leasePath + '/assetcs/selectAssetById', { assetid }, (res) => {
                if (res.result == 'success') {
                    // 如果获取数据成功，返回获取到的数据
                    resolve(res.data)
                } else {
                    // 如果获取数据失败，直接报错,不需要返回数据
                    errHandler(res.msg)
                }
            })
        })

    }

    /**
     * 提交前处理一些需要处理的数据格式，验证
     *  返回处理后的数据
     * 
     */
    handleSubmit() {
        const { getFieldsValue, validateFieldsAndScroll } = this.props.form
        // 待提交的字段
        let submitValues = getFieldsValue()
        console.log('submitValues:', submitValues)
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                /**
                 * 在这里处理、判断待提交的字段
                 * 
                 *  */

                // 资产分类
                submitValues.assettypelist = submitValues.assettypelist.join('/')

                //  存放位置
                submitValues.assetarealist = submitValues.assetarealist.join('/')

                // 启用时间
                if (submitValues.enabledate) {
                    submitValues.enabledate = submitValues.enabledate.format('YYYY-MM-DD HH:mm:ss')
                }

                // id
                submitValues.assetid = this.state.assetid
                console.log('待提交的字段1111111：', submitValues)

                xhr('post', paths.leasePath + '/assetcs/submitAssetFlowModel', submitValues, (res) => {
                    if (res.result == 'success') {
                        this.handleCancel()
                    } else {
                        errHandler(res.msg)
                    }
                })
                // return submitValues
            }
        })

    }

    /**
     * 提交
     * 
     */
    handleSubmitArgument() {
        // 处理后的参数
        const formInfo = this.handleSubmitArgument()
        console.log('formInfo:', formInfo)
        xhr('post', paths.leasePath + '/assetcs/submitAssetFlowModel', formInfo, (res) => {
            if (res.result == 'success') {
                this.handleCancel()
            } else {
                errHandler(res.msg)
            }
        })
    }

    /**
     * 保存
     *  保存的时候不需要进行格式判断
     *  http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/insertAsset
     * 
     */
    handleSave() {

        const { getFieldsValue, validateFieldsAndScroll } = this.props.form
        // 待提交的字段
        const submitValues = getFieldsValue()

        // 保存不需要判断对错，但是资产分类、存放位置、启动时间需要处理一下格式
        if (submitValues.assettypelist) {  // 资产分类
            submitValues.assettypelist = submitValues.assettypelist.join('/')
        }
        if (submitValues.assetarealist) {   // 存放位置
            submitValues.assetarealist = submitValues.assetarealist.join('/')
        }
        // 启用时间
        if (submitValues.enabledate) {
            submitValues.enabledate = submitValues.enabledate.format('YYYY-MM-DD HH:mm:ss')
        }

        // id
        submitValues.assetid = this.state.assetid
        console.log('待保存的字段：', submitValues)

        xhr('post', paths.leasePath + '/assetcs/insertAsset', submitValues, (res) => {
            if (res.result == 'success') {
                history.back()
            } else {
                errHandler(res.msg)
            }
        })
    }

    /**
     * 取消
     *  回退到列表页
     * 
     */
    handleCancel() {
        history.back()
    }


    /**
     * 查询资产分类数据
     * http://myportaltest.tf56.com:8080/tfPassParkAdmin/assettypecs/selectAssetTypeBySite 
     * */
    fetchAssetTypeData() {
        xhr('post', paths.leasePath + '/assettypecs/selectAssetTypeBySite', {}, (res) => {
            /**
             * res.result  success/error
             * res.data.data  真实数据，需要防止""
             *  */
            if (res.result == 'success') {
                // 请求成功后，需要判断是否有数据。一定会有rank == 2的几条初始化数据，如果没有则说明没有初始化配置
                if (res.data.count > 0) {
                    const { addAssetType } = this.props
                    // 资产类型区分   
                    const tree = this.sliceAssetType(parseArrayToTree(res.data.data))
                    // 更新资产类型树
                    this.setState({
                        assetTypeTree: tree
                    })
                } else { // 没有数据时
                    notification.warn({
                        message: '暂无初始化配置信息 请联系管理员!'
                    })
                }
            } else if (res.result == 'error') {
                /**
                 * 如果报错，弹出错误提示 res.msg
                 *  */
                errHandler('获取资产分类信息失败!')
                console.log('获取资产分类信息失败!', res.msg)
            }


        })
    }

    /**
     * 资产分三种类型，新增时需要根据实际情况显示
     *  tree是一个数组，[ {..., children: [{?}]} ]
     */
    sliceAssetType(tree) {

        const { addAssetType } = this.props
        const children = tree[0].children

        let assetTypeTree = children.filter((v) => {
            if (addAssetType == 1 && v.value == '动产') {
                return true
            } else if (addAssetType == 2 && v.value == '不动产') {
                return true
            } else if (addAssetType == 3 && v.value == '低值易耗品') {
                return true
            }
            return false
        })

        tree[0].children = assetTypeTree
        console.log(assetTypeTree)
        return tree
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
     * 查询台账变好parameternumber、基地名site、录入时间inputdate
     *  http://myportaltest.tf56.com:8080/tfPassParkAdmin/assetcs/getTimeAndSiteAndParameterNumber
     *   "type": "动产｜不动产｜低值易耗品"
     */
    fetchInfo() {
        const { addAssetType } = this.props
        const { setFieldsValue } = this.props.form
        // 新增的资产类型
        let type = ''
        addAssetType == 1 ? (type = '动产') : ('')
        addAssetType == 2 ? (type = '不动产') : ('')
        addAssetType == 3 ? (type = '低值易耗品') : ('')

        xhr('post', paths.leasePath + '/assetcs/getTimeAndSiteAndParameterNumber', { type }, (res) => {
            if (res.result == 'success') {
                console.log('台账编号: ', res.data)
                const data = res.data
                setFieldsValue({
                    parameternumber: data.parameternumber,
                    inputdate: data.inputdate
                })
            } else {
                errHandler('获取台账编号失败!')
            }
        })
    }

    /**
     * 选择责任人, 点击责任人输入框时，打开modal
     *  自动查询一下
     */
    selectOwner(e) {
        // 每一次click输入框后，主动让输入框失去焦点，保证输入框的内容只能通过单击弹出modal然后选择输入框的内容
        e.target.blur()
        this.setState({
            visible: true
        })
        this.searchOwnerByjobCard()
    }

    /**
     * 根据工号查询员工信息
     * 
     */
    searchOwnerByjobCard() {
        const { jobCard, pageSize, page } = this.state
        this.setState({
            isLoading: true
        })
        xhr('post', paths.leasePath + '/assetcs/selectDepartmentByJobCard', {
            jobcard: jobCard,
            pagesize: pageSize,
            page
        }, (res) => {
            if (res.result == 'success') {
                this.setState({
                    ownerDataSource: res.data,
                    total: res.count,
                    isLoading: false
                })
            } else {
                errHandler(res.msg)
                this.setState({
                    isLoading: false
                })
            }
        })
    }

    /** 
     * 处理搜索click
     * 
     * */
    handleOwnerByjobCard() {
        this.state.page = 1
        this.searchOwnerByjobCard()
    }

    /**
     * 责任人表格头
     *  */
    getOwnerColumns() {
        return [
            { key: 1, title: '工号', dataIndex: 'jobcard' },
            { key: 2, title: '姓名', dataIndex: 'realname' },
            { key: 3, title: '责任部门', dataIndex: 'departmentname' },
            { key: 4, title: '类型', dataIndex: 'usertype' }
        ]
    }

    /**
     * 选择责任人的modal的取消
     *  关闭modal时，清空modal中数据
     */
    handleModalCancel() {
        this.setState({
            visible: false,
            page: 1,
            jobCard: '',
            ownerDataSource: []
        })
    }

    /**
     * 选择责任人的modal的确定
     *  设置责任人、责任部门
     */
    handleModalOk() {
        const { setFieldsValue, setFields } = this.props.form
        // 设置责任人、责任部门
        setFieldsValue(this.state.selectedOwner)
        // 关闭modal
        this.handleModalCancel()
    }

    /**
     * 处理table的行clicked
     *  keys是下标数组，items是被选中行数组
     */
    handleTableRowClick(keys, items) {
        // 被选中的行数据
        const item = items[0]
        // 将被选中行的所表达的数据中需要的信息设置到this.state的selectedOwner
        this.setState({
            selectedOwner: {
                owner: item.username,
                assetdeplist: item.departmentname
            }
        })
    }

    /**
     * 处理翻页事件
     *  page时目标页的页码
     */
    parentHandlePageChange(page) {

        this.state.page = page
        this.searchOwnerByjobCard()
    }

    /**
     * 渲染
     * 
     */
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            style: { width: '100%' }
        }
        const colAttr = {
            span: 6,
            style: { height: '60px' }
        }
        const { getFieldDecorator } = this.props.form
        // addAssetType 1｜2｜3 分别是：动产｜不动产｜低值易耗品
        const { addAssetType } = this.props
        return (
            <Form inline>
                <Row>

                    <Col { ...colAttr }>
                        <FormItem label="资产名称" { ...formItemLayout }>
                            {getFieldDecorator('assetname', {
                                rules: [{ required: true, message: '必填填写资产名称' }],
                            })(
                                <Input placeholder="请输入资产名称" />
                                )}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="价格/元" { ...formItemLayout }>
                            {getFieldDecorator('originalprice', {
                                rules: [{ type: 'string', required: true, message: '必须填写资产价格' }]
                            })(<Input placeholder="请输入资产价格" />)}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="规格型号" { ...formItemLayout }>
                            {getFieldDecorator('assetspec', {
                                rules: [{}]
                            })(<Input placeholder="请输入资产的规格型号" />)}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="资产分类" { ...formItemLayout }>
                            {getFieldDecorator('assettypelist', {
                                rules: [{ type: 'array', required: true, message: '资产分类为必填行项' }]
                            })(
                                <Cascader
                                    showSearch={true}
                                    options={this.state.assetTypeTree}
                                    placeholder="请选择资产的类型" />
                                )}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="是否信息化" { ...formItemLayout }>
                            {getFieldDecorator('isinformation', {
                                rules: [{ required: true, message: '请选择是否信息化' }]
                            })(
                                <Select
                                    placeholder="请选择是否信息化">
                                    <Option value="信息化">信息化</Option>
                                    <Option value="非信息化">非信息化</Option>
                                </Select>
                                )}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="台账编号" { ...formItemLayout }>
                            {getFieldDecorator('parameternumber', {
                                rules: []
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="存放位置" { ...formItemLayout }>
                            {getFieldDecorator('assetarealist', {
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
                            {getFieldDecorator('owner', {
                                rules: [{ required: true, message: '请选择责任人' }]
                            })(
                                <Input onClick={this.selectOwner.bind(this)} />
                                )}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="责任部门" { ...formItemLayout }>
                            {getFieldDecorator('assetdeplist', {
                                rules: []
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    {
                        // 动产、低值易耗品有“启动时间”字段，不动产没有
                        (addAssetType == 1 || addAssetType == 3)
                            ? (
                                <Col { ...colAttr }>
                                    <FormItem label="启用时间" { ...formItemLayout }>
                                        {getFieldDecorator('enabledate', {
                                            rules: [{ type: 'object', message: '请选择启用时间' }]
                                        })(
                                            <DatePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                                            )}
                                    </FormItem>
                                </Col>
                            )
                            : ('')
                    }

                    <Col { ...colAttr }>
                        <FormItem label="质保期/年" { ...formItemLayout }>
                            {getFieldDecorator('guaranteeperiod', {
                                rules: [{ type: 'string' }]
                            })(
                                <Input placeholder="请输入保质期/年" />
                                )}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="录入时间" { ...formItemLayout }>
                            {getFieldDecorator('inputdate', {
                                rules: [{}]
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col { ...colAttr }>
                        <FormItem label="供应商" { ...formItemLayout }>
                            {getFieldDecorator('supplier', {
                                rules: []
                            })(<Input placeholder="请输入供应商" />)}
                        </FormItem>
                    </Col>

                    {
                        // 不动产才需要填写 土地面积、建筑面积
                        (addAssetType == 2)
                            ? (<Col span={24}>
                                <Col { ...colAttr }>
                                    <Col span={16}>
                                        <FormItem label="土地面积" labelCol={{ span: 13 }} wrapperCol={{ span: 11 }}>
                                            {getFieldDecorator('landarea', {
                                                rules: []
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }}>
                                            {getFieldDecorator('landunit', {
                                                rules: []
                                            })(
                                                <Select>
                                                    <Option value="平方米">平方米</Option>
                                                    <Option value="平方千米">平方千米</Option>
                                                    <Option value="亩">亩</Option>
                                                    <Option value="公顷">公顷</Option>
                                                    <Option value="顷">顷</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Col>
                                <Col { ...colAttr }>
                                    <Col span={16}>
                                        <FormItem label="建筑面积" labelCol={{ span: 13 }} wrapperCol={{ span: 11 }}>
                                            {getFieldDecorator('coveredarea', {
                                                rules: []
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }}>
                                            {getFieldDecorator('coveredunit', {
                                                rules: []
                                            })(
                                                <Select>
                                                    <Option value="平方米">平方米</Option>
                                                    <Option value="平方千米">平方千米</Option>
                                                    <Option value="亩">亩</Option>
                                                    <Option value="公顷">公顷</Option>
                                                    <Option value="顷">顷</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Col>
                            </Col>)
                            : ('')
                    }

                </Row>

                <Row>
                    <Col span={24}>
                        <FormItem label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 10 }} style={{ width: '100%' }}>
                            {getFieldDecorator('memo', {
                                rules: []
                            })(<Input type="textarea" />)}
                        </FormItem>
                    </Col>
                </Row>

                <br /><br />
                <Row>
                    <Col span={2}></Col>
                    <Col span={22}>
                        <Button type="primary" onClick={this.handleSave.bind(this)}>保存</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="default" onClick={this.handleSubmit.bind(this)}>提交</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="default" onClick={this.handleCancel.bind(this)}>取消</Button>
                    </Col>
                </Row>
                <br /><br />

                <Row>
                    <Modal
                        width="60%"
                        onCancel={this.handleModalCancel.bind(this)}
                        onOk={this.handleModalOk.bind(this)}
                        visible={this.state.visible}
                        title="选择责任人">
                        <Row>
                            <Col span={12}>
                                <Input
                                    value={this.state.jobCard}
                                    onChange={(e) => { this.setState({ jobCard: e.target.value }) } } />
                            </Col>
                            <Col span={5} offset={1}>
                                <Button type="primary" onClick={this.handleOwnerByjobCard.bind(this)}>搜索</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            {/** 表格 */}
                            <InnerTable
                                loading={this.state.isLoading}
                                columns={this.getOwnerColumns()}
                                dataSource={this.state.ownerDataSource}
                                ref="owner"
                                rowClassName="owner"
                                parentHandleRowClick={this.handleTableRowClick.bind(this)}
                                isRowSelection={false}
                                bordered={true}
                                size="middle"
                                pagination={false} />
                            {/** 翻页 */}
                            <InnerPagination
                                total={this.state.total}
                                pageSize={this.state.pageSize}
                                skipCount={this.state.page}
                                parentHandlePageChange={this.parentHandlePageChange.bind(this)} />
                        </Row>

                    </Modal>
                </Row>
            </Form>
        )
    }
}

export default Form.create()(AssetForm)