// 水电业务-手工抄表-水电录入
'use strict';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Row, Col, Button, notification } from 'antd'
const ButtonGroup = Button.Group
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
import { paths } from 'SERVICE/config'
import { filterQueryObj, checkInt } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
import 'STYLE/modal.less';
import 'STYLE/button.less';

class ManualMeterInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryObj: {
                checkdate:moment().subtract(1, 'months').format('YYYY-MM') + '-01'
            },
            dataSource: [],
            clickedRowKeys: [],
            clickedRows: [],
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
        console.log('水电录入props：', props)
    }

    static defaultProps = {
        printModal: 'printModal'
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.querySchema = require(`SCHEMA/${tableName}/${tableName}.queryManualMeterInputSchema`);
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的queryManualMeterInputSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 修改表格单元格
    onCellChange = (index, key) => {
        const { tableData } = this.props;
        return (value) => {
            tableData[index][key] = value;
        };
    }

    // 保存
    handleSaveCell = (key, record, index, value) => {
        if (key === 'currentreadout') {
            if (!checkInt(value)) {
                notification.error({
                    message: `本期示数必须为整数`,
                    description: '请输入整数'
                })
                return false;
            }

            value = value ? value : 0;
            console.log('save:', index, record, value);
            const { actionBusi, tableData } = this.props;
            const meterprice = record.meterprice;
            const meterrate = record.meterrate;
            const prereadout = parseInt(record.prereadout);
            const currentreadout = parseInt(value);

            if (currentreadout <= prereadout) {
                notification.error({
                    message: `本期示数必须大于上期示数`,
                    description: `请输入大于${prereadout}的数`
                })
                return false;
            }

            // 本期用量 = 本期示数 - 上期示数
            const currentamount = currentreadout - prereadout;
            // 金额 =  本期用量 * 单价 * 表倍率
            const currentmoney = parseFloat((meterprice * currentamount * meterrate).toFixed(2));

            actionBusi.fetchEditCurrentreadout({
                index: index,                               // 在tableData索引
                meterbillid: record.meterbillid,            // 唯一id

                meterprice,                                 // 表单价
                meterrate,                                  // 表倍率
                prereadout,                                 // 上期示数

                currentreadout,                             // 本期示数            
                currentamount,                              // 本期用量
                currentmoney                               // 金额
            });
        }
    }


    // 点击生成账单时获取数据
    fetchTableSource = () => {
        const date = this.refs.meterBill.getFieldValue('checkdate').format('YYYY-MM') + '-01';

        // 保存查询条件核算日期
        this.setState({
            queryObj: {
                checkdate: date
            }
        });

        // 生成账单之后要调用获取列表，故此加入参数pageSize和skipCount
        this.props.actionBusi.fetchReLoadMeterBill({
            checkdate: date,
            pageSize: 30,
            skipCount: 0
        });
    }

    // 点击生成账单
    handleMakeBill = (key) => {
        if (key === 'makeBill') {
            this.refs.meterBill.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    notification.error({
                        message: '表单填写有误',
                        description: '请按要求正确填写表单'
                    })
                    return false;
                } else {
                    this.fetchTableSource()
                }
            });
        }
    }

    // 查询
    handleFormSubmit = (newObj) => {
        const { actionBusi } = this.props;
        const tmpObj = Object.assign({}, this.state.queryObj, newObj);
        this.queryObj = newObj;
        pageChange(tmpObj, 30, 0, actionBusi.fetchManualMeterInput);
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, pageSize } = this.props;
        const tmpObj = Object.assign({}, this.state.queryObj, this.queryObj);
        pageChange(tmpObj, pageSize, skipCount, actionBusi.fetchManualMeterInput);
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
    }

    // 保存
    handleSave = () => {
        const { actionBusi, tableData } = this.props;
        const tmpObj = [];
        tableData.map((item, index) => {
            tmpObj.push({
                "meterbillid": item.meterbillid,
                "prereadout": item.prereadout,
                "currentreadout": item.currentreadout
            });
        });
        console.log('水电录入保存数据：', tmpObj)
        actionBusi.fetchSaveManualMeterInput({
            meterbilllist: JSON.stringify(tmpObj)
        });
    }

    // 导出本页
    handleExportPage = () => {
        let arrParam = [];
        this.props.tableData.map(item => {
            arrParam.push(item.meterbillid)
        });
        if (arrParam.length) {
            notification.success({
                message: '导出本页',
                description: `导出${arrParam.length}条数据`,
            });
            window.location.href = paths.leasePath + '/meterbillcs/selectByRentPactIdListToExcel?meterbillids=' + arrParam.join(',')
        }
    }

    componentDidMount() {
        const checkdate = moment().subtract(1, 'months');
        this.refs.meterBill.setFieldsValue({
            checkdate: checkdate
        });
        pageChange({
            checkdate: checkdate.format('YYYY-MM') + '-01'
        }, 30, 0, this.props.actionBusi.fetchManualMeterInput);
    }

    render() {
        const data = this.props;
        const tableColumns = [
            {
                title: '核算年月',
                dataIndex: 'checkdate',
                key: 'checkdate',
                width: '15%'
            },
            {
                title: '类型',
                dataIndex: 'metertype',
                key: 'metertype',
                width: '10%'
            },
            {
                title: '设备编号',
                dataIndex: 'metercode',
                key: 'metercode',
                width: '10%'
            },
            {
                title: '客户名称',
                dataIndex: 'organization',
                key: 'organization',
                width: '15%'
            },
            {
                title: '房间号',
                dataIndex: 'room',
                key: 'room',
                width: '10%'
            },
            {
                title: '上期示数',
                dataIndex: 'prereadout',
                key: 'prereadout',
                width: '10%'
            },
            {
                title: '本期示数',
                dataIndex: 'currentreadout',
                key: 'currentreadout',
                width: '10%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        validate="int"
                        editable={true}
                        noButton={true}
                        parentHandleSaveCell={this.handleSaveCell.bind(this, 'currentreadout', record, index)}
                        onChange={this.onCellChange(index, 'currentreadout')} />
                )
            },
            {
                title: '本期用量',
                dataIndex: 'currentamount',
                key: 'currentamount',
                width: '10%'
            },
            {
                title: '金额',
                dataIndex: 'currentmoney',
                key: 'currentmoney',
                width: '10%'
            }
        ];

        return (
            <section className="m-config-cont">
                {/* 弹框 */}
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    modalContent
                </ModalBox>

                <InnerForm
                    ref="meterBill"
                    schema={this.querySchema['from']['query']}
                    buttonSchema={this.querySchema['from']['buttons']}
                    parentHandleClick={this.handleMakeBill} />

                {/* 查询 */}
                <InnerForm
                    formStyle="m-advance-filter"
                    schema={this.querySchema.query}
                    showSearch={true}
                    parentHandleSubmit={this.handleFormSubmit} />
                {/* 表格操作 */}
                <Row className="g-mb10">
                    <Col sm={16}>
                        <ButtonGroup className="button-group">
                            <Button onClick={this.handleSave}><Icons type="receipt" />保存</Button>
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

export default ManualMeterInput