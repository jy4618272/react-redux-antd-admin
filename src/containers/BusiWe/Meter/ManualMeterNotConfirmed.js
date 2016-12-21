// 水电业务-手工抄表-提交财务
'use strict';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Button, notification } from 'antd'
import {
    EditableCell,
    Err,
    Icons,
    InnerPagination,
    InnerForm,
    InnerTable,
    Loading,
    ModalBox
} from 'COMPONENT'

import moment from 'moment';
import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
import 'STYLE/modal.less';
import 'STYLE/button.less';

class ManualMeterNotConfirmed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
            dataSource: [],
            selectedRowKeys: [],
            selectedRows: [],
            modalInfo: {
                visible: false,
                type: 'type',
                title: '标题',
                width: '900'
            }
        }
        this.initFetchSchema(props)
        console.log('提交财务props：', props)
    }

    static defaultProps = {
        financeModal: 'financeModal'
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryManualMeterNotConfirmedSchema`);
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryManualMeterNotConfirmedSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 查询
    handleFormSubmit = (newObj) => {
        const { actionBusi } = this.props;
        newObj.checkdate = newObj.checkdate ? moment(newObj.checkdate).format('YYYY-MM') + '-01' : '';
        this.setState({
            queryObj: newObj
        });
        pageChange(newObj, 30, 0, actionBusi.fetchManualMeterNotConfirmed);
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props;
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchManualMeterNotConfirmed)
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { rateAddModal, rateEditModal } = this.props;
        const { modalInfo } = this.state
        this.setState({
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        });
        this.refs.manualMeterNotConfirmedTable.handleCancel();
    }

    // 提交财务
    handleCommitFinance = () => {
        this.props.actionBusi.fetchCommitFinance({
            partylist: JSON.stringify(this.state.selectedRows)
        });
    }

    // 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectedRowKeys: keys,
            selectedRows: rows
        })
    }

    // 取消筛选
    handleCancel = (key) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        });
        this.refs[key].hanldeCancelSelect();
    }

    componentDidMount() {
        const { actionBusi } = this.props;
        pageChange({
            checkdate: moment().subtract(1, 'months').format('YYYY-MM') + '-01'
        }, 30, 0, actionBusi.fetchManualMeterNotConfirmed);
    }

    render() {
        const data = this.props;
        const multipleSelected = this.state.selectedRowKeys.length >= 1;
        return (
            <section className="m-config-cont">
                {/* 弹框 */}
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    modalContent
                </ModalBox>

                {/* 查询 */}
                <InnerForm
                    formStyle="m-advance-filter"
                    schema={this.querySchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                {/* 表格操作 */}
                <div className="button-group g-mb10">
                    <Button onClick={this.handleCommitFinance} disabled={!multipleSelected}><Icons type="finance-b" />提交财务</Button>
                </div>

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false}
                    isRowSelection={true}
                    ref="manualMeterNotConfirmedTable"
                    parentHandleSelectChange={this.parentHandleSelectChange} />
                <InnerPagination
                    total={data.total}
                    pageSize={data.pageSize}
                    skipCount={data.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

export default ManualMeterNotConfirmed
