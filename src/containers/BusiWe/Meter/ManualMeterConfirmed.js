// 水电业务-手工抄表-水电管理
'use strict';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import moment from 'moment';
import { Row, Col, Button, notification } from 'antd'
const ButtonGroup = Button.Group;
import {
    DetailWe,
    Err,
    Icons,
    InnerPagination,
    InnerForm,
    InnerTable,
    Loading,
    ModalBox
} from 'COMPONENT';

import { filterQueryObj } from 'UTIL';
import { pageChange } from 'UTIL/pageChange';
import { paths } from 'SERVICE/config'
import 'STYLE/button.less';

class ManualMeterConfirmed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {},
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
        console.log('水电业务-水电管理props：', props)
    }

    static defaultProps = {
        manualMeterConfirmed: "manualMeterConfirmed"
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryManualMeterConfirmedSchema`);
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryManualMeterConfirmedSchema出错, 请检查配置`
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
        pageChange(newObj, 30, 0, actionBusi.fetchManualMeterConfirmed);
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionBusi.fetchManualMeterConfirmed)
    }

    /**
     * 需要打印的内容都放在 .printContent 中，同一时间只会存在一个，搜索printContent，查看所有可能需要打印的内容
     * 获取到需要打印的html片段，写入localStorage,key值为printContent
     */
    saveToLocalStorage() {
        // 获取需要打印的html片段
        const html = document.getElementsByClassName('printContent')[0].innerHTML
        // 写入localStorage
        localStorage.setItem('printContent', html)
    }

    // 双击查看详情
    handleDoubleClick = (record, index) => {
        window.open(`#/busi/busi_we/${record.partyid}?checkdate=${record.checkdate}`);
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

    // 打印交款单
    handlePrintPayment = () => {
        let arr = [];
        this.state.selectedRows.forEach(item => {
            arr.push({
                meterpaymentid: item.meterpaymentid
            })
        });
        this.props.actionBusi.fetchPrintPayment({
            meterpaymentlist: JSON.stringify(arr)
        });
        this.setState({
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: true,
                type: 'print',
                title: '打印交款单',
                footer: <div className="button-group gutter">
                    <Button type="default" onClick={this.parentHandleModalCancel}>取消</Button>
                    <Link to={`print/printPreview/33`} target="_blank">
                        <Button type="primary" onClick={this.saveToLocalStorage}>打印</Button>
                    </Link>
                </div>
            })
        })
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { manualMeterConfirmed } = this.props;
        const { modalInfo } = this.state;
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            modalInfo: Object.assign({}, modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        });
        this.handleCancel('weManageTable');
    }

    // 导出本页
    handleExportPage = () => {
        let arrParam = [];
        this.props.tableData.map(item => {
            arrParam.push(item.meterpaymentid)
        });
        if (arrParam.length) {
            notification.success({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });
            window.location.href = paths.leasePath + '/meterpaymentcs/selectByRentPactIdListToExcel?meterpaymentids=' + arrParam.join(',')
        }
    }

    componentDidMount() {
        const { actionBusi, } = this.props
        pageChange({}, 30, 0, actionBusi.fetchManualMeterConfirmed)
    }


    render() {
        const data = this.props;
        const multipleSelected = this.state.selectedRowKeys.length >= 1;

        let modalContent
        if (data.printPayment.tableLoading) {
            modalContent = <Loading />
        } else {
            modalContent = <div className="printContent">
                <DetailWe {...data.printPayment} />
            </div>
        }

        return (
            <section className="m-config-cont">
                {/* 弹框 */}
                <ModalBox
                    {...this.state.modalInfo}
                    wrapClassName="modal-wrap"
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    {modalContent}
                </ModalBox>

                {/* 查询 */}
                <InnerForm
                    ref="form"
                    formStyle="m-advance-filter"
                    schema={this.querySchema}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />

                {/* 表格操作 */}
                <Row className="g-mb10">
                    <Col sm={16}>
                        <ButtonGroup className="button-group">
                            <Button disabled={!multipleSelected} onClick={this.handlePrintPayment}><Icons type="receipt" />打印交款单</Button>
                        </ButtonGroup>
                    </Col>
                    <Col sm={8} className="g-tar">
                        <ButtonGroup className="button-group">
                            <Button type="primary" onClick={this.handleExportPage}>导出本页</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false}
                    isRowSelection={true}
                    ref="weManageTable"
                    parentHandleDoubleClick={this.handleDoubleClick}
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

export default ManualMeterConfirmed