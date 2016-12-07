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

import {
    Icons,
    Err,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

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
            clickedRowKeys: [],
            clickedRows: []
        }

        // 组件初始化时尝试获取schema
        this.tabs = sessionStorage.getItem('busiFinanceTabs') || 'notConfirmed'
        this.status = (this.tabs === 'notConfirmed') ? "未确认" : "已到账"
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
        
        if (activeKey == 'notConfirmed') {
            this.status = "未确认"
        } else if (activeKey == 'confirmed') {
            this.status = "已到账"
        }

        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })

        this.refs.form.resetFields()
        this.refresh()
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
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount) => {
        const {actionFinance} = this.props
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.status = this.status
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        this.queryObj = tmpObj
        actionFinance.fetchFinanceTable(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {}) => {
        const {busiFinance} = this.props
        this.select(queryObj, busiFinance.home.pageSize, 0)
    }

    /**
     * 点击查询按钮时触发查询
     * @param 
     */
    handleFormSubmit = (newObj) => {
        const tmpObj = Object.assign({}, newObj)
        const {busiFinance} = this.props

        this.select(tmpObj, busiFinance.home.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (page) => {
        const {busiFinance} = this.props
        console.debug('handlePageChange, page = %d', page);

        this.handleCancel(this.tabs);
        page = (page <= 1) ? 0 : (page - 1) * 10
        this.select(this.queryObj, busiFinance.home.pageSize, page)
    }

    /* 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
        console.log('$$$', rows)
    }*/

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
        this.refs[key].hanldeCancelClick()
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
        this.handleCancel(this.tabs)

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

        busiFinance.home.tableData.map(item => {
            arrParam.push(item.financecollectionid)
        })

        if (arrParam.length) {
            notification.open({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });

            window.location.href = paths.financePath + '/financecollectioncs/exportFinanceListExcel?financeCollectionIds=' + arrParam.join(',')
        } else {
            notification.open({
                message: '导出本页',
                description: '本页没有数据',
            });
        }
    }

    parentHandleClick = () => {
        
    }
    
    // 双击查看详情
    parentHandleDoubleClick = (record, index) => {
        if (record.type === '租赁合同' || record.type === '临时摊位' || record.type === '履约保证金') {
            hashHistory.push(`busi/busi_finance/${record.financebusinessnumber}?type=${record.type}&paytype=${record.paytype}`)
        } else {
            // alert(3)
        }
    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh()
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

        const tableNotControl = <Row className="button-group g-mb10">
            <Col sm={16}>
                <Button disabled={!isReceive} onClick={this.handleReceive}><Icons type="receipt" />确认收款</Button>
                <Button disabled={!isRefund} onClick={this.handleRefund}><Icons type="refund" />确认退款</Button>
                <Button onClick={this.handleReturn}><Icons type="return" />退回</Button>
            </Col>
            <Col sm={8} className="g-tar">
                <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
            </Col>
        </Row>

        const tableControl = <Row className="button-group g-mb10">
            <Col sm={16}>
                <Button onClick={this.handleFinanceList}>资金文件列表</Button>
            </Col>
            <Col sm={8} className="g-tar">
                <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
            </Col>
        </Row>

        if (!this.inited) {
            return (
                <Err errorMsg={this.errorMsg} />
            )
        }

        return (
            <section>
                <Tabs defaultActiveKey={this.tabs} animated="false" type="card" onTabClick={this.handlerTabs}>
                    <TabPane tab="未确认" key="notConfirmed">
                        <InnerForm
                            ref="form"
                            formStyle="m-advance-filter"
                            schema={this.querySchema}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableNotControl}
                        <InnerTable
                            loading={busiFinance.home.tableLoading}
                            columns={busiFinance.home.tableColumns}
                            dataSource={busiFinance.home.tableData}
                            isRowSelection={true}
                            bordered={true}
                            pagination={false}
                            ref="notConfirmed"
                            rowClassName="notConfirmed"                            
                            parentHandleRowClick={this.parentHandleRowClick}
                            parentHandleClick = {this.parentHandleClick}
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
                            schema={this.querySchema}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        {tableControl}
                        <InnerTable
                            loading={busiFinance.home.tableLoading}
                            columns={busiFinance.home.tableColumns}
                            dataSource={busiFinance.home.tableData}
                            isRowSelection={true}
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
                </Tabs>
            </section>
        )
    }
}


export default Finance

