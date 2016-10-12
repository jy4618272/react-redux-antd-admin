import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
    Row,
    Col,
    Button,
    Icon,
    Tabs,
    Table,
    message
} from 'antd'
const TabPane = Tabs.TabPane

import actionFinance from 'ACTION/finance'

import Error from 'COMPONENT/Error'
import InnerForm from 'COMPONENT/DBTable/InnerForm'
import InnerTable from 'COMPONENT/DBTable/InnerTable'
import InnerPagination from 'COMPONENT/DBTable/InnerPagination'

const mapDispatchToProps = (dispatch) => ({
    actionFinance: bindActionCreators(actionFinance, dispatch)
})

@connect(
    ({ finance }) => ({ finance }),
    mapDispatchToProps
)
class Finance extends Component {
    constructor(props) {
        super(props)

        /** 
         * 导出按钮，点击查询后且查询数据有值
         * 
        this.state = {
            exportData: {
                button: true
            }
        } */

        // 组件初始化时尝试获取schema
        this.status = "未确认"
        this.initFetchSchema(this.props)
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        if (activeKey == '1') {
            this.status = "未确认"
        } else if (activeKey == '2') {
            this.status = "已到账"
        }

        /* 查询导出
        this.setState({
            exportData: {
                button: true
            }
        })*/

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
            this.querySchema = require(`SCHEMA/${tableName}.querySchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

        try {
            this.controlSchema = require(`SCHEMA/${tableName}.controlSchema.js`)
            console.log(`加载${tableName}controlSchema`, this.controlSchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}controlSchema, 请检查配置`
            return false
        }

        this.inited = true
    }

    /**
     * 点击查询按钮时触发查询
     *
     * @param 
     */
    
    handleFormSubmit = (newObj) => {
        const tmpObj = Object.assign({}, newObj)
        const {finance} = this.props
        
        /* 查询导出
        this.setState({
            exportData: {
                button: false,
                newObj
            }
        })*/

        this.select(tmpObj, finance.pageSize, 0)
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

        const hide = message.loading('正在查询...', 0)
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.status = this.status
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        this.queryObj = tmpObj
        actionFinance.fetchFinanceTable(tmpObj)
        setTimeout(() => {
            hide()
        }, 2000)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {}) => {
        const {finance} = this.props
        this.select(queryObj, finance.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {finance} = this.props
        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10 - 1
        this.select(this.queryObj, finance.pageSize, page)
    }

    /**
     * 获取所有选中项的数据
     */
    handleSelected = (data) => {
        // 是否选择了多项
        const multiSelected = data.length > 1
        if (!multiSelected) {
            const tmpObj = data.pop()
            return tmpObj.financecollectionid
        } else {
            let tmpObj = []
            data.map((item) => {
                tmpObj.push(item.financecollectionid)
            })
            return tmpObj.join(',')
        }
    }


    /**
     * 点击确认收款按钮
     */
    parentHandleReceive = (data) => {
        const {actionFinance} = this.props
        const tmpObj = Object.assign({}, {
            financeCollectionIds: this.handleSelected(data)
        })
        actionFinance.fetchReceive(tmpObj)
    }

    /**
     * 点击确认退款按钮
     */
    parentHandleRefund = (data) => {
        const {actionFinance} = this.props
        const tmpObj = Object.assign({}, {
            financeCollectionIds: this.handleSelected(data)
        })

        actionFinance.fetchRefund(tmpObj)
    }

    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh()
    }

    render() {
        const {finance} = this.props

        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="padding">
                <Tabs defaultActiveKey="1" animated="false" type="card" onChange={this.handlerTabs}>
                    <TabPane tab="未确认" key="1">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"                            
                            schema={this.querySchema}
                            showSearch={true}                            
                            parentHandleSubmit = {this.handleFormSubmit} />

                        <InnerTable
                            loading={finance.tableLoading}
                            columns={finance.tableColumns}
                            dataSource={finance.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema[0]}
                            bordered={true}
                            pagination = {false}
                            parentHandleReceive={this.parentHandleReceive}
                            parentHandleRefund={this.parentHandleRefund}
                            parentHandleExport={this.parentHandleExport} />
                        <InnerPagination
                            total = {finance.total}
                            pageSize = {finance.pageSize}
                            skipCount = {finance.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>

                    <TabPane tab="已到账" key="2">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema}
                            showSearch={true}
                            parentHandleSubmit = {this.handleFormSubmit} />

                        <InnerTable
                            loading={finance.tableLoading}
                            columns={finance.tableColumns}
                            dataSource={finance.tableData}
                            isRowSelection={true}
                            schema = {this.controlSchema[1]}
                            bordered={true}
                            pagination = {false}
                            parentHandleReceive={this.parentHandleReceive}
                            parentHandleRefund={this.parentHandleRefund}
                            parentHandleExport={this.parentHandleExport} />
                        <InnerPagination
                            total = {finance.total}
                            pageSize = {finance.pageSize}
                            skipCount = {finance.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}


export default Finance

