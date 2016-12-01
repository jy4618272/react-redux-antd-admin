import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Err,
    InnerForm,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import {
    filterQueryObj
} from 'UTIL'
import action from 'ACTION/busiFinance'
const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiFinance }) => ({ busiFinance }),
    mapDispatchToProps
)
class FinanceList extends Component {
    constructor(props) {
        super(props)
        console.log('财务资金文件管理props:', props)

        this.initFetchSchema(this.props)
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
            console.info('资金文件列表 tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.listSchema = require(`SCHEMA/${tableName}/${tableName}.listSchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的listSchema出错, 请检查配置`
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
        const {action} = this.props
        const tmpObj = Object.assign({}, queryObj)
        const type = this.props.location.query.type

        tmpObj.type = type
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        this.queryObj = tmpObj
        action.fetchFinanceList(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {}) => {
        const {busiFinance} = this.props
        this.select(queryObj, busiFinance.list.pageSize, 0)
    }

    /**
     * 点击查询按钮时触发查询
     * @param 
     */
    handleFormSubmit = (newObj) => {
        const {busiFinance} = this.props
        const tmpObj = Object.assign({}, newObj)
        console.log(tmpObj)
        this.select(tmpObj, busiFinance.list.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (page) => {
        const {busiFinance} = this.props
        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10
        this.select(this.queryObj, busiFinance.list.pageSize, page)
    }

    // 渲染前
    componentDidMount() {
        this.refresh()
    }

    render() {
        const {list} = this.props.busiFinance
        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }

        return (
            <section>
                <InnerForm
                    ref="form"
                    formStyle="g-mb20 m-advance-filter"
                    schema={this.listSchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                <InnerTable
                    loading={list.tableLoading}
                    columns={list.tableColumns}
                    dataSource={list.tableData}
                    isRowSelection={false}
                    bordered={true}
                    pagination={false}
                    parentHandleSelectChange={this.parentHandleSelectChange}
                    parentHandleDoubleClick={this.parentHandleDoubleClick} />
                <InnerPagination
                    total={list.total}
                    pageSize={list.pageSize}
                    skipCount={list.skipCount}
                    parentHandlePageChange={this.handlePageChange}
                    />

            </section>
        )
    }
}

export default FinanceList
