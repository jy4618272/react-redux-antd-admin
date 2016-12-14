// 水电业务-智能表
'use strict';
import React, { Component, PropTypes } from 'react'
import { notification } from 'antd'
import {
    Err,
    InnerPagination,
    InnerForm,
    InnerTable,
    Loading,
} from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
class IntelligentMeter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: []
        }
        this.initFetchSchema(props)
        console.log('水电业务-智能表props：', props)
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryIntelligentMeterSchema.js`);
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryIntelligentMeterSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 查询
    handleFormSubmit = () => {

    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchRateList)
    }

    componentDidMount() {
        const { actionBusi } = this.props
        pageChange({}, 10, 0, actionBusi.fetchRateList)
    }

    render() {
        const data = this.props

        return (
            <section className="m-config-cont">
                {/* 查询 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={this.querySchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false} />
                <InnerPagination
                    total={data.total}
                    pageSize={data.pageSize}
                    skipCount={data.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

export default IntelligentMeter