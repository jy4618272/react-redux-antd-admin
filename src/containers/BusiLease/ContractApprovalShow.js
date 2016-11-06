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


import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    Loading,
    FormLayout,
    InnerTable,
    InnerPagination,
    ModalTable,
    ModalForm,
    ConstractStagesEditModal
} from 'COMPONENT'

import {
    filterQueryObjMoment
} from 'UTIL'

import './contractAdd.less'

import action from 'ACTION/busiLease'

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
            approvalvalue: '',
            isStagesShow: false,
            stagesNum: 1,
            stagesShowTableData: [],
            isSaveDisabeld: false
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
        const routes = props.routes
        const tableName = routes.pop().tableName

        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.contractAddSchema.js`)
            this.approvalShowSchema = require(`SCHEMA/${tableName}/${tableName}.approvalShowSchema.js`)
            this.stagesSchema = require(`SCHEMA/${tableName}/${tableName}.contractStagesSchema.js`)
            console.log(this.approvalShowSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractapprovalSchema出错, 请检查配置`
            return false
        }
    }

    // 表格按钮点击
    parentHandleClick = (key) => {
        if (key === 'defaultStagesShowClose') {
            this.setState({
                isStagesShow: false
            })
        }
    }


    // 明细    
    handleShowStages = (record) => {
        this.setState({
            isStagesShow: true,
            stagesNum: record.stagesnumber,
            stagesShowTableData: record.rentpactpaylists
        })
    }

    // 取消
    handleGoBack = () => {
        hashHistory.push('busi/busi_lease')
    }

    handleApprovalChange = (e) => {
        this.setState({
            approvalvalue: e.target.value,
        })
    }

    // 渲染前调用一次
    componentDidMount() {
        const {action} = this.props

        const id = this.props.params.id
        action.fetchApprovalShow({
            businessno: id
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {
            contractApprovalShow
        } = this.props.busiLease

        const newObj = filterQueryObjMoment(contractApprovalShow.data.rentpact)

        const {modalName} = this.state
        let modalContent = ''

        if (modalName === 'stagesModal') {
            modalContent = <ModalForm
                ref="stagesModal"
                schema={this.stagesSchema.tableSchema} />
        } else if (modalName === 'stagesShowModal') {
            modalContent = <ModalForm
                ref="stagesShowModal"
                schema={this.stagesSchema.tableShowSchema} />
        }

        const tableStagesColumns = this.approvalShowSchema['stagesColumns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <a href="javascript:;" className="s-blue" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>

            }
        ])

        if (contractApprovalShow.loading) {
            return <Loading />
        }

        return (
            <section className="padding m-contract-add g-mt20">
                <Form horizontal>
                    {/* 获取合同模板 */}
                    <FormLayout
                        schema={this.approvalShowSchema['contractFrom']}
                        form={this.props.form}
                        setFields={newObj}
                        fromLayoutStyle="g-border-bottom" />

                    {/* 客户名称 */}
                    <div className="g-border-bottom">
                        <FormLayout
                            schema={this.approvalShowSchema['organization']}
                            form={this.props.form} />
                    </div>

                    {/* 合同号 */}
                    <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                        <TabPane tab="合同房间" key="room">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={this.addSchema['room']['columns']}
                                    dataSource={contractApprovalShow.data.rentpactrooms}
                                    bordered={true}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同班线" key="classLine">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={this.addSchema['line']['columns']}
                                    dataSource={contractApprovalShow.data.rentpactlines}
                                    bordered={true}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同优惠冲抵" key="policy">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={this.addSchema['policy']['columns']}
                                    dataSource={contractApprovalShow.data.rentpactpromotions}
                                    bordered={true}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="履约保证金冲抵" key="contractBond">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={this.addSchema['contractBond']['columns']}
                                    dataSource={contractApprovalShow.data.offsetmargins}
                                    bordered={true}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同附件" key="contractAttachment">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={this.addSchema['attachment']['columns']}
                                    dataSource={contractApprovalShow.data.rentpactattachments}
                                    bordered={true}
                                    pagination={false} />
                            </div>
                        </TabPane>
                    </Tabs>

                    {/* 客户数据录入 */}
                    <FormLayout
                        schema={this.approvalShowSchema['contractTabs']}
                        form={this.props.form}
                        fromLayoutStyle="g-border-bottom" />

                    {/*分期明细 */}
                    <div className="padding-lr g-mb20">
                        <FormLayout
                            schema={this.approvalShowSchema['stages']['form']}
                            form={this.props.form} />

                        {
                            this.state.isStagesShow ?
                                <div className="m-stages-show">
                                    <h2>{`第${this.state.stagesNum}期明细`}</h2>
                                    <InnerTable
                                        columns={this.approvalShowSchema.stagesShowColumns}
                                        dataSource={this.state.stagesShowTableData}
                                        schema={this.approvalShowSchema.stagesShowControl}
                                        bordered={true}
                                        size="middle"
                                        tableStyle="m-table"
                                        parentHandleClick = {this.parentHandleClick}
                                        pagination={false} />
                                </div> :
                                ''
                        }

                        <InnerTable
                            columns={tableStagesColumns}
                            dataSource={contractApprovalShow.data.rentpactpayplanfullinfos}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                    </div>

                    <div>
                        <FormLayout
                            schema={this.approvalShowSchema['approval']}
                            form={this.props.form} />
                    </div>
                    <div className="g-tac button-group">
                        <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSaveAll} parentHandleRowClick={() => { console.log(3) } }>确认提交</Button>
                        <Button type="default" onClick={this.handleGoBack}>返回</Button>
                    </div>
                </Form>
            </section>
        )
    }
}

ContractInsert = Form.create()(ContractInsert)

export default ContractInsert