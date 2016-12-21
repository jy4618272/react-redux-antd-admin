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
            queryObj: {}
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
    handleFormSubmit = (newObj) => {
        const { actionBusi } = this.props;
        this.setState({
            queryObj: newObj
        });
        pageChange(newObj, 30, 0, actionBusi.fetchIntelligentMeter);
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props;
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchIntelligentMeter)
    }

    // 催交
    handleReminders = (text, record, index) => {
        this.props.actionBusi.fetchReminders({
            roommeterid: record.roommeterid
        });
    }

    componentDidMount() {
        const { actionBusi } = this.props
        pageChange({}, 30, 0, actionBusi.fetchIntelligentMeter)
    }

    render() {
        const data = this.props
        const tableColumns = data.tableColumns.concat([
            {
                dateIndex: 'operation',
                key: 'operation',
                title: '操作',
                render: (text, record, index) => {
                    let showReminderButton
                    if ((record.receivemessage === '1') && record.surplusnumber && record.firstthreshold && (parseInt(record.surplusnumber) < parseInt(record.firstthreshold))) {
                        showReminderButton = <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleReminders.bind(this, text, record, index)}>催交</a>
                    } else {
                        showReminderButton = ''
                    }

                    return (
                        <div class="button-group">
                            {showReminderButton}
                        </div>
                    )
                }
            }
        ])
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
                    columns={tableColumns}
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