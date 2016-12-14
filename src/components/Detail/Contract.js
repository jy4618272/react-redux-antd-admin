import React, { Component, PropTypes } from 'react'
import {
    Form,
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
    Cards,
    Loading,
    InnerTable,
    FormLayout
} from 'COMPONENT'

class Detail extends Component {
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
            this.showSchema = require(`SCHEMA/${tableName}/${tableName}.showSchema.js`)
            this.financeShowSchema = require(`SCHEMA/${commonName}/finance.showSchema.js`)
            console.log('其他详情：', this.showSchema)
            console.log('财务详情：', this.financeShowSchema)
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
            loading,
            res,
            stagesTableData,
            dataAttachment,
            newObj
        } = this.props
        this.setState({
            loading,
            res,
            stagesTableData,
            dataAttachment
        })
        this.props.form.setFieldsValue(newObj)
    }

    render() {
        const { location } = this.props
        const { loading, res } = this.state
        const type = location.query.type
        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }
        if (type === '履约保证金') {
            const arr = []
            arr.push(res)
            return (
                <section>
                    <InnerTable
                        loading={loading}
                        columns={this.showSchema['bond']}
                        dataSource={arr}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                </section>
            )
        } else if (type === '临时摊位') {
            const arr = []
            arr.push(res)

            return (
                <section>
                    <InnerTable
                        loading={loading}
                        columns={this.showSchema['notContract']}
                        dataSource={arr}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                </section>
            )
        } else if (type === '租赁合同') {
            if (loading) {
                return <Loading />
            }
            const tableStagesColumns = this.financeShowSchema['stages']['columns'].concat([
                {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index) => <div className="button-group">
                        <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                    </div>
                }
            ])

            const tableAttachmentColumns = this.financeShowSchema['attachment']['columns'].concat([
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
                            schema={this.financeShowSchema['contractFrom']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 客户名称 */}
                        <Cards title={"客户信息"}>
                            <FormLayout
                                schema={this.financeShowSchema['organization']}
                                form={this.props.form} />
                        </Cards>

                        {/* 合同号 */}
                        <Cards title={"合同信息"}>
                            <Tabs className="g-mt10 g-mb10" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                                <TabPane tab="合同房间" key="room">
                                    <div className="g-padding-lr g-mb20">
                                        <InnerTable
                                            columns={this.financeShowSchema['room']['columns']}
                                            dataSource={res.rentpactrooms}
                                            bordered={true}
                                            pagination={false} />
                                    </div>
                                </TabPane>
                                <TabPane tab="合同班线" key="classLine">
                                    <div className="g-padding-lr g-mb20">
                                        <InnerTable
                                            columns={this.financeShowSchema['line']['columns']}
                                            dataSource={res.rentpactlines}
                                            bordered={true}
                                            pagination={false} />
                                    </div>
                                </TabPane>
                                <TabPane tab="合同优惠冲抵" key="policy">
                                    <div className="g-padding-lr g-mb20">
                                        <InnerTable
                                            columns={this.financeShowSchema['policy']['columns']}
                                            dataSource={res.rentpactpromotions}
                                            bordered={true}
                                            pagination={false} />
                                    </div>
                                </TabPane>
                                <TabPane tab="履约保证金冲抵" key="contractBond">
                                    <div className="g-padding-lr g-mb20">
                                        <InnerTable
                                            columns={this.financeShowSchema['contractBond']['columns']}
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
                                schema={this.financeShowSchema['contractTabs']}
                                form={this.props.form} />
                        </Cards>

                        {/* 分期明细 */}
                        <Cards title={"分期明细"}>
                            <FormLayout
                                schema={this.financeShowSchema['stages']['form']}
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
                                            columns={this.financeShowSchema['stages']['showColumns']}
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
                        </Cards>
                    </Form>
                </section>
            )
        }
    }
}

Detail = Form.create()(Detail)

export default Detail