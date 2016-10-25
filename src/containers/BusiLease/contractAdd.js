import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import _ from 'lodash'
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
            selectDatas: [],
            dataRoom: [],
            dataRoomId: [12],
            dataRoomMoney: 0,
            dataLine: [],
            dataLineId: [],
            dataLineMoney: 0,
            dataPolicy: [],
            dataBond: [],
            dataAttachment: [],
            dataStages: [],
            modalName: 'room',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '900'
        }

        console.log('合同新增props:', props)

        this.initFetchSchema(props)
        props.action.fetchContractFrom()
        props.action.fetchManager()
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
            console.log(this.addSchema)
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
        } = this.props.configLease
        const {
            bondData
        } = this.props.busiLease
        const {
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable,
            fetchBondTable
        } = this.props.actionLease

        page = (page <= 1) ? 0 : (page - 1) * 10
        if (tabsStatus === 'room') {
            this.select({
                status: '未出租'
            }, roomData.pageSize, page, fetchRoomTable)
        } else if (tabsStatus === 'classLine') {
            this.select({
                status: '有效'
            }, classLineData.pageSize, page, fetchClassLineTable)
        } else if (tabsStatus === 'policy') {
            this.select(this.queryObj, policyData.pageSize, page, fetchPolicyTable)
        } else if (tabsStatus === 'contractBond') {
            this.select(this.queryObj, bondData.pageSize, page, fetchBondTable)
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

    // 合同数据来源-选项卡
    handleTabsContractFrom = (activeKey) => {
        console.log(activeKey)
        this.setState({
            tabsStatus: activeKey,
            modalName: activeKey
        })
    }

    /**
     * 点击获取客户信息
     */
    handleInputChange = (e) => {
        this.setState({
            organizationValue: e.target.value,
        })
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
            fetchRoomTable,
            fetchClassLineTable,
            fetchPolicyTable
        } = this.props.actionLease

        const {
            fetchBondTable
        } = this.props.action

        if (key === 'addRoom' && this.state.tabsStatus === 'room') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择房间',
                modalName: 'room'
            })
            this.select({
                status: '未出租'
            }, 10, 0, fetchRoomTable)
        } else if (key === 'addLine' && this.state.tabsStatus === 'classLine') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择班线'
            })
            this.select({
                status: '有效'
            }, 10, 0, fetchClassLineTable)
        } else if (key === 'addPolicy' && this.state.tabsStatus === 'policy') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择优惠'
            })
            this.select({
                status: '开启'
            }, 10, 0, fetchPolicyTable)
        } else if (key === 'addBond' && this.state.tabsStatus === 'contractBond') {
            this.setState({
                modalVisible: true,
                modalTitle: '选择保证金'
            })
            this.refresh(fetchBondTable)
        }
    }

    // 获取客户信息
    handleGetOrganization = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '选择客户',
            modalName: 'selectOrganization'
        })
    }

    handleSelectChange = (data) => {
        this.setState({
            selectDatas: data
        })
    }

    // 去重
    uniq = (arr, arr1, id) => {
        let ids = []
        if (arr.length == 0) {
            arr = arr1
            arr1.map(item => {
                ids.push(item[id])
            })
        } else {
            arr.map(item => {
                ids.push(item[id])
            })
            arr1.map(item => {
                if (ids.indexOf(item[id]) == -1) {
                    arr.push(item)
                    ids.push(item[id])
                }
            })
        }

        return {
            arr: arr,
            ids: ids
        }
    }

    // 弹框确认
    handleModalOk = () => {
        const {
            modalName,
            selectDatas,
            dataRoom,
            dataRoomId,
            dataRoomMoney,
            dataLine,
            dataLineId,
            dataLineMoney,
            dataPolicy,
            dataBond
        } = this.state

        if (modalName === 'room' && selectDatas.length !== 0) {
            let obj = this.uniq(this.state.dataRoom, selectDatas, 'rentroomid')
            console.log('1111', obj.arr)
            console.log('222', obj.ids)

            this.setState({
                dataRoom: obj.arr,
                dataRoomId: obj.ids
            })

            console.log('选中房间合同', this.state.dataRoom)
            console.log('选中房间合同ids', this.state.dataRoomId)
        } else if (modalName === 'classLine' && selectDatas.length !== 0) {
            let obj = this.uniq(this.state.dataLine, selectDatas, 'transportlineid')

            this.setState({
                dataLine: obj.arr,
                dataLineId: obj.ids
            })
        } else if (modalName === 'policy' && selectDatas.length !== 0) {
            let obj = this.uniq(this.state.dataPolicy, selectDatas, 'rentpromotionid')

            this.setState({
                dataPolicy: obj.arr,
                dataPolicyId: obj.ids
            })
        } else if (modalName === 'contractBond' && selectDatas.length !== 0) {
            let obj = this.uniq(this.state.dataBond, selectDatas, 'marginid')

            this.setState({
                dataBond: obj.arr,
                dataBondId: obj.ids
            })

        }

        // 填充下面表单【合同房间】
        this.props.form.setFieldsValue({
            roomList: dataRoomId,
            roomMoney: dataRoomMoney,
            lineList: dataLineId,
            lineMoney: dataLineMoney
        })
        this.handleModalCancel()
    }

    // 弹框关闭
    handleModalCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    handleDelRoom = (record) => {
        const {
            dataRoom
        } = this.state
        dataRoom.map((item, index) => {
            if (item.rentroomid == record.rentroomid) {
                dataRoom.splice(index, 1)
            }
        })

        this.setState({
            dataRoom
        })
    }

    handleDelLine = (record) => {
        const {
            dataLine
        } = this.state
        dataLine.map((item, index) => {
            if (item.rentroomid == record.rentroomid) {
                dataLine.splice(index, 1)
            }
        })

        this.setState({
            dataLine
        })
    }

    handleDelPolicy = (record) => {
        const {
            dataPolicy
        } = this.state
        dataPolicy.map((item, index) => {
            if (item.rentpromotionid == record.rentpromotionid) {
                dataPolicy.splice(index, 1)
            }
        })

        this.setState({
            dataPolicy
        })
    }

    handleDelBond = (record) => {
        const {
            dataBond
        } = this.state
        dataBond.map((item, index) => {
            if (item.marginid == record.marginid) {
                dataBond.splice(index, 1)
            }
        })

        this.setState({
            dataBond
        })
    }


    componentDidMount() {
        this.props.form.setFieldsValue({
            signDate: moment().locale('en').utcOffset(0),
            startsate: moment().locale('en').utcOffset(0),
            enddate: moment().locale('en').utcOffset(0)
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {
            busiLease,
            configLease
        } = this.props

        const tableColumnsRoom = this.addSchema['room']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelRoom.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsLine = this.addSchema['line']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelLine.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsPolicy = this.addSchema['policy']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelPolicy.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsBond = this.addSchema['contractBond']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelBond.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsAttachment = this.addSchema['attachment']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelTr.bind(this, record)}>删除</a>
            }
        ])

        const tableColumnsStages = this.addSchema['stages']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <div>
                    <a href="javascript:;" className="s-blue" onClick={this.handlePrint.bind(this, record)}>打印交款单</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleShow.bind(this, record)}>明细</a>
                </div>
            }
        ])

        const {tabsStatus, modalName} = this.state
        let modalContent = ''

        if (modalName === 'room') {
            modalContent = <ModalTable
                dataSource={configLease.roomData}
                parentHandleSelectChange={this.handleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'classLine') {
            modalContent = <ModalTable
                dataSource={configLease.classLineData}
                parentHandleSelectChange={this.handleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'policy') {
            modalContent = <ModalTable
                dataSource={configLease.policyData}
                parentHandleSelectChange={this.handleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'contractBond') {
            modalContent = <ModalTable
                dataSource={busiLease.bondData}
                parentHandleSelectChange={this.handleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'selectOrganization') {
            const {
                contractOrganization
            } = this.props.busiLease
            modalContent = <div className="m-search-modal">
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
                                    columns={tableColumnsRoom}
                                    dataSource={this.state.dataRoom}
                                    schema={this.addSchema['room']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同班线" key="classLine">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={tableColumnsLine}
                                    dataSource={this.state.dataLine}
                                    schema={this.addSchema['line']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同优惠冲抵" key="policy">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={tableColumnsPolicy}
                                    dataSource={this.state.dataPolicy}
                                    schema={this.addSchema['policy']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="履约保证金冲抵" key="contractBond">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={tableColumnsBond}
                                    dataSource={this.state.dataBond}
                                    schema={this.addSchema['contractBond']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同附件" key="contractAttachment">
                            <div className="padding-lr g-mb20">
                                <InnerTable
                                    columns={tableColumnsAttachment}
                                    dataSource={this.state.dataAttachment}
                                    schema={this.addSchema['attachment']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                    </Tabs>

                    {/* 客户数据录入 */}
                    <FormLayout
                        schema={busiLease.contractTabs}
                        form={this.props.form}
                        fromLayoutStyle="g-border-bottom" />

                    {/*333
                    <Row>
                        <Col key="roomList" sm={8} className="form-col-wrapper">
                            <FormItem
                                key="roomList"
                                label="合同房间"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}>
                                {getFieldDecorator("roomList")(
                                    <Input placeholder={'请填写'} value={this.state.dataRoom} size="default" disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>*/}

                    {/* 分期明细 */}
                    <div className="padding-lr g-mb20">
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
                                <Button>生成</Button>
                            </Col>
                        </Row>
                        <InnerTable
                            columns={tableColumnsStages}
                            dataSource={this.state.dataStages}
                            bordered={true}
                            parentHandleClick={this.parentHandleClick}
                            pagination={false} />
                    </div>
                </Form>
            </section>
        )
    }
}

ContractInsert = Form.create()(ContractInsert)

export default ContractInsert