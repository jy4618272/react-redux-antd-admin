// 房间客户配置
'use strict';
import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import {
    Button,
    Modal,
    Icon,
    Input,
    notification
} from 'antd'
const confirm = Modal.confirm
const ButtonGroup = Button.Group
import {
    EditableCell,
    Err,
    Icons,
    InnerForm,
    InnerPagination,
    InnerTable,
    Loading,
} from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'

import 'STYLE/form.less';
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
    handleFormSubmit = (newObj) => {
        const { actionConfig } = this.props
        this.setState({
            queryObj: newObj
        })
        pageChange(newObj, 30, 0, actionConfig.fetchRoomList)
    }

    // 双击
    handleDoubleClick = (record, index) => {
        sessionStorage.removeItem('meterData');
        sessionStorage.setItem('meterData', JSON.stringify(record));
        window.open(`#/config/config_we_meter?rentroomid=${record.rentroomid}`);
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionConfig, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionConfig.fetchRoomList)
    }

    // 单元格编辑
    onCellChange = (index, key) => {
        const { actionConfig, tableData } = this.props
        return (value) => {
            tableData[index][key] = value;
            actionConfig.editCellValue(tableData);
        };
    }

    // 保存
    handleSaveCell = (record, value) => {
        // console.log('!!!!!!!!!', record)
        const tmpObj = Object.assign({}, {
            rentroomid: record.rentroomid,
            tel: value
        });
        this.props.actionConfig.saveCellValue(tmpObj);
    }

    componentDidMount() {
        const { actionConfig } = this.props
        pageChange({}, 30, 0, actionConfig.fetchRoomList)
    }

    render() {
        const data = this.props

        data.tableColumns.map(item => {
            if (item.key === 'tel') {
                item.width = '200';
                item.render = (text, record, index) => (
                    <EditableCell
                        value={text}
                        validate="mobile"
                        parentHandleSaveCell = {this.handleSaveCell.bind(this, record)}
                        onChange={this.onCellChange(index, item.key)} />
                )
            }
        })

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
                    pagination={false}
                    parentHandleDoubleClick={this.handleDoubleClick} />
                <InnerPagination
                    total={data.total}
                    pageSize={data.pageSize}
                    skipCount={data.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

RoomList.propTypes = {

}

export default RoomList