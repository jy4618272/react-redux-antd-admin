// 房间客户配置
'use strict';
import React, { Component, PropTypes } from 'react'
import {
    Button,
    Modal,
    Icon,
    notification
} from 'antd'
const confirm = Modal.confirm
const ButtonGroup = Button.Group
import {
    Err,
    Icons,
    InnerForm,
    InnerPagination,
    InnerTable,
    Loading,
} from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
class RoomList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: []
        }
        this.initFetchSchema(props)
        console.log('水电配置-房间客户配置props：', props)
    }

    // 初始化
    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryRoomSchema.js`);
            console.log(this.addSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryRoomSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 查询
    handleFormSubmit= (newObj) => {
        const { actionRateList } = this.props
        this.setState({
            queryObj: newObj
        })
        pageChange(newObj, 10, 0, actionRateList.fetchRateList)
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionRateList, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionRateList.fetchRateList)
    }

    componentDidMount() {
        const { actionRateList } = this.props
        pageChange({}, 10, 0, actionRateList.fetchRateList)
    }

    render() {
        const data = this.props

        // 表格及分页
        const roomListCont = <div>
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
        </div>

        return (
            <section className="m-busi-cont">
                {/* 查询 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={this.querySchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                {/* 表格及分页 */}
                {roomListCont}
            </section>
        )
    }
}

RoomList.propTypes = {

}

export default RoomList