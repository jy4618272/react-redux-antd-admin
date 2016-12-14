// 水电业务-手工抄表-未提交
'use strict';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row, Col, Button, notification } from 'antd'
const ButtonGroup = Button.Group
import {
    Err,
    Icons,
    InnerPagination,
    InnerForm,
    InnerTable,
    Loading,
    ModalBox
} from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
import 'STYLE/modal.less';
import 'STYLE/button.less';

class EditableCell extends Component {

}
class ManualMeterConfirmed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
            dataSource:[],
            clickedRowKeys: [],
            clickedRows: [],
            modalInfo: {
                visible: false,
                type: 'type',
                title: '标题',
                width: '900'
            }
        }

        this.tableColumns = [
            {
                title: '核算年月',
                dataIndex: '1',
                key: '1'
            },
            {
                title: '类型',
                dataIndex: '2',
                key: '2'
            },
            {
                title: '设备编号',
                dataIndex: '3',
                key: '3'
            },
            {
                title: '客户名称',
                dataIndex: '4',
                key: '4'
            },
            {
                title: '房间号',
                dataIndex: '5',
                key: '5'
            },
            {
                title: '上期示数',
                dataIndex: '6',
                key: '6'
            },
            {
                title: '本期示数',
                dataIndex: 'name',
                // key: '7'
                render: (text, record, index) => {
                    <EditableCell
                        value={text}
                        onChange={this.onCellChange(index, 'name')} />
                }
            },
            {
                title: '本期用量',
                dataIndex: '8',
                key: '8'
            },
            {
                title: '余额',
                dataIndex: '9',
                key: '9'
            }
        ];
        this.initFetchSchema(props)
        console.log('水电业务-手工抄表-已提交props：', props)
    }

    static defaultProps = {
        printModal: 'printModal'
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

    // 修改表格单元格
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({ dataSource });
        };
    }


    // 生成菜单
    handleMakeMenu = () => {

    }
    // 查询
    handleFormSubmit = () => {

    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchRateList)
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { rateAddModal, rateEditModal } = this.props
        const { modalInfo } = this.state
        this.setState({
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })
    }

    // 导出本页
    handleExportPage = () => {
        alert('导出本页')
    }

    componentDidMount() {
        const { actionBusi } = this.props
        pageChange({}, 30, 0, actionBusi.fetchRateList)
    }

    render() {
        const data = this.props
        const tableControl = <Row className="g-mb10">
            <Col sm={16}>
                <ButtonGroup className="button-group">
                    <Button onClick={this.handleSave}><Icons type="receipt" />保存</Button>
                    <Button onClick={this.handleCommitFinance}><Icons type="finance-b" />提交财务</Button>
                </ButtonGroup>
            </Col>
            <Col sm={8} className="g-tar">
                <ButtonGroup className="button-group">
                    <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                </ButtonGroup>
            </Col>
        </Row>

        let modalContent = <div>
            1
        </div>

        return (
            <section className="m-config-cont">
                {/* 弹框 */}
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    {modalContent}
                </ModalBox>

                <InnerForm
                    ref="form"
                    schema={this.querySchema['from']['query']}
                    buttonSchema={this.querySchema['from']['buttons']}
                    parentHandleClick={this.handleMakeMenu} />

                {/* 查询 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={this.querySchema.query}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                {/* 表格操作 */}
                {tableControl}

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={this.tableColumns}
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

export default ManualMeterConfirmed