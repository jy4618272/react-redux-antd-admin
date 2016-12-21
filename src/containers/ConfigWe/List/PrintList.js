// 打印参数配置
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
import { filterQueryObj, filterQueryObjMoment } from 'UTIL'
import { pageChange } from 'UTIL/pageChange'
class RateList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateStatus: false,
            clickedRowKeys: [],
            clickedRows: [],
            modalInfo: {
                visible: false,
                type: 'add',
                title: '新增',
                width: '700'
            }
        }
        console.log('水电配置-打印参数配置props：', props)
    }

    static defaultProps = {
        printModal: 'printModal',
        printTable: 'printTable'
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionConfig, pageSize } = this.props
        pageChange(this.state.queryObj, pageSize, skipCount, actionConfig.fetchPrintList)
    }

    // 弹窗确认
    parentHandleModalOk = () => {
        const { printModal, actionConfig, printTable } = this.props
        const _printModal = this.refs[printModal]
        const { modalInfo, clickedRows } = this.state
        
        // 新增
        _printModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            } else {
                const oldObj = _printModal.getFieldsValue()
                let newObj = {}
                for(const key in oldObj){
                    if (oldObj[key]) {
                        if (key.indexOf('checkdate') > -1) {
                            newObj[key] = oldObj[key].format('YYYY-MM') + '-01'
                        } else if(key.indexOf('readingdate') > -1) {
                            newObj[key] = oldObj[key].format('YYYY-MM-DD');
                        } else{
                            newObj[key] = oldObj[key]
                        }
                    }
                }
                if (modalInfo.type === 'add') {
                    // 新增
                    console.log('打印参数配置数据保存：', newObj);
                    actionConfig.fetchPrintAdd(newObj);
                }else {
                    // 修改
                    newObj = Object.assign({}, {
                        meterprintinfoid: clickedRows[0].meterprintinfoid
                    }, newObj);
                    console.log('打印参数配置数据保存：', newObj);
                    actionConfig.fetchPrintEdit(newObj);                    
                }
                this.handleCancel(printTable);
                this.parentHandleModalCancel();
            }
        })
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { printModal, actionConfig } = this.props
        const { modalInfo } = this.state
        this.setState({
            updateStatus: false,
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })

        // 关闭时候重置弹窗
        actionConfig.cancelEditPrintList();
        this.refs[printModal].resetFields();
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
        this.refs[key].handleCancelClick();
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
        this.props.actionConfig.toEditPrintList();
        this.setState({
            updateStatus: true,
            modalInfo: {
                visible: true,
                type: 'edit',
                title: `修改核算年月${clickedRows[0].checkdate}`,
                width: '700'
            }
        });
    }

    // 删除
    handleDel = () => {
        const { clickedRows } = this.state;
        const { printTable, actionConfig } = this.props;
        const that = this;
        confirm({
            title: `删除核算年月${clickedRows[0].checkdate}`,
            content: '确认删除？',
            onOk() {
                actionConfig.fetchPrintDelete({
                    meterprintinfoid: clickedRows[0].meterprintinfoid
                });
                that.handleCancel(printTable);
            },
            onCancel() { }
        })
    }

    componentDidMount() {
        const { actionConfig } = this.props
        pageChange({}, 30, 0, actionConfig.fetchPrintList);
    }

    componentDidUpdate(nextProps, nextState) {
        if(this.state.updateStatus){     
            // alert('componentDidUpdate')    
            this.refs[this.props.printModal].setFieldsValue(filterQueryObjMoment(this.state.clickedRows[0]));
        } 
    }

    render() {
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
                        ref={this.props.printModal}
                        parentHandleBlur={this.parentHandleBlur}
                        schema={data.modalForm} />
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
                    ref={this.props.printTable}
                    rowClassName={this.props.printTable}
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