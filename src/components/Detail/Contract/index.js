// 合同详情
import React, { Component, PropTypes } from 'react'
import moment from 'moment';
import {
    Form,
    Tabs,
    Button,
    notification
} from 'antd'
const TabPane = Tabs.TabPane

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    Cards,
    Loading,
    InnerTable,
    FormLayout
} from 'COMPONENT'

class ContractShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsStatus: 'room',           // 合同信息
            tableIndex: 0,
            isStagesShow: false,          // 分期明细是否显示
            stagesNum: 0,                 // 分期明细期数
            stagesShowTableData: [],      // 分期明细数据                 
        }
        console.log('合同详情props', props);
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
            stagesShowTableData: this.props.stagesTableData[record.stagesnumber - 1].rentpactpaylists
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
        const {dataAttachment} = this.props;
        window.location.href = rootPaths.imgPath + paths.imgPath + '/' + dataAttachment[index].url
    }

    componentDidMount(){
        const oldObj = this.props.res.rentpact;

        console.log('@@@@@', oldObj)
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

    render() {
        const { res, financeShowSchema, stagesTableData, dataAttachment } = this.props;

        const tableStagesColumns = financeShowSchema['stages']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                </div>
            }
        ])

        const tableAttachmentColumns = financeShowSchema['attachment']['columns'].concat([
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
                        schema={financeShowSchema['contractFrom']}
                        form={this.props.form} />

                    {/* 客户名称 */}
                    <Cards title={"客户信息"}>
                        <FormLayout
                            schema={financeShowSchema['organization']}
                            form={this.props.form} />
                    </Cards>

                    <Cards title={"合同信息"}>
                        {/* 合同号 */}
                        <Tabs className="g-mt10 g-mb10" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                            <TabPane tab="合同房间" key="room">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={financeShowSchema['room']['columns']}
                                        dataSource={res.rentpactrooms}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同班线" key="classLine">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={financeShowSchema['line']['columns']}
                                        dataSource={res.rentpactlines}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="合同优惠冲抵" key="policy">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={financeShowSchema['policy']['columns']}
                                        dataSource={res.rentpactpromotions}
                                        bordered={true}
                                        pagination={false} />
                                </div>
                            </TabPane>
                            <TabPane tab="履约保证金冲抵" key="contractBond">
                                <div className="g-padding-lr g-mb20">
                                    <InnerTable
                                        columns={financeShowSchema['contractBond']['columns']}
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
                            schema={financeShowSchema['contractTabs']}
                            form={this.props.form} />
                    </Cards>

                    {/* 分期明细 */}
                    <Cards title={"分期明细"}>
                        <FormLayout
                            schema={financeShowSchema['stages']['form']}
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
                                        columns={financeShowSchema['stages']['showColumns']}
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

ContractShow = Form.create()(ContractShow)

export default ContractShow