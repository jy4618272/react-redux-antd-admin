// 人工表
'use strict';
import React, { Component, PropTypes } from 'react'
import {
    Button,
    Modal,
    Icon,
    message,
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
import { ModalBox } from 'COMPONENT'

import { filterQueryObj } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'

import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'

class ManualMeter extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            updateStatus: false, 
            queryObj: {
                rentroomid: props.query.rentroomid,
                readtype: '人工表' 
            },
            saveObj: {
                ...JSON.parse(sessionStorage.getItem('meterData')),
                readtype: '人工表' 
            },
            clickedRowKeys: [],
            clickedRows: [],
            modalInfo: {
                visible: false,
                type: 'add',
                title: '新增',
                width: '700'
            }
        }
        console.log('水电配置-人工表props：', props)
    }

    static defaultProps = {
        meterModal: 'meterModal',
        meterManualTable: 'meterManualTable'
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionConfig, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionConfig.fetchManualMeter)
    }

    // 弹窗确认
    parentHandleModalOk = () => {
        const { meterModal, meterManualTable, actionConfig } = this.props;
        const _meterModal = this.refs[meterModal]
        const { modalInfo, clickedRows, saveObj } = this.state
        // 新增
        _meterModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            } else {
                const oldObj = _meterModal.getFieldsValue();
                if (modalInfo.type === 'add') {
                    // 人工表新增
                    const newObj = Object.assign({}, saveObj, oldObj);
                    console.log('人工表新增数据', newObj)
                    
                    actionConfig.fetchAddManualMeter(newObj)
                } else {
                    // 人工表修改
                    const newObj = Object.assign({}, {
                        readtype: clickedRows[0].readtype,
                        roommeterid: clickedRows[0].roommeterid
                    }, oldObj);
                    console.log('人工表修改数据', newObj);
                    actionConfig.fetchEditManualMeter(newObj);
                    this.handleCancel(meterManualTable)
                }
                this.parentHandleModalCancel();
            }
        });
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { meterModal } = this.props
        const { modalInfo } = this.state
        this.setState({
            updateStatus: false,            
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })

        // 关闭时候重置弹窗
        this.refs[meterModal].resetFields();
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
        const {meterModal, actionConfig} = this.props;
        if(key === 'metercode'){
            // 设备号验证唯一性
            const metercode = this.refs[meterModal].getFieldValue(key);
            if(metercode === undefined || metercode.trim() === ''){
                notification.error({
                    message:'设备号不可用',
                    description: '请输入正确的设备号'
                });
            }else{
                actionConfig.validateMetercode({metercode})
            }
        } else if(key === 'metername'){
            // 表名称验证唯一性
            const metername = this.refs[meterModal].getFieldValue(key);
            if(metername === undefined || metername.trim() === ''){
                notification.error({
                    message:'表名称不可用',
                    description: '请输入正确的表名称'
                });
            } else {
                actionConfig.validateMetername({metername})
            }
        }
    }
    
    // 下拉选择
    parentHandleSelect = (key, value) => {
        if(key === 'metertype'){
            // 重置
            this.refs[this.props.meterModal].resetFields(['chargetype', 'meterrate']);
            // 级联计费类型下拉列表数据
            this.props.actionConfig.selectMeterType({metertype: value});
        } else if(key === 'chargetype'){
            // 获取计费类型相关的值
            const tmpObj = this.props.modalForm[3].options.filter(item => 
                item.value === value
            );
            this.setState({
                updateStatus: false,
                saveObj: {
                    ...this.state.saveObj,
                    meterchangetypeid: tmpObj[0].meterchangetypeid,
                    meterprice: tmpObj[0].meterprice,
                    meterrate: tmpObj[0].meterrate,
                    metertype: tmpObj[0].metertype
                }
            });

            this.refs[this.props.meterModal].setFieldsValue({
                meterrate: parseInt(tmpObj[0].meterrate)
            })
        }
    }

    // 修改
    handleEdit = (dispatch) => {
        const { clickedRows } = this.state;
        this.props.modalForm[0].disabled = true;
        // 获取计费类型下拉列表数据
        this.props.actionConfig.selectMeterType({metertype: clickedRows[0].metertype});
        this.setState({
            updateStatus: true,
            modalInfo: {
                visible: true,
                type: 'edit',
                title: `修改${clickedRows[0].metertype}表-${clickedRows[0].metername}`,
                width: '700'
            }
        })
    }

    // 删除
    handleDel = () => {
        const { clickedRows } = this.state;
        const { meterManualTable, actionConfig } = this.props;
        const that = this;
        confirm({
            title: `删除${clickedRows[0].metertype}表-${clickedRows[0].metername}`,
            content: '确认删除？',
            onOk() {
                actionConfig.fetchDelManualMeter({
                    metertype: clickedRows[0].metertype,
                    metername: clickedRows[0].metername,
                    roommeterid: clickedRows[0].roommeterid
                })
                that.handleCancel(meterManualTable)
            },
            onCancel() { }
        })
    }

    componentDidMount() {
        pageChange(this.state.queryObj, 30, 0, this.props.actionConfig.fetchManualMeter)
    }

    componentDidUpdate() {  
        if(this.state.updateStatus){         
            this.refs[this.props.meterModal].setFieldsValue(this.state.clickedRows[0]);  
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
                    <InnerForm
                        schema={this.props.modalForm} 
                        ref={this.props.meterModal}
                        parentHandleBlur={this.parentHandleBlur}
                        parentHandleSelect={this.parentHandleSelect} />
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
                    ref={this.props.meterManualTable}
                    rowClassName={this.props.meterManualTable}
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

export default ManualMeter