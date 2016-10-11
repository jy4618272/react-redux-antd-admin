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

import actionFinance from 'ACTION/finance/'

import Error from 'COMPONENT/Error'
import InnerForm from 'COMPONENT/DBTable/InnerForm'
import InnerTable from 'COMPONENT/DBTable/InnerTable'

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
        // 组件初始化时尝试获取schema
        console.log('init-------finance', this.props);
        this.initFetchSchema(this.props)
        this.state = {
            // 查询条件
            queryObj: {
                status: "未确认"
            },
            pageSize: 10,
            skipCount: 0,
        }
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        if (activeKey === 1) {
            this.setState({
                queryObj: {
                    status: "未确认"
                }
            })
        } else if (activeKey === 2) {
            this.setState({
                queryObj: {
                    status: "已到账"
                }
            })
        }
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
     * 点击提交按钮时触发查询
     *
     * @param queryObj
     */
    handleFormSubmit = (newObj) => {
        // alert(JSON.stringify(newObj))
        const tmpObj = Object.assign({}, this.state.queryObj, newObj)
        // alert(JSON.stringify(tmpObj))
        this.select(tmpObj, 10, 0)
    }

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param queryObj 包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount) => {
        const hide = message.loading('正在查询...', 0)
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        const {actionFinance} = this.props
        // alert(JSON.stringify(tmpObj))
        actionFinance.fetchFinanceTable(tmpObj)
        hide()
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = () => {
        const {queryObj,pageSize, skipCount} = this.state

        this.select(queryObj,pageSize, skipCount)
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
                            parentHandleSubmit = {this.handleFormSubmit}
                            schema={this.querySchema}>
                            <Row>
                                <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                    <Button type="primary"><Icon type="search"/>查询</Button>
                                    <Button><Icon type="cross"/>清除条件</Button>
                                </Col>
                            </Row>
                        </InnerForm>
                        <InnerTable 
                            schema = {this.controlSchema}
                            loading={finance.tableLoading}                             
                            columns={finance.tableColumns} 
                            dataSource={finance.tableData} 
                            isRowSelection={true}
                            pagination={false} />
                    </TabPane>

                    <TabPane tab="已到账" key="2">
                        <InnerForm
                            parentHandleSubmit = {this.handleFormSubmit}
                            schema={this.querySchema}>
                            <Row>
                                <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                    <Button type="primary"><Icon type="search"/>查询</Button>
                                    <Button><Icon type="cross"/>清除条件</Button>
                                </Col>
                            </Row>
                        </InnerForm>
                    </TabPane>
                </Tabs>
            </section>
        )
    }
}


export default Finance

