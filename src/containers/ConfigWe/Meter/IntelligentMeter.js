// 智能表
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
class IntelligentMeter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateStatus: false, 
            queryObj: {
                rentroomid: props.query.rentroomid,
                readtype: '智能表' 
            },
            saveObj: {
                ...JSON.parse(sessionStorage.getItem('meterData')),
                readtype: '智能表' 
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
        console.log('水电配置-智能表props：', props)
    }

    static defaultProps = {
        meterModal: 'meterModal',
        meterIntelligentTable: 'meterIntelligentTable'
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionConfig, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionConfig.fetchIntelligentMeter)
    }

    // 弹窗确认
    parentHandleModalOk = () => {
        const { meterModal, meterIntelligentTable, actionConfig } = this.props;
        const _meterModal = this.refs[meterModal]
        const { modalInfo, clickedRows, saveObj } = this.state
        
        _meterModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            } else {
                const oldObj = _meterModal.getFieldsValue();
                if((parseInt(oldObj.secondthreshold) > parseInt(oldObj.firstthreshold))){
                    _meterModal.resetFields(['secondthreshold']);
                    notification.error({
                        message:'二级阀值输入有误',
                        description: '二级阀值不可大于或等于一级阀值'
                    });
                    return false;
                }
                if (modalInfo.type === 'add') {
                    // 智能表新增                        
                    const newObj = Object.assign({}, saveObj, oldObj);
                    console.log('智能表新增数据', newObj)

                    actionConfig.fetchAddIntelligentMeter(newObj);
                } else {
                    // 人工表修改
                    const newObj = Object.assign({}, {
                        readtype: clickedRows[0].readtype,
                        roommeterid: clickedRows[0].roommeterid
                    }, oldObj);
                    console.log('智能表修改数据', newObj);
                    actionConfig.fetchEditIntelligentMeter(newObj);
                    this.handleCancel(meterIntelligentTable)
                }
                this.parentHandleModalCancel();
            }
        })
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { meterModal, actionConfig } = this.props
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
        });
        this.props.modalForm[0].disabled = false;
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
        this.setState({
            // updateStatus: false
        });
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

    // 修改
    handleEdit = (dispatch) => {
        const { clickedRows } = this.state;
        this.props.modalForm[0].disabled = true;

        this.setState({
            updateStatus: true,
            modalInfo: {
                visible: true,
                type: 'edit',
                title: `修改${clickedRows[0].metertype}表-${clickedRows[0].metername}`,
                width: '700'
            }
        });
    }

    // 删除
    handleDel = () => {
        const { clickedRows } = this.state;
        const { meterIntelligentTable, actionConfig } = this.props;
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

    // 读取
    handleRead = () => {
        alert('no api')
    }

    componentWillMount() {
        pageChange(this.state.queryObj, 30, 0, this.props.actionConfig.fetchIntelligentMeter)
    }

    componentDidUpdate() {  
        if(this.state.updateStatus){     
            alert('componentDidUpdate')    
            this.refs[this.props.meterModal].setFieldsValue(this.state.clickedRows[0]);
        }    
    }

    render() {
        alert('render')
        const data = this.props
        const { modalInfo, clickedRowKeys, clickedRows } = this.state
        const oneSelected = clickedRowKeys.length === 1

        return (
            <section className="m-config-cont">
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    <InnerForm
                        schema={this.props.modalForm} 
                        ref={this.props.meterModal}
                        parentHandleBlur={this.parentHandleBlur} />
                </ModalBox>

                {/* 表格操作按钮 */}
                <ButtonGroup className="button-group g-mb10">
                    <Button onClick={this.handleAdd}><Icons type="add" />新增</Button>
                    <Button disabled={!oneSelected} onClick={this.handleEdit}><Icons type="edit" />修改</Button>
                    <Button disabled={!oneSelected} onClick={this.handleDel}><Icon type="close-circle-o" />删除</Button>
                    <Button onClick={this.handleRead}><Icon type="close-circle-o" />读取</Button>
                </ButtonGroup>

                {/* 表格及分页 */}
                <InnerTable
                    loading={data.tableLoading}
                    columns={data.tableColumns}
                    dataSource={data.tableData}
                    bordered={true}
                    pagination={false}
                    ref={this.props.meterIntelligentTable}
                    rowClassName={this.props.meterIntelligentTable}
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

export default IntelligentMeter