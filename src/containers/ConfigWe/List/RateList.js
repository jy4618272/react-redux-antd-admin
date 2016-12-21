// 单价倍率配置
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
import {
    ModalBox
} from 'COMPONENT'
import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
class RateList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateStatus: false, 
            queryObj: {},
            clickedRowKeys: [],
            clickedRows: [],
            modalInfo: {
                visible: false,
                type: 'add',
                title: '新增',
                width: '700'
            }
        }
        this.initFetchSchema(props)
        console.log('水电配置-单价倍率配置props：', props)
    }

    static defaultProps = {
        rateModal: 'rateModal',
        rateListTable: 'rateListTable'
    }

    initFetchSchema(props) {
        const tableName = props.tableName
        try {
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.addRateSchema.js`);
            console.log(this.addSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的addRateSchema出错, 请检查配置`
            return false
        }
        this.inited = true
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionConfig, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionConfig.fetchRateList)
    }

    // 弹窗确认
    parentHandleModalOk = () => {
        const { rateModal, actionConfig, rateListTable } = this.props;
        const _rateModal = this.refs[rateModal];
        const { modalInfo, clickedRows } = this.state;
        
        _rateModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            } else {
                const oldObj = _rateModal.getFieldsValue()
                let newObj = filterQueryObj(oldObj)
                if (modalInfo.type === 'add') {
                    // 新增
                    console.log('单价倍率配置新增数据', newObj);                    
                    actionConfig.fetchRateAdd(newObj);
                } else {
                    // 修改
                    newObj = Object.assign({}, newObj, {
                        meterchangetypeid: clickedRows[0].meterchangetypeid
                    });
                    console.log('单价倍率配置修改数据', newObj);
                    actionConfig.fetchRateEdit(newObj);
                }   
                this.handleCancel(rateListTable);
                this.parentHandleModalCancel();
            }
        });
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { rateModal } = this.props
        const { modalInfo } = this.state
        this.setState({
            updateStatus: false,            
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })

        // 关闭时候重置弹窗
        this.refs[rateModal].resetFields();
    }

    // 单击选中
    parentHandleRowClick = (keys, rows) => {
        this.setState({
            clickedRowKeys: keys,
            clickedRows: rows
        })
    }

    // 取消勾选
    handleCancel = (key) => {
        this.setState({
            clickedRowKeys: [],
            clickedRows: []
        })
        this.refs[key].handleCancelClick()
    }

    // 新增
    handleAdd = () => {
        this.setState({
            modalInfo: {
                visible: true,
                type: 'add',
                title: '新增',
                width: '700'
            }
        })
    }

    // 新增表单失去焦点
    parentHandleBlur = (key) => {
        this.state.updateStatus && this.setState({
            updateStatus: false
        });
    }

    // 修改
    handleEdit = (dispatch) => {
        const { clickedRows } = this.state;
        this.setState({
            updateStatus: true,
            modalInfo: {
                visible: true,
                type: 'edit',
                title: `修改${clickedRows[0].metertype}-${clickedRows[0].meterchangetypeid}`,
                width: '700'
            }
        });
    }

    // 删除
    handleDel = () => {
        const { clickedRows } = this.state;
        const { rateListTable, actionConfig } = this.props;
        const that = this;
        confirm({
            title: `删除${clickedRows[0].metertype}-${clickedRows[0].meterchangetypeid}`,
            content: '确认删除？',
            onOk() {
                actionConfig.fetchRateDelete({
                    metertype: clickedRows[0].metertype,
                    meterchangetypeid: clickedRows[0].meterchangetypeid
                });
                that.handleCancel(rateListTable);
            },
            onCancel() { }
        });
    }

    componentDidMount() {
        const { actionConfig } = this.props
        pageChange({}, 30, 0, actionConfig.fetchRateList)
    }

    componentDidUpdate() {  
        if(this.state.updateStatus){         
            this.refs[this.props.rateModal].setFieldsValue(this.state.clickedRows[0])    
        }    
    }

    render() {
        const data = this.props;
        const { modalInfo, clickedRowKeys, clickedRows } = this.state;
        const oneSelected = clickedRowKeys.length === 1;
    
        return (
            <section className="m-config-cont">
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                     { !this.inited ? 
                        <Err errorMsg={this.errorMsg} />
                        :
                        <InnerForm
                            ref={this.props.rateModal}
                            schema={this.addSchema}
                            parentHandleBlur={this.parentHandleBlur} />
                    }
                </ModalBox>

                {/* 表格操作按钮 */}
                <ButtonGroup className="button-group g-mb10">
                    <Button onClick={this.handleAdd}><Icons type="add" />新增</Button>
                    <Button disabled={!oneSelected} onClick={this.handleEdit}><Icons type="edit" />修改</Button>
                    <Button disabled={!oneSelected} onClick={this.handleDel}><Icon type="close-circle-o" />删除</Button>
                </ButtonGroup>

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false}
                    ref={this.props.rateListTable}
                    rowClassName={this.props.rateListTable}
                    parentHandleRowClick={this.parentHandleRowClick} />
                <InnerPagination
                    total={data.total}
                    pageSize={data.pageSize}
                    skipCount={data.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        )
    }
}

RateList.propTypes = {

}

export default RateList