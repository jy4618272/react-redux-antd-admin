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

import action from 'ACTION/busiLease'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(action, dispatch)
})

@connect(
    ({ busiLease }) => ({ busiLease }),
    mapDispatchToProps
)
class ContractApproval extends Component {
    constructor(props) {
        super(props)
        console.log('$$$$', props)
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
        const {contractApproval} = this.props.busiLease
        this.select(queryObj, contractApproval.pageSize, 0)
    }

    /**
     * 切换分页时触发查询
     * @param page
     */
    handlePageChange = (page) => {
        const {contractApproval} = this.props.busiLease

        page = (page <= 1) ? 0 : (page - 1) * 10
        this.select(this.queryObj, contractApproval.pageSize, page)
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

        sessionStorage.setItem('arrovalContractShow', JSON.stringify(record))
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
        const {contractApproval} = this.props.busiLease

        return (
            <section className="padding">
                <InnerTable
                    loading={contractApproval.tableLoading}
                    columns={contractApproval.tableColumns}
                    dataSource={contractApproval.tableData}
                    bordered={true}
                    parentHandleDoubleClick={this.handleDoubleClick}
                    pagination={false} />
                <InnerPagination
                    total={contractApproval.total}
                    pageSize={contractApproval.pageSize}
                    skipCount={contractApproval.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

export default ContractApproval

