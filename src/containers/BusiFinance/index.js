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

import actionFinance from 'ACTION/busiFinance'

import {
    Err,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'

import { paths } from 'SERVICE/config'

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

        try {
            this.controlSchema = require(`SCHEMA/${tableName}/${tableName}.controlSchema.js`)
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
        this.select(queryObj, busiFinance.pageSize, 0)
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
     * 点击查询按钮时触发查询
     * @param 
     */

    handleFormSubmit = (newObj) => {
        const tmpObj = Object.assign({}, newObj)
        const {busiFinance} = this.props

        this.select(tmpObj, busiFinance.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (page) => {
        const {busiFinance} = this.props
        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10
        this.select(this.queryObj, busiFinance.pageSize, page)
    }


    /**
     * 点击按钮
     */
    parentHandleClick = (key, data) => {
        const {
            busiFinance,
            actionFinance
        } = this.props

        if (key === 'receive') {
            const tmpObj = Object.assign({}, {
                financeCollectionIds: data[0].financecollectionid ? data[0].financecollectionid : 0
            })
            console.log(tmpObj)
            actionFinance.fetchReceive(tmpObj)
        } else if (key === 'refund') {
            const tmpObj = Object.assign({}, {
                financeCollectionIds: data[0].financecollectionid ? data[0].financecollectionid : 0
            })
            actionFinance.fetchRefund(tmpObj)
        } else if (key === 'exportPage') {
            let arrParam = []

            busiFinance.tableData.map(item => {
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
        } else if (key === 'document') {
            alert('资源文件开发中')
        }
    }

    parentHandleDoubleClick = (record, index) => {
        // alert(JSON.stringify(record))
        if (record.type === '租赁合同') {
            hashHistory.push(`busi/busi_finance/${record.financecollectionid}`)
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

        if (!this.inited) {
            return (
                <Err errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="padding">
                <Tabs defaultActiveKey="1" animated="false" type="card" onTabClick={this.handlerTabs}>
                    <TabPane tab="未确认" key="1">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />
                        <InnerTable
                            loading={busiFinance.tableLoading}
                            columns={busiFinance.tableColumns}
                            dataSource={busiFinance.tableData}
                            isRowSelection={true}
                            schema={this.controlSchema['not']}
                            bordered={true}
                            pagination={false}
                            parentHandleDoubleClick={this.parentHandleDoubleClick}
                            parentHandleClick={this.parentHandleClick} />
                        <InnerPagination
                            total={busiFinance.total}
                            pageSize={busiFinance.pageSize}
                            skipCount={busiFinance.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>

                    <TabPane tab="已到账" key="2">
                        <InnerForm
                            ref="form"
                            formStyle="g-mb20 m-advance-filter"
                            schema={this.querySchema}
                            showSearch={true}
                            parentHandleSubmit={this.handleFormSubmit} />

                        <InnerTable
                            loading={busiFinance.tableLoading}
                            columns={busiFinance.tableColumns}
                            dataSource={busiFinance.tableData}
                            isRowSelection={true}
                            schema={this.controlSchema['done']}
                            bordered={true}
                            pagination={false}
                            parentHandleClick={this.parentHandleClick} />
                        <InnerPagination
                            total={busiFinance.total}
                            pageSize={busiFinance.pageSize}
                            skipCount={busiFinance.skipCount}
                            parentHandlePageChange={this.handlePageChange}
                            />
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}


export default Finance

