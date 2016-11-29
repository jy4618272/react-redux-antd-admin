// ================================
// 租赁管理-合同-合同审批详情
// ================================
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import {
    Form,
    Tabs,
    Button,
    message,
    notification
} from 'antd'
const TabPane = Tabs.TabPane

import {
    Err,
    Title,
    Loading,
    FormLayout,
    InnerTable,
    InnerPagination,
    WorkFlow,
    ApprovalOpinions
} from 'COMPONENT'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import { filterQueryObj } from 'UTIL'

// action
import action from 'ACTION/approval'
import actionBusiLease from 'ACTION/busiLease'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch),
    actionBusiLease: bindActionCreators(actionBusiLease, dispatch),
})

@connect(
    ({ approval, busiLease }) => ({ approval, busiLease }),
    mapDispatchToProps
)
class ApprovalDetail extends Component {
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
            res: {},
            approvalData: {}
        }

        console.log('我的待办详情props:', props)
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
        const type = props.location.query.type
        const tableName = route.tableName
        const commonName = route.commonName

        if (commonName) {
            console.info('init component approval with commonName = %s', commonName)
        } else {
            console.error('can not find commonName, check your router config')
            this.inited = false // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.commonName = commonName

        try {
            if (type === 'rentpact' || type === 'rentpactBG') {
                // 合同新增审批
                this.contractShowSchema = require(`SCHEMA/${commonName}/contract.showSchema.js`)
                console.log(this.contractShowSchema)
            } else if (type === 'rentpactTK') {
                // 合同退款审批
                this.contractRentShowSchema = require(`SCHEMA/${commonName}/contract.rentShowSchema.js`)
                console.log(this.contractRentShowSchema)
            } else if (type === 'margin') {
                // 保证金新增审批
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

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount, fetchHandle) => {
        const tmpObj = Object.assign({}, queryObj)
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount
        fetchHandle(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = () => {
        const {
            params,
            location,
            actionBusiLease,
            busiLease
        } = this.props
        const id = params.id
        const type = location.query.type
        console.log('参数：', id, type)

        if (type === 'rentpactBG') {
            this.select({
                businessno: id
            }, 10, 0, actionBusiLease.fetchContractHistoryShow)
        }
    }

    // 分页
    handlePageChange = (page) => {
        const {
            params,
            location,
            actionBusiLease,
            busiLease
        } = this.props
        const id = params.id
        const type = location.query.type
        console.log('参数：', id, type)

        page = (page < 1) ? 0 : (page - 1) * 10
        if (type === 'rentpactBG') {
            this.select({
                businessno: id
            }, busiLease.changeHistory.pageSize, page, actionBusiLease.fetchContractHistoryShow)
        }
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
        const { dataAttachment } = this.state
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
                const approvalDatas = this.state.approvalData
                const { form } = this.props
                const oldObj = form.getFieldsValue()

                const newObj = filterQueryObj({
                    businessno: this.props.params.id,
                    nodestatus: oldObj['nodestatus'],
                    nodecontent: oldObj['nodecontent']
                })

                console.log('保存表单字段newObj:', newObj)
                const tmp = Object.assign({}, approvalDatas, newObj, {
                    pactkind: this.state.rentpact.modelname
                })
                console.log('保存表单字段tmp：', tmp)

                xhr('post', paths.workFlowPath + '/flownodecs/submitTaskPMSTwo', tmp, (res) => {
                    const hide = message.loading('正在查询...', 0)
                    console.log('保存审批数据：', res)
                    if (res.result === 'success') {
                        hide()
                        notification.success({
                            message: '审核成功',
                            description: `【${this.state.approvalData.flowname}】审核成功`
                        })
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
            params,
            location,
            form,
            action
        } = this.props
        const id = params.id
        const type = location.query.type
        console.log('参数：', id, type)

        this.setState({
            approvalData: JSON.parse(sessionStorage.getItem('approvalData'))
        })

        if (type === 'rentpactBG') {
            // 合同变更详情
            xhr('post', paths.workFlowPath + '/flowrecordcs/selectRentPactBGFlowDetailsByBusinessNo', {
                businessno: id
            }, (res) => {
                const hide = message.loading('正在查询...', 0)
                console.log(type + '变更的详情：', res)
                if (res.result === 'success') {
                    hide()
                    this.setState({
                        loading: false,
                        res: res.data,
                        rentpact: res.data.rentpact,
                        stagesTableData: res.data.rentpactpayplanfullinfos,
                        dataAttachment: res.data.rentpactattachments
                    })
                    const oldObj = res.data.rentpact
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
                    form.setFieldsValue(newObj)

                    // 流程
                    action.fetchApprovalWorkFlow({
                        businessno: id,
                        pactkind: res.data.rentpact.pactkind // 合同
                    })

                    // 审批意见
                    action.fetchApprovalOpinions({
                        businessno: id,
                        pactkind: res.data.rentpact.pactkind // 合同
                    })
                } else {
                    hide()
                    errHandler(res.msg)
                }
            })

            // 合同变更历史详情
            this.refresh()
        } else {
            // 出合同变更外的详情
            xhr('post', paths.workFlowPath + '/flowrecordcs/selectFlowDetailsByBusinessNo', {
                businessno: id,
                pageSize: 10,
                skipCount: 0
            }, (res) => {
                const hide = message.loading('正在查询...', 0)
                console.log(type + '的详情：', res)
                if (res.result === 'success') {
                    hide()
                    this.setState({
                        loading: false,
                        res: res.data
                    })
                    let oldObj

                    if (type === 'rentpactBG') {
                        // 变更分页

                    } else {
                        // 除变更外的详情
                        if (type === 'rentpact') {
                            // 合同新增审批
                            this.setState({
                                rentpact: res.data.rentpact,
                                stagesTableData: res.data.rentpactpayplanfullinfos,
                                dataAttachment: res.data.rentpactattachments
                            })
                            oldObj = res.data.rentpact

                            // 流程
                            action.fetchApprovalWorkFlow({
                                businessno: id,
                                pactkind: res.data.rentpact.pactkind // 合同
                            })

                            // 审批意见
                            action.fetchApprovalOpinions({
                                businessno: id,
                                pactkind: res.data.rentpact.pactkind // 合同
                            })
                        } else if (type === 'rentpactTK') {
                            // 合同退租审批
                            oldObj = res.data
                            // 流程
                            action.fetchApprovalWorkFlow({
                                businessno: id,
                                pactkind: res.data.pactkind // 合同
                            })

                            // 审批意见
                            action.fetchApprovalOpinions({
                                businessno: id,
                                pactkind: res.data.pactkind // 合同
                            })
                        } else if (type === 'margin') {
                            // 保证金新增审批
                            oldObj = res.data
                            // 流程
                            action.fetchApprovalWorkFlow({
                                businessno: id
                            })

                            // 审批意见
                            action.fetchApprovalOpinions({
                                businessno: id
                            })
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

                        form.setFieldsValue(newObj)
                    }
                } else {
                    hide()
                    errHandler(res.msg)
                }
            })
        }
    }

    render() {
        const { location, form, approval } = this.props
        const { loading, res, approvalData } = this.state
        const type = location.query.type

        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }

        if (type === 'rentpact' || type === 'rentpactBG') {
            // 合同退租审批详情
            if (loading) {
                return <Loading />
            }

            const tableStagesColumns = this.contractShowSchema['stages']['columns'].concat([{
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                </div>
            }])

            const tableAttachmentColumns = this.contractShowSchema['attachment']['columns'].concat([{
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <a href="javascript:;" className="s-blue" onClick={this.handleViewDoc.bind(this, text, record, index)} >下载</a>
            }])

            let contractChangeTable = ''

            if (type === 'rentpactBG') {
                const { busiLease } = this.props
                contractChangeTable = <div className="padding-lr g-mb20">
                    <InnerTable
                        columns={busiLease.changeHistory['tableColumns']}
                        dataSource={busiLease.changeHistory.tableData}
                        bordered={true}
                        pagination={false} />
                    <InnerPagination
                        total={busiLease.changeHistory.total}
                        pageSize={busiLease.changeHistory.pageSize}
                        skipCount={busiLease.changeHistory.skipCount}
                        parentHandlePageChange={this.handlePageChange} />
                </div>
            }

            return (
                <section className="padding g-mt20">
                    <Title style="g-tac g-mb10" title={approvalData.flowname} />
                    <Form horizontal>
                        {/* 获取合同模板 */}
                        <FormLayout
                            schema={this.contractShowSchema['contractFrom']}
                            form={form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 流程 */}
                        <section className="g-border-bottom">
                            <WorkFlow flow={approval.workFlow} />
                        </section>

                        {/* 客户名称 */}
                        <div className="g-border-bottom">
                            <FormLayout schema={this.contractShowSchema['organization']} form={form} />
                        </div>

                        {/* 合同号 */}
                        <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                            <TabPane tab="合同房间" key="room" >
                                <div className="padding-lr g-mb20" >
                                    <InnerTable columns={this.contractShowSchema['room']['columns']}
                                        dataSource={res.rentpactrooms}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同班线" key="classLine">
                                <div className="padding-lr g-mb20" >
                                    <InnerTable columns={this.contractShowSchema['line']['columns']}
                                        dataSource={res.rentpactlines}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同优惠冲抵" key="policy">
                                <div className="padding-lr g-mb20" >
                                    <InnerTable columns={this.contractShowSchema['policy']['columns']}
                                        dataSource={res.rentpactpromotions}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="履约保证金冲抵"
                                key="contractBond" >
                                <div className="padding-lr g-mb20" >
                                    <InnerTable columns={this.contractShowSchema['contractBond']['columns']}
                                        dataSource={res.offsetmargins}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同附件" key="contractAttachment" >
                                <div className="padding-lr g-mb20" >
                                    <InnerTable columns={tableAttachmentColumns}
                                        dataSource={res.rentpactattachments}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                        </Tabs>

                        { /* 客户数据录入*/}
                        <FormLayout schema={this.contractShowSchema['contractTabs']}
                            form={form}
                            fromLayoutStyle="g-border-bottom" />

                        { /* 分期明细 */}
                        <section className="padding-lr g-border-bottom" >
                            <div className="g-pb20" >
                                <FormLayout schema={this.contractShowSchema['stages']['form']}
                                    form={form}
                                    parentHandleSelect={this.parentHandleSelect} />
                                {this.state.isStagesShow ?
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
                                            pagination={false}
                                            />
                                    </div> : ''}

                                <InnerTable columns={tableStagesColumns}
                                    dataSource={res.rentpactpayplanfullinfos}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false}
                                    />
                            </div>
                        </section>

                        {/* 合同变更历史详情 */}
                        {contractChangeTable}

                        { /* 审批意见 */}
                        <ApprovalOpinions opinions={approval.opinions} />

                        <FormLayout schema={this.approvalShowSchema}
                            form={form} />

                        <div className="g-tac button-group" >
                            <Button type="primary"
                                disabled={this.state.isSaveDisabeld}
                                onClick={this.handleSave}>保存</Button>
                            <Button type="default"
                                onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </section>
            )
        } else if (type === 'rentpactTK') {
            // 合同退租审批详情
            if (loading) {
                return <Loading />
            }

            return (
                <section className="padding g-mt20" >
                    <Title style="g-tac g-mb10"
                        title={approvalData.flowname} />
                    <Form horizontal>
                        <section className="g-border-bottom g-pb20">
                            {/* 合同退租审批详情 */}
                            <FormLayout
                                schema={this.contractRentShowSchema['form']}
                                form={form} />

                            <InnerTable
                                columns={this.contractRentShowSchema['tableColumns']}
                                dataSource={res.rentpactrefundlist.data}
                                isRowSelection={false}
                                bordered={true}
                                pagination={false} />
                        </section>
                        {/* 审批流程 */}
                        <section className="g-border-bottom">
                            <WorkFlow flow={approval.workFlow} />
                        </section>

                        {/* 审批意见 */}
                        <ApprovalOpinions opinions={approval.opinions} />

                        {/* 审批意见操作 */}
                        <FormLayout schema={this.approvalShowSchema} form={form} />
                        <div className="g-tac button-group">
                            <Button type="primary"
                                disabled={this.state.isSaveDisabeld}
                                onClick={this.handleSave}>保存</Button>
                            <Button type="default"
                                onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </section>
            )
        } else if (type === 'margin') {
            // 保证金新增审批
            if (loading) {
                return <Loading />
            }

            return (
                <section className="padding g-mt20" >
                    <Title style="g-tac g-mb10"
                        title={approvalData.flowname} />
                    <Form horizontal>
                        {/* 保证金新增审批详情 */}
                        <FormLayout schema={this.bondShowSchema}
                            form={form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 审批流程 */}
                        <section className="g-border-bottom">
                            <WorkFlow flow={approval.workFlow} />
                        </section>

                        {/* 审批意见 */}
                        <ApprovalOpinions opinions={approval.opinions} />

                        {/* 审批意见操作 */}
                        <FormLayout schema={this.approvalShowSchema} form={form} />
                        <div className="g-tac button-group">
                            <Button type="primary"
                                disabled={this.state.isSaveDisabeld}
                                onClick={this.handleSave}>保存</Button>
                            <Button type="default"
                                onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </section>
            )
        } else {
            return <Err errorMsg="敬请期待！" />
        }
    }
}

ApprovalDetail = Form.create()(ApprovalDetail)

export default ApprovalDetail