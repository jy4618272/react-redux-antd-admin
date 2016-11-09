import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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
    Loading,
    InnerTable,
    FormLayout
} from 'COMPONENT'

@connect(
    ({}) => ({})
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
            this.showSchema = require(`SCHEMA/${tableName}/${tableName}.showSchema.js`)
            console.log(this.showSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的showSchema出错, 请检查配置`
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
        console.log('参数：', id, type)

        xhr('post', paths.financePath + '/financecollectioncs/getFinanceCollectionDetail', {
            type: type,
            businessnumber: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('财务详情', res)
            if (res.result === 'success') {
                hide()
                this.setState({
                    loading: false,
                    res: res.data,
                    stagesTableData: res.data.rentpactpayplanfullinfos,
                    dataAttachment: res.data.rentpactattachments
                })
                if (type === '租赁合同') {
                    const oldObj = res.data.rentpact
                    const newObj = {}
                    for (const key in oldObj) {
                        if (key.indexOf('date') > -1) {
                            newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
                        } else if (key.indexOf('totalstages') > -1) {
                            newObj[key] = '第' + oldObj[key] + '期'
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
                <section className="padding">
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
                <section className="padding">
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
            const tableStagesColumns = this.showSchema['contract']['stages']['columns'].concat([
                {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index) => <div className="button-group">
                        <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                    </div>
                }
            ])

            const tableAttachmentColumns = this.showSchema['contract']['attachment']['columns'].concat([
                {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index) => <a href="javascript:;" className="s-blue" onClick={this.handleViewDoc.bind(this, text, record, index)}>下载</a>
                }
            ])

            return (
                <section className="padding g-mt20">
                    <Form horizontal>
                        {/* 获取合同模板 */}
                        <FormLayout
                            schema={this.showSchema['contract']['contractFrom']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 客户名称 */}
                        <div className="g-border-bottom">
                            <FormLayout
                                schema={this.showSchema['contract']['organization']}
                                form={this.props.form} />
                        </div>

                        {/* 合同号 */}
                        <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                            <TabPane tab="合同房间" key="room">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.showSchema['contract']['room']['columns']}
                                        dataSource={res.rentpactrooms}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同班线" key="classLine">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.showSchema['contract']['line']['columns']}
                                        dataSource={res.rentpactlines}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同优惠冲抵" key="policy">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.showSchema['contract']['policy']['columns']}
                                        dataSource={res.rentpactpromotions}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="履约保证金冲抵" key="contractBond">
                                <div className="padding-lr g-mb20">
                                    <InnerTable
                                        columns={this.showSchema['contract']['contractBond']['columns']}
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
                            schema={this.showSchema['contract']['contractTabs']}
                            form={this.props.form}
                            fromLayoutStyle="g-border-bottom" />

                        {/* 分期明细 */}
                        <div className="padding-lr g-mb20">
                            <FormLayout
                                schema={this.showSchema['contract']['stages']['form']}
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
                                            columns={this.showSchema['contract']['stages']['showColumns']}
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
                    </Form>
                </section>
            )
        }
    }
}

FinanceShow = Form.create()(FinanceShow)

export default FinanceShow