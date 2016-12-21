import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router'
import {
    Row,
    Col,
    Button,
    Icon,
    Tabs,
    Table,
    message,
    notification
} from 'antd'
const TabPane = Tabs.TabPane
const ButtonGroup = Button.Group

import {
    Icons,
    Err,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import {
    pageChange
} from 'UTIL/pageChange'

import { paths } from 'SERVICE/config'
import actionFinance from 'ACTION/busiFinance'

const mapDispatchToProps = (dispatch) => ({
    actionFinance: bindActionCreators(actionFinance, dispatch)
})

@connect(
    ({ busiFinance }) => ({ busiFinance }),
    mapDispatchToProps
)
class Finance extends Component {
    constructor(props) {
        super(props)
        console.log('财务首页props:', props)
        this.state = {
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: []
        }

        // 组件初始化时尝试获取schema
        this.tabs = sessionStorage.getItem('busiFinanceTabs') || 'notConfirmed';

        this.status = (this.tabs === 'notConfirmed') ? "未确认" : (this.tabs === 'confirmed') ? "已到账" : "成功";
        this.initFetchSchema(this.props)
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.tabs = activeKey
        sessionStorage.setItem('busiFinanceTabs', activeKey)

        this.status = (activeKey === 'notConfirmed') ? "未确认" : (activeKey === 'confirmed') ? "已到账" : "成功";

        this.setState({
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: []
        })

        this.refs.form.resetFields();
        this.refresh();
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
        const tableName = routes.pop().tableName // busi

        if (tableName) {
            console.info('init component Finance with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.querySchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }


    /**
     * 点击查询按钮时触发查询
     * @param 
     */
    handleFormSubmit = (newObj) => {
        const {busiFinance, actionFinance} = this.props;
        const tmpObj = Object.assign({}, { status: this.status }, newObj);
        this.setState({
            queryObj: newObj
        });
        if (this.tabs == 'notConfirmed' || this.tabs == 'confirmed') {
            pageChange(tmpObj, 10, 0, actionFinance.fetchFinanceTable);
        } else if (this.tabs === 'payment') {
            pageChange(tmpObj, 10, 0, actionFinance.fetchFinancePayment);
        }
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = () => {
        const { actionFinance } = this.props;

        if (this.tabs == 'notConfirmed' || this.tabs == 'confirmed') {
            // 未确认和已到账
            pageChange({ status: this.status }, 10, 0, actionFinance.fetchFinanceTable);
        } else if (this.tabs === 'payment') {
            // 交费
            pageChange({ status: this.status }, 10, 0, actionFinance.fetchFinancePayment);
        }
    }


    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (skipCount) => {
        const { actionFinance, busiFinance } = this.props;
        this.queryObj = Object.assign({}, { status: this.status }, this.state.queryObj);

        if (this.tabs === 'notConfirmed' || this.tabs === 'confirmed') {
            // 未确认和已到账
            pageChange(this.queryObj, busiFinance.home.pageSize, skipCount, actionFinance.fetchFinanceTable);
        } else if (this.tabs === 'payment') {
            // 交费
            pageChange(this.queryObj, busiFinance.payment.pageSize, skipCount, actionFinance.fetchFinancePayment);
        }
    }

    // 单击选中
    parentHandleRowClick = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
    }

    // 取消勾选
    handleCancel = (key) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        this.refs[key].handleCancelClick()
    }

    // 确认收款
    handleReceive = () => {
        const {
            actionFinance
        } = this.props

        const {clickedRows} = this.state
        const tmpObj = Object.assign({}, {
            financeCollectionIds: clickedRows[0].financecollectionid ? clickedRows[0].financecollectionid : 0
        })

        console.log('确认收款id:', tmpObj)
        actionFinance.fetchReceive(tmpObj)
        this.handleCancel(this.tabs)
    }

    // 确认退款
    handleRefund = () => {
        const {
            actionFinance
        } = this.props

        const {clickedRows} = this.state
        const tmpObj = Object.assign({}, {
            financeCollectionIds: clickedRows[0].financecollectionid ? clickedRows[0].financecollectionid : 0
        })

        console.log('确认退款id:', tmpObj)
        actionFinance.fetchRefund(tmpObj)
        this.handleCancel(this.tabs);
    }

    // 退回
    handleReturn = () => {
        const {clickedRows} = this.state
        const { actionFinance } = this.props
        if (clickedRows.length === 1) {
            const type = clickedRows[0].paytype
            actionFinance.fetchBack({
                financeCollectionIds: clickedRows[0].financecollectionid ? clickedRows[0].financecollectionid : 0
            })
        }
        this.handleCancel(this.tabs)

    }

    // 资金列表
    handleFinanceList = () => {
        hashHistory.push('busi/busi_finance/finance_list?type=资金文件')
    }

    // 导出本页
    handleExportPage = () => {
        const {
            busiFinance,
            actionFinance
        } = this.props

        let arrParam = []

        if (this.tabs === 'notConfirmed' || this.tabs === 'confirmed') {
            busiFinance.home.tableData.map(item => {
                arrParam.push(item.financecollectionid)
            });
        } else if (this.tabs === 'payment') {
            busiFinance.payment.tableData.map(item => {
                arrParam.push(item.meterpaymentorderid)
            });
        }

        if (arrParam.length) {
            notification.success({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });
            if (this.tabs === 'notConfirmed' || this.tabs === 'confirmed') {
                window.location.href = paths.financePath + '/financecollectioncs/exportFinanceListExcel?financeCollectionIds=' + arrParam.join(',')
            } else if (this.tabs === 'payment') {
                window.location.href = paths.leasePath + '/meterpaymentordercs/selectByMeterPaymentOrderIdListToExcel?meterpaymentorderids=' + arrParam.join(',')
            }
        } else {
            notification.error({
                message: '导出本页',
                description: '本页没有数据',
            });
        }
    }

    parentHandleClick = () => {

    }

    // 双击查看详情
    parentHandleDoubleClick = (record, index) => {
        if (record.type === '租赁合同' || record.type === '临时摊位' || record.type === '履约保证金' || record.type === '水电') {
            window.open(`#/busi/busi_finance/${record.financebusinessnumber}?type=${record.type}&paytype=${record.paytype}`)
        }
    }

    // 充值失败，重试
    handleTry = (text, record, index) => {
        this.props.actionFinance.fetchTry({
            meterpaymentorderid: record.meterpaymentorderid
        })
    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh();
    }

    render() {
        const {busiFinance} = this.props

        const {clickedRowKeys, clickedRows} = this.state
        const oneSelected = clickedRowKeys.length === 1

        // 按钮【可否点击】条件判断
        let isReceive = false
        let isRefund = false
        if (oneSelected) {
            isReceive = clickedRows[0].paytype == '收款' ? true : false
            isRefund = clickedRows[0].paytype == '退款' ? true : false
        }

        const tableNotControl = <Row className="g-mb10">
            <Col sm={16}>
                <ButtonGroup className="button-group">
                    <Button disabled={!isReceive} onClick={this.handleReceive}><Icons type="receipt" />确认收款</Button>
                    <Button disabled={!isRefund} onClick={this.handleRefund}><Icons type="refund" />确认退款</Button>
                    <Button onClick={this.handleReturn}><Icons type="return" />退回</Button>
                </ButtonGroup>
            </Col>
            <Col sm={8} className="g-tar">
                <ButtonGroup className="button-group">
                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                </ButtonGroup>
            </Col>
        </Row>

        const tableControl = <Row className="button-group g-mb10">
            <Col sm={16}>
                <ButtonGroup className="button-group">
                    <Button onClick={this.handleFinanceList}>资金文件列表</Button>
                </ButtonGroup>
            </Col>
            <Col sm={8} className="g-tar">
                <ButtonGroup className="button-group">
                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                </ButtonGroup>
            </Col>
        </Row>

        const paymentColumns = busiFinance.payment.tableColumns.concat([
            {
                dataIndex: 'operation',
                key: 'operation',
                title: '操作',
                render: (text, record, index) => {
                    let showTryButton = false;
                    if(record.dealstatus === '充值失败'){
                        showTryButton = true;
                    };

                    return (
                        <div className="button-group">
                            { showTryButton ? <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleTry.bind(this, text, record, index)}>重试</a> : '' }
                        </div>
                    )
                }
            }
        ])

        if (!this.inited) {
            return (
                <Err errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="m-busi m-busi-finance">
                <Tabs defaultActiveKey={this.tabs} animated="false" type="card" onTabClick={this.handlerTabs}>
                    <TabPane tab="未确认" key="notConfirmed">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema.notConfirmed}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableNotControl}
                        <InnerTable
                            loading={busiFinance.home.tableLoading}
                            columns={busiFinance.home.tableColumns}
                            dataSource={busiFinance.home.tableData}
                            bordered={true}
                            pagination={false}
                            ref="notConfirmed"
                            rowClassName="notConfirmed"
                            parentHandleRowClick={this.parentHandleRowClick}
                            parentHandleClick={this.parentHandleClick}
                            parentHandleDoubleClick={this.parentHandleDoubleClick} />
                        <InnerPagination
                            total={busiFinance.home.total}
                            pageSize={busiFinance.home.pageSize}
                            skipCount={busiFinance.home.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="已到账" key="confirmed">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema.confirmed}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableControl}
                        <InnerTable
                            loading={busiFinance.home.tableLoading}
                            columns={busiFinance.home.tableColumns}
                            dataSource={busiFinance.home.tableData}
                            bordered={true}
                            pagination={false}
                            ref="confirmed"
                            rowClassName="confirmed"
                            parentHandleRowClick={this.parentHandleRowClick}
                            parentHandleDoubleClick={this.parentHandleDoubleClick} />
                        <InnerPagination
                            total={busiFinance.home.total}
                            pageSize={busiFinance.home.pageSize}
                            skipCount={busiFinance.home.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                    <TabPane tab="交费" key="payment">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema.payment}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <Row className="button-group g-mb10">
                            <Col sm={16}></Col>
                            <Col sm={8} className="g-tar">
                                <ButtonGroup className="button-group">
                                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <InnerTable
                            loading={busiFinance.payment.tablePayColumns}
                            columns={paymentColumns}
                            dataSource={busiFinance.payment.tableData}
                            bordered={true}
                            pagination={false}
                            ref="payment"
                            rowClassName="payment"
                            parentHandleRowClick={this.parentHandleRowClick}
                            parentHandleDoubleClick={this.parentHandleDoubleClick} />
                        <InnerPagination
                            total={busiFinance.payment.total}
                            pageSize={busiFinance.payment.pageSize}
                            skipCount={busiFinance.payment.skipCount}
                            parentHandlePageChange={this.handlePageChange} />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}


export default Finance

