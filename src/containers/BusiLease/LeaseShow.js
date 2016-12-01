import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
    Form,
    Modal,
    Tabs,
    message,
    Button,
    notification
} from 'antd'
const TabPane = Tabs.TabPane
import moment from 'moment'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    Err,
    Loading,
    WorkFlow,
    InnerTable,
    FormLayout
} from 'COMPONENT'


// action
import action from 'ACTION/approval'
const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ approval }) => ({ approval }),
    mapDispatchToProps
)
class FinanceShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabsStatus: 'room',
            tableIndex: 0,
            isStagesShow: false,
            stagesNum: 0,
            dataAttachment: [],
            stagesTableData: [],
            stagesShowTableData: [],
            loading: true,
            res: {}
        }
        console.log('财务详情props', props)


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
        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        if (commonName) {
            console.info('init component BusiLease with commonName = %s', commonName)
        } else {
            console.error('can not find commonName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到公共表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName
        this.commonName = commonName

        try {
            this.contractShowSchema = require(`SCHEMA/${commonName}/contract.showSchema.js`)
            console.log('合同详情：', this.contractShowSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${commonName}表的showSchema出错, 请检查配置`
            return false
        }
        this.inited = true;
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


    componentDidMount() {
        const {
            action,
            params,
            location
        } = this.props

        const id = params.id
        const type = location.query.type
        const paytype = location.query.paytype
        console.log('参数：', id, type)

        xhr('post', paths.leasePath + '/rentpactfullinfocs/selectRentPactFullInfoById', {
            rentpactid: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('合同详情', res)
            if (res.result === 'success') {
                hide()
                this.setState({
                    loading: false,
                    res: res.data
                })
                if (type === 'rentpact') {
                    this.setState({
                        stagesTableData: res.data.rentpactpayplanfullinfos,
                        dataAttachment: res.data.rentpactattachments
                    })
                    const oldObj = res.data.rentpact

                    // 流程
                    action.fetchApprovalWorkFlowService({
                        id: id,
                        servicetype: type ==='rentpact' ? '合同' : '履约保证金'
                    })

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
                }
            } else {
                hide()
                errHandler(res.msg)
            }
        })

        // DOM挂载完成后，获取合同数据，然后写入localStorage
        this.getPrintContractData()
    }
    /**
     * 获取合同数据
     *  合同模版是通过富文本编辑器编辑的，所见即所得，通过ajax获取之后直接放到localStorage中
     *  DOM挂载完成后，获取合同数据，然后写入localStorage，所以需要在componentDidMount中调用此方法
     *  */ 
    getPrintContractData() {
        /**
         * 获取合同数据
         *  获取id
         */
        const { id } = this.props.params
        
        xhr('post', paths.leasePath + '/pactprintmodelcs/getPrintTextByRentPactId', {
            rentpactid: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            if (res.result == 'success') {
                hide()
                // 存到localStorage
                localStorage.setItem('printContent', res.data)
            } else {
                hide()
                errHandler(res.msg)
            }
        })
    }

    render() {
        const { location, approval } = this.props
        const { loading, res } = this.state
        const type = location.query.type
        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }
        if (type === 'rentpact') {
            if (loading) {
                return <Loading />
            }
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
                <section>
                    <Form horizontal>
                        {/* 获取合同模板 */}
                        <FormLayout
                            schema={this.contractShowSchema['contractFrom']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        { /* 流程 */}
                        <section className="g-border-bottom">
                            <WorkFlow flow={approval.workFlow} />
                        </section> 

                        {/* 客户名称 */}
                        <div className="g-border-bottom">
                            <FormLayout
                                schema={this.contractShowSchema['organization']}
                                form={this.props.form} />
                        </div>

                        {/* 合同号 */}
                        <Tabs className="g-mt10 g-mb10" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                            <TabPane tab="合同房间" key="room">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['room']['columns']}
                                        dataSource={res.rentpactrooms}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同班线" key="classLine">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['line']['columns']}
                                        dataSource={res.rentpactlines}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同优惠冲抵" key="policy">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['policy']['columns']}
                                        dataSource={res.rentpactpromotions}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="履约保证金冲抵" key="contractBond">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.contractShowSchema['contractBond']['columns']}
                                        dataSource={res.offsetmargins}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同附件" key="contractAttachment">
                                <div className="g-padding-lr g-mb20">
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
                        <div className="g-padding-lr g-mb20">
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

                        {/* 打印合同 */}
                        <div className="g-tac g-mt20">
                            <Link to={ `print/printPreview/${this.props.params.id}` } target="_blank">
                                <Button>打印合同</Button>
                            </Link>
                        </div>
                    </Form>
                </section>
            )
        }
    }
}

FinanceShow = Form.create()(FinanceShow)

export default FinanceShow