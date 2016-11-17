import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {
    notification
} from 'antd'
import {
    Err,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import { paths } from 'SERVICE/config'

import action from 'ACTION/approval'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ approval }) => ({ approval }),
    mapDispatchToProps
)
class list extends Component {
    constructor(props) {
        super(props)
        console.log('审批列表props', props)
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

        tmpObj.nodeStatus = 'open'
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount

        this.queryObj = tmpObj
        action.fetchApprovalTable(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (queryObj = {
        nodeStatus: 'open'
    }) => {
        const {list} = this.props.approval
        this.select(queryObj, list.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (page) => {
        const {list} = this.props.approval

        page = (page <= 1) ? 0 : (page - 1) * 10
        this.select(this.queryObj, list.pageSize, page)
    }

    // 双击查看详情
    handleDoubleClick = (record, index) => {
        console.log('单条数据：', record)
        if (!record.businessno) {
            notification.error({
                message: '字段有误',
                description: '请联系管理员'
            })
            return false
        }

        const type = record.formurl.replace(/(\w)-(\w\d+)/, '$1')

        sessionStorage.setItem('approvalData', JSON.stringify(record))
        hashHistory.push(`approval/${record.businessno}?type=${type}`)
    }

    /**
     * /workflowAdmin
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh()
    }

    render() {
        const {list} = this.props.approval
        return (
            <section className="padding">
                <InnerTable
                    loading={list.tableLoading}
                    columns={list.tableColumns}
                    dataSource={list.tableData}
                    bordered={true}
                    parentHandleDoubleClick={this.handleDoubleClick}
                    pagination={false} />
                <InnerPagination
                    total={list.total}
                    pageSize={list.pageSize}
                    skipCount={list.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

export default list

