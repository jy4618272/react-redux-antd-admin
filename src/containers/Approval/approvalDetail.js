// ================================
// 租赁管理-合同-合同审核详情
// ================================
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import {
    Form,
    Tabs,
    Select,
    Button,
    Modal,
    Input,
    Row,
    Col,
    message,
    Upload,
    Icon,
    notification,
    Radio
} from 'antd'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const RadioGroup = Radio.Group

import {
    Err,
    Title,
    Loading,
    FormLayout,
    InnerTable,
    InnerPagination,
    ModalTable,
    ModalForm,
    ConstractStagesEditModal
} from 'COMPONENT'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import action from 'ACTION/busiLease'

import {
    filterQueryObj
} from 'UTIL'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiLease, configLease }) => ({ busiLease, configLease }),
    mapDispatchToProps
)
class ContractInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabsStatus: 'room',
            tableIndex: 0,
            isStagesShow: false,
            stagesNum: 0,
            rentpact: '',
            dataAttachment: [],
            stagesTableData: [],
            stagesShowTableData: [],
            loading: true,
            res: {}
        }

        console.log('合同续租props:', props)
        this.initFetchSchema(props)
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const route = props.route
        const tableName = route.tableName
        const commonName = route.commonName
        const type = props.location.query.type

        if (commonName) {
            console.info('init component BusiLease with commonName = %s', commonName)
        } else {
            console.error('can not find commonName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.commonName = commonName

        try {
            if (type === 'rentpact') {
                this.contractShowSchema = require(`SCHEMA/${commonName}/contract.showSchema.js`)
                console.log(this.contractShowSchema)
            } else if (type === 'margin') {
                this.bondShowSchema = require(`SCHEMA/${commonName}/bond.showSchema.js`)
                console.log(this.bondShowSchema)
            }
            this.approvalShowSchema = require(`SCHEMA/${commonName}/approval.showSchema.js`)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的${type}ShowSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 合同数据来源-选项卡
    handleTabsContractFrom = (activeKey) => {
        console.log(activeKey)
        this.setState({
            tabsStatus: activeKey
        })
    }

    // 分期明细
    handleShowStages = (record) => {
        this.setState({
            isStagesShow: true,
            stagesNum: record.stagesnumber,
            stagesShowTableData: this.state.stagesTableData[record.stagesnumber - 1].rentpactpaylists
        })
    }

    // 关闭明细
    handleStagesClose = () => {
        this.setState({
            isStagesShow: false
        })
    }

    // 查看
    handleViewDoc = (text, record, index) => {
        const {dataAttachment} = this.state
        window.location.href = rootPaths.imgPath + paths.imgPath + '/' + dataAttachment[index].url
    }

    // 返回
    handleGoBack = () => {
        history.back()
    }

    // 保存全部
    handleSave = (e) => {
        e.preventDefault()
        this.setState({
            isSaveDisabeld: true
        })

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                this.setState({
                    isSaveDisabeld: false
                })
                return false
            } else {
                const arrovalContractShow = JSON.parse(sessionStorage.getItem('arrovalContractShow'))

                const {form} = this.props
                const oldObj = form.getFieldsValue()

                const newObj = filterQueryObj({
                    businessno: this.props.params.id,
                    nodestatus: oldObj['nodestatus'],
                    nodecontent: oldObj['nodecontent']
                })

                console.log('保存表单字段newObj:', newObj)
                const tmp = Object.assign({}, arrovalContractShow, newObj, {
                    pactkind: this.state.rentpact.modelname
                })
                console.log('保存表单字段tmp：', tmp)

                xhr('post', paths.workFlowPath + '/flownodecs/submitTaskPMSTwo', tmp, (res) => {
                    const hide = message.loading('正在查询...', 0)
                    console.log('保存审批数据：', res)
                    if (res.result === 'success') {
                        hide()
                        this.handleGoBack()
                    } else {
                        hide()
                        errHandler(res.msg)
                    }
                    this.setState({
                        isSaveDisabeld: false
                    })
                })
            }
        })
    }

    componentDidMount() {
        const {
            action,
            params,
            location
        } = this.props

        const id = params.id
        const type = location.query.type
        console.log('参数：', id, type)

        xhr('post', paths.workFlowPath + '/flowrecordcs/selectFlowDetailsByBusinessNo', {
            businessno: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('财务详情', res)
            if (res.result === 'success') {
                hide()
                this.setState({
                    loading: false,
                    res: res.data
                })
                let oldObj
                if (type === 'rentpact') {
                    this.setState({
                        rentpact: res.data.rentpact,
                        stagesTableData: res.data.rentpactpayplanfullinfos,
                        dataAttachment: res.data.rentpactattachments
                    })
                    oldObj = res.data.rentpact
                } else if (type === 'margin') {
                    oldObj = res.data
                }

                const newObj = {}
                for (const key in oldObj) {
                    if (key.indexOf('date') > -1) {
                        newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
                    } else if (key.indexOf('totalstages') > -1) {
                        newObj[key] = oldObj[key] + '期'
                    } else {
                        newObj[key] = oldObj[key]
                    }
                }
                this.props.form.setFieldsValue(newObj)
            } else {
                hide()
                errHandler(res.msg)
            }
        })
    }

    render() {
        const { location } = this.props
        const { loading, res } = this.state
        const type = location.query.type
        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }

        // 合同新增审批
        if (loading) {
            return <Loading />
        }

        if (type === 'rentpact') {
            const tableStagesColumns = this.contractShowSchema['stages']['columns'].concat([
                {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index) => <div className="button-group">
                        <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                    </div>
                }
            ])

            const tableAttachmentColumns = this.contractShowSchema['attachment']['columns'].concat([
                {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index) => <a href="javascript:;" className="s-blue" onClick={this.handleViewDoc.bind(this, text, record, index)}>下载</a>
                }
            ])

            return (
                <section className="padding g-mt20">
                    <Title style="g-tac g-mb10" title="合同新增审批" />
                    <Form horizontal>
                        {/* 获取合同模板 */}
                        <FormLayout
                            schema={this.contractShowSchema['contractFrom']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 客户名称 */}
                        <div className="g-border-bottom">
                            <FormLayout
                                schema={this.contractShowSchema['organization']}
                                form={this.props.form} />
                        </div>

                        {/* 合同号 */}
                        <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                            <TabPane tab="合同房间" key="room">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['room']['columns']}
                                        dataSource={res.rentpactrooms}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同班线" key="classLine">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['line']['columns']}
                                        dataSource={res.rentpactlines}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同优惠冲抵" key="policy">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['policy']['columns']}
                                        dataSource={res.rentpactpromotions}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="履约保证金冲抵" key="contractBond">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['contractBond']['columns']}
                                        dataSource={res.offsetmargins}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同附件" key="contractAttachment">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={tableAttachmentColumns}
                                        dataSource={res.rentpactattachments}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>

                        </Tabs>

                        {/* 客户数据录入*/}
                        <FormLayout
                            schema={this.contractShowSchema['contractTabs']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 分期明细 */}
                        <div className="padding-lr g-mb20">
                            <FormLayout
                                schema={this.contractShowSchema['stages']['form']}
                                form={this.props.form}
                                parentHandleSelect={this.parentHandleSelect} />

                            {
                                this.state.isStagesShow ?
                                    <div className="m-stages-show">
                                        <h2>{`第${this.state.stagesNum}期明细`}</h2>
                                        <div className="button-group g-mb10">
                                            <Button onClick={this.handleStagesClose}>关闭明细</Button>
                                        </div>
                                        <InnerTable
                                            columns={this.contractShowSchema['stages']['showColumns']}
                                            dataSource={this.state.stagesShowTableData}
                                            bordered={true}
                                            size="middle"
                                            tableStyle="m-table"
                                            pagination={false} />
                                    </div> :
                                    ''
                            }

                            <InnerTable
                                columns={tableStagesColumns}
                                dataSource={res.rentpactpayplanfullinfos}
                                bordered={true}
                                parentHandleClick={this.parentHandleClick}
                                pagination={false} />
                        </div>

                        <FormLayout
                            schema={this.approvalShowSchema}
                            form={this.props.form} />

                        <div className="g-tac button-group">
                            <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSave}>保存</Button>
                            <Button type="default" onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </section>
            )
        } else if (type === 'margin') {
            // 保证金新增审批
            return (
                <section className="padding g-mt20">
                    <Title style="g-tac g-mb10" title="履约保证金新增审批" />
                    <Form horizontal>
                        <FormLayout
                            schema={this.bondShowSchema}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />
                        <FormLayout
                            schema={this.approvalShowSchema}
                            form={this.props.form} />
                        <div className="g-tac button-group">
                            <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSave}>保存</Button>
                            <Button type="default" onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </section>
            )
        } else {
            return <Err errorMsg="类型不存在" />
        }
    }
}

ContractInsert = Form.create({})(ContractInsert)

export default ContractInsert
