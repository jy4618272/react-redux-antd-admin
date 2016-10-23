import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    Form,
    Tabs,
    Select,
    Button,
    Modal,
    Input,
    Row,
    Col,
    message
} from 'antd'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option

import {
    FormLayout,
    InnerTable,
    InnerPagination,
    ModalTable
} from 'COMPONENT'

import './contractAdd.less'

import actionBusiLease from 'ACTION/busiLease'
import actionLease from 'ACTION/configLease'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(actionBusiLease, dispatch),
    actionLease: bindActionCreators(actionLease, dispatch)
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
            organizationValue: '',

            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '900'
        }

        console.log('21111111', props)

        this.initFetchSchema(props)
        props.action.fetchContractFrom()
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
            console.log(this.querySchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractAddSchema出错, 请检查配置`
            return false
        }
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
    refresh = (fetchHandle) => {
        this.select({}, 10, 0, fetchHandle)
    }

    // 分页
    handlePageChange = (page) => {
        const {tabsStatus} = this.state
        const {
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData
        } = this.props.configLease

        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (tabsStatus === 'room') {
            this.select({
                status: '未出租'
            }, roomData.pageSize, page, fetchRoomTable)
        } else if (tabsStatus === 'classLine') {
            this.select(this.queryObj, classLineData.pageSize, page, fetchClassLineTable)
        } else if (tabsStatus === 'policy') {
            this.select(this.queryObj, policyData.pageSize, page, fetchPolicyTable)
        } else if (tabsStatus === 'accountManager') {
            this.select(this.queryObj, accountManagerData.pageSize, page, fetchManagerTable)
        } else if (tabsStatus === 'contractTpl') {
            this.select(this.queryObj, contractTplData.pageSize, page, fetchContractTable)
        }
    }

    // 下拉选择
    parentHandleSelect = (key, value) => {
        const { busiLease } = this.props
        // 合同模板
        if (key === 'modelname') {
            busiLease.contractFrom[0].options.map(item => {
                if (item.value === value) {
                    this.props.form.setFieldsValue({
                        pactkind: item.pactkind
                    })
                }
            })
        }
    }

    // 合同数据来演-选项卡
    handleTabsContractFrom = (activeKey) => {
        console.log(activeKey)
        this.setState({
            tabsStatus: activeKey
        })
    }

    /**
     * 点击获取客户信息
     */
    handleInputChange = (e) => {
        this.setState({
            organizationValue: e.target.value,
        });
    }

    // 获取客户信息-搜索
    handleSearch = () => {
        const { action } = this.props
        action.fetchContractOrganization({
            keywords: this.state.organizationValue
        })
    }

    // 表格按钮
    parentHandleClick = (key) => {
        const {
            roomData,
            classLineData,
            policyData,
            accountManagerData,
            contractTplData
        } = this.props.configLease

        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchManagerTable,
            fetchContractTable
        } = this.props.actionLease

        if (key === 'addRoom' && this.state.tabsStatus === 'room') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择房间'
            })
            this.select({
                status: '未出租'
            }, 10, 0, fetchRoomTable)
        } else if (key === 'addLine' && this.state.tabsStatus === 'classLine') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择班线'
            })
            this.refresh(fetchClassLineTable)
        } else if (key === 'addPolicy' && this.state.tabsStatus === 'policy') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择优惠'
            })
            this.refresh(fetchPolicyTable)
        }
    }

    // 获取客户信息
    handleGetOrganization = () => {
        const {
            contractOrganization
        } = this.props.busiLease
        const content = <div className="m-search-modal">
            <div className="m-search-bar">
                <Input
                    placeholder="请选择身份证号|邮箱|手机号|会员名|会员卡号"
                    onChange={this.handleInputChange}
                    onFocus={this.handleFocusBlur}
                    onBlur={this.handleFocusBlur}
                    onPressEnter={this.handleSearch} />
                <Button icon="search" type="primary" size="default" onClick={this.handleSearch}>搜索</Button>
            </div>
            <InnerTable
                columns={contractOrganization.tableColumns}
                dataSource={contractOrganization.tableData}
                schema={[]}
                isRowSelection={true}
                bordered={true}
                pagination={false} />
            <InnerPagination
                total={contractOrganization.total}
                pageSize={contractOrganization.pageSize}
                skipCount={contractOrganization.skipCount}
                parentHandlePageChange={this.handlePageChange} />
        </div>
        this.setState({
            modalVisible: true,
            modalTitle: '选择客户',
            modalContent: content
        })
    }

    // 弹框确认
    handleModalOk = () => {
        const {
            action
        } = this.props

        alert(JSON.stringify(this.state.selectedRows))
        // action.insertRoomData(this.state.selectedRows)
    }

    // 弹框关闭
    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    render() {
        const {
            busiLease,
            configLease
        } = this.props

        const {tabsStatus} = this.state
        let modalContent = ''

        if (tabsStatus === 'room') {
            modalContent = <ModalTable dataSource={configLease.roomData} handlePageChange={this.handlePageChange} />
        } else if (tabsStatus === 'classLine') {
            modalContent = <ModalTable dataSource={configLease.classLineData} handlePageChange={this.handlePageChange} />
        } else if (tabsStatus === 'policy') {
            modalContent = <ModalTable dataSource={configLease.policyData} handlePageChange={this.handlePageChange} />
        }

        // 分期select-options
        return (
            <section className="padding m-contract-add g-mt20">
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <Form horizontal>
                    {/* 获取合同模板 */}
                    <FormLayout
                        schema={busiLease.contractFrom}
                        form={this.props.form}
                        fromLayoutStyle="g-border-bottom"
                        parentHandleSelect={this.parentHandleSelect} />

                    {/* 客户名称 */}
                    <div className="g-border-bottom">
                        <div className="button-get-organization">
                            <Button type="primary" onClick={this.handleGetOrganization}>点击获取客户信息</Button>
                        </div>
                        <FormLayout
                            schema={this.addSchema['organization']}
                            form={this.props.form} />
                    </div>

                    {/* 合同号 */}
                    <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                        <TabPane tab="合同房间" key="room">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={busiLease.contractRoomTable.tableColumns}
                                    dataSource={busiLease.contractRoomTable.tableData}
                                    schema={busiLease.contractRoomTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同班线" key="classLine">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={busiLease.contractLineTable.tableColumns}
                                    dataSource={busiLease.contractLineTable.tableData}
                                    schema={busiLease.contractLineTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同优惠冲抵" key="policy">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={busiLease.contractPolicyTable.tableColumns}
                                    dataSource={busiLease.contractPolicyTable.tableData}
                                    schema={busiLease.contractPolicyTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="履约保证金冲抵" key="contractBond">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={busiLease.contractBondTable.tableColumns}
                                    dataSource={busiLease.contractBondTable.tableData}
                                    schema={busiLease.contractBondTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同附件" key="contractField">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={busiLease.contractAppendicesTable.tableColumns}
                                    dataSource={busiLease.contractAppendicesTable.tableData}
                                    schema={busiLease.contractAppendicesTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="分期明细" key="contractShow">
                            <div className="padding-lr g-mb20">
                                <FormItem
                                    key="stages"
                                    label="分期付款"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 4 }}>
                                    {this.props.form.getFieldDecorator('stages', )(
                                        <Select placeholder="请选择" size="default">
                                            <Option key="1" value="第1期">第1期</Option>
                                            <Option key="2" value="第2期">第2期</Option>
                                            <Option key="3" value="第3期">第3期</Option>
                                            <Option key="4" value="第4期">第4期</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <InnerTable
                                    columns={busiLease.contractStagesTable.tableColumns}
                                    dataSource={busiLease.contractStagesTable.tableData}
                                    schema={busiLease.contractStagesTable.topButtons}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                    </Tabs>

                    {/* 客户选择 */}
                    <FormLayout
                        schema={this.addSchema['contractInfo']}
                        form={this.props.form}
                        FormLayoutStyle="g-border-bottom"
                        showSave={this.props.showSave}
                        setFields={this.props.setContractInfoFields}
                        />
                </Form>
            </section>
        );
    }
}

ContractInsert = Form.create()(ContractInsert)

export default ContractInsert