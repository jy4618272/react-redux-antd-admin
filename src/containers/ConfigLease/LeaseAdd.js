import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Table,
    Button,
    Icon,
    Modal,
    Form,
    InputNumber,
    Input,
    DatePicker,
    notification
} from 'antd'

const FormItem = Form.Item

import {
    ModalForm,
    InnerForm,
    InnerTable
} from 'COMPONENT'

import actionLeaseAdd from 'ACTION/configLease/leaseAdd'
import { filterQueryObj } from 'UTIL'

const mapDispatchToProps = (dispatch) => ({
    actionLeaseAdd: bindActionCreators(actionLeaseAdd, dispatch)
})

@connect(
    ({ configLease }) => ({ configLease }),
    mapDispatchToProps
)
class LeaseAdd extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            modalOpenBtn: 'roomGoodsInsert',
            modalName: 'roomGoodsInsert',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '500',
            tableDataGoods: []
        }
        this.initFetchSchema(props)
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const tableName = props.routes.pop().tableName // lease        
        const addType = props.location.query.type

        if (tableName) {
            console.info('init component Finance with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        /**
         * 新增
         * @params 房间设置、班线管理、政策优惠等
         */
        if (addType) {
            console.info('init component LeaseAdd with addType = %s', addType)
        } else {
            console.error('can not find addType, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到新增哪个页面, 请检查路由配置'
            return false
        }
        this.addType = addType

        try {
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.addSchema.js`)
            this.modalSchema = require(`SCHEMA/${tableName}/${tableName}.modalSchema.js`)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${addType}表的addSchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    // 新增页面数据保存
    parentHandleSave = (newObj) => {
        const {actionLeaseAdd} = this.props

        if (this.addType === 'room') {
            actionLeaseAdd.fetchRoomAdd(newObj)
        } else if (this.addType === 'classLine') {
            actionLeaseAdd.fetchClassLineAdd(newObj)
        } else if (this.addType === 'policy') {
            actionLeaseAdd.fetchPolicyAdd(newObj)
        } else if (this.addType === 'accountManager') {
            actionLeaseAdd.fetchManagerAdd(newObj)
        } else if (this.addType === 'contractTpl') {
            actionLeaseAdd.fetchContractAdd(newObj)
        }
    }

    parentHandleSelect = (key, value) => {
        const {actionLeaseAdd} = this.props
        if (key === 'area') {
            actionLeaseAdd.fetchBuildList({
                "site": sessionStorage.getItem('getFacility'),
                "area": value
            })
        }
    }
    
    parentHandleClick = (key) => {
        if (key === 'addRoomGoods') {
            this.setState({
                modalOpenBtn: 'roomGoodsInsert',
                modalName: 'roomGoods',
                modalVisible: true,
                modalTitle: '新增房间物品'
            })
        }
    }

    handleEditGoods = (text, record, index) => {
        this.setState({
            modalOpenBtn: 'roomGoodsEdit',
            modalName: 'roomGoodsEdit',
            modalVisible: true,
            modalTitle: '修改房间物品'
        })

        setTimeout(() => {
            this.refs.roomGoodsModal.setFieldsValue(record)
        }, 0)
    }

    handleDelGoods = (text, record, index) => {
        const {tableDataGoods} = this.state
        tableDataGoods.splice(index, 1)
        this.setState({
            tableDataGoods
        })
    }

    // 弹框确认
    handleModalOk = () => {
        this.refs.roomGoodsModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            }

            const obj = this.state.tableDataGoods
            const oldObj = this.refs.roomGoodsModal.getFieldsValue()
            const newObj = filterQueryObj(oldObj)
            obj.push(Object.assign({}, newObj))
            this.setState({
                tableDataGoods: obj
            })
            this.handleModalCancel()
        })
    }

    handleModalCancel = () => {
        const {modalName} = this.state
        if (modalName === 'roomGoods') {
            this.refs.roomGoodsModal.resetFields()
        }
        this.setState({
            modalVisible: false
        })
    }

    // 渲染
    render() {
        const {roomAddSchema} = this.props.configLease
        const {modalName} = this.state
        const roomSchema = roomAddSchema['tableColumns'].concat([
            {
                key: 'operation',
                title: '操作',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleEditGoods.bind(this, text, record, index)}>修改</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleDelGoods.bind(this, text, record, index)}>删除</a>
                </div>
            }
        ])

        let modalContent
        if (modalName === "roomGoods") {
            modalContent = <ModalForm
                ref="roomGoodsModal"
                schema={roomAddSchema['roomGoodsForm']} />
        }

        return (
            <section className="m-config m-config-room">
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                {this.addType == 'room' ?
                    <InnerForm
                        formStyle="padding"
                        schema={roomAddSchema['roomForm']}
                        sessionShouldGet={this.addType}
                        showSave={true}
                        parentHandleSelect={this.parentHandleSelect}
                        parentHandleSave={this.parentHandleSave}>
                        <div className="padding-lr g-mt20">
                            <InnerTable
                                columns={roomSchema}
                                schema={roomAddSchema['tableControls']}
                                dataSource={this.state.tableDataGoods}
                                parentHandleClick={this.parentHandleClick}
                                pagination={false}
                                bordered={true} />
                        </div>
                    </InnerForm> :
                    <InnerForm
                        formStyle="padding m-advance-fill"
                        schema={this.addSchema[this.addType]}
                        showSave={true}
                        sessionShouldGet={this.addType}
                        parentHandleSave={this.parentHandleSave} />
                }
            </section>
        )
    }
}
export default LeaseAdd