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
        rateAddModal: 'rateAddModal',
        rateEditModal: 'rateEditModal',
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
        const { rateAddModal, rateEditModal } = this.props
        const _rateAddModal = this.refs[rateAddModal]
        const _rateEditModal = this.refs[rateEditModal]
        const { modalInfo } = this.state
        if (modalInfo.type === 'add') {
            // 新增
            _rateAddModal.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    notification.error({
                        message: '表单填写有误',
                        description: '请按要求正确填写表单'
                    })
                    return false;
                } else {
                    // 单价倍率配置新增
                    const oldObj = _rateAddModal.getFieldsValue()
                    let newObj = filterQueryObj(oldObj)
                    console.log('单价倍率配置新增数据', newObj)

                    this.props.actionConfig.fetchRateAdd(newObj)
                    this.parentHandleModalCancel();
                }
            })
        } else if (modalInfo.type === 'edit') {
            // 修改
            _rateEditModal.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    notification.error({
                        message: '表单填写有误',
                        description: '请按要求正确填写表单'
                    })
                    return false;
                } else {
                    // 单价倍率配置修改
                    const oldObj = _rateEditModal.getFieldsValue()
                    const meterchangetypeid = this.state.clickedRows[0].meterchangetypeid
                    let newObj = Object.assign({}, filterQueryObj(oldObj), {
                        meterchangetypeid
                    })
                    console.log('单价倍率配置修改数据', newObj)
                    this.props.actionConfig.fetchRateEdit(newObj)

                    this.handleCancel(this.props.rateListTable)
                    this.parentHandleModalCancel();
                }
            })
        }
    }

    // 弹框关闭
    parentHandleModalCancel = () => {
        const { rateAddModal, rateEditModal } = this.props
        const { modalInfo } = this.state
        this.setState({
            updateStatus: false,            
            modalInfo: Object.assign({}, this.state.modalInfo, {
                visible: false,
                title: '正在关闭...',
            })
        })

        // 关闭时候重置弹窗
        if (modalInfo.type == 'add') {
            this.refs[rateAddModal].resetFields();
        } else if (modalInfo.type == 'edit') {
            this.refs[rateEditModal].resetFields();
        }
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
                title: '新增单价倍率配置',
                width: '700'
            }
        })
    }

    // 修改
    handleEdit = (dispatch) => {
        const { clickedRows } = this.state
        this.setState({
            updateStatus: true,
            modalInfo: {
                visible: true,
                type: 'edit',
                title: `修改${clickedRows[0].metertype}-${clickedRows[0].meterchangetypeid}`,
                width: '700'
            }
        })

        // this.timer = setTimeout(() => {
        //     this.refs[this.props.rateEditModal].setFieldsValue(clickedRows[0])
        // }, 0)
    }

    // 删除
    handleDel = () => {
        const { clickedRows } = this.state
        confirm({
            title: `删除${clickedRows[0].metertype}-${clickedRows[0].meterchangetypeid}`,
            content: '确认删除？',
            onOk() {
                alert('接口还没有')
                this.handleCancel(this.props.rateListTable)
            },
            onCancel() { }
        })
    }

    componentDidMount() {
        const { actionConfig } = this.props
        pageChange({}, 30, 0, actionConfig.fetchRateList)
    }

    componentDidUpdate() {  
        if(this.state.updateStatus){         
            this.refs[this.props.rateEditModal].setFieldsValue(this.state.clickedRows[0])    
        }    
    }

    render() {
        const data = this.props
        const { modalInfo, clickedRowKeys, clickedRows } = this.state
        const oneSelected = clickedRowKeys.length === 1
        // 表格操作按钮
        const rateListButtons = <ButtonGroup className="button-group g-mb10">
            <Button onClick={this.handleAdd}><Icons type="add" />新增</Button>
            <Button disabled={!oneSelected} onClick={this.handleEdit}><Icons type="edit" />修改</Button>
            <Button disabled={!oneSelected} onClick={this.handleDel}><Icon type="close-circle-o" />删除</Button>
        </ButtonGroup>

        // 表格及分页
        let rateListCont
        rateListCont = <div>
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
        </div>

        // 弹框内容
        let modalContent = ''
        if (!this.inited) {
            modalContent = <Err errorMsg={this.errorMsg} />
        }
        if (modalInfo.type === 'add') {
            modalContent = <InnerForm
                ref={this.props.rateAddModal}
                schema={this.addSchema} />
        } else if (modalInfo.type === 'edit') {
            modalContent = <InnerForm
                ref={this.props.rateEditModal}
                schema={this.addSchema} />
        }

        return (
            <section className="m-config-cont">
                <ModalBox
                    {...this.state.modalInfo}
                    parentHandleModalOk={this.parentHandleModalOk}
                    parentHandleModalCancel={this.parentHandleModalCancel}>
                    {modalContent}
                </ModalBox>

                {/* 表格操作按钮 */}
                {rateListButtons}

                {/* 表格及分页 */}
                {rateListCont}
            </section>
        )
    }
}

RateList.propTypes = {

}

export default RateList