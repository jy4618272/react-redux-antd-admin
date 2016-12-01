import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Modal,
    Button,
    notification
} from 'antd'
import xhr from 'SERVICE'
import { errHandler, paths } from 'SERVICE/config'
import {
    filterQueryObj
} from 'UTIL'
import actionLease from 'ACTION/configLease'

import {
    Loading,
    Error,
    ModalForm,
    InnerForm,
    InnerTable
} from 'COMPONENT'

const mapDispatchToProps = (dispatch) => ({
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ configLease }) => ({ configLease }),
    mapDispatchToProps
)
class LeaseEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpenBtn: 'roomGoodsInsert',
            modalName: 'roomGoods',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '500',
            tableIndex: 0,
            tableDataGoods: [],
        }
        console.log('编辑props：', props)
        this.initFetchSchema(this.props)
        this.editType = props.location.query.type
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props) {
        const that = this
        const routes = props.routes
        const tableName = routes.pop().tableName

        if (tableName) {
            console.info('init component Finance with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            that.editSchema = require(`SCHEMA/${tableName}/${tableName}.editSchema.js`)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    parentHandleSelect = (key, value) => {
        const {actionLease} = this.props
        if (key === 'area') {
            actionLease.fetchBuildList({
                "site": sessionStorage.getItem('getFacility'),
                "area": value
            })
        }
    }

    handleAddGoods = (key) => {
        this.setState({
            modalOpenBtn: 'roomGoodsInsert',
            modalVisible: true,
            modalTitle: '新增房间物品'
        })
    }

    handleEditGoods = (text, record, index) => {
        this.setState({
            modalOpenBtn: 'roomGoodsEdit',
            modalVisible: true,
            modalTitle: '修改房间物品',
            tableIndex: index
        })

        setTimeout(() => {
            this.refs.roomGoodsModal.setFieldsValue(record)
        }, 0)
    }

    handleDelGoods = (text, record, index) => {
        const data = this.state.tableDataGoods
        data.splice(index, 1)
        this.setState({
            tableDataGoods: data
        })

    }

    // 弹框确认
    handleModalOk = () => {
        const {
            modalOpenBtn,
            tableDataGoods,
            tableIndex
        } = this.state

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
            if (modalOpenBtn === 'roomGoodsInsert') {
                obj.push(Object.assign({}, newObj))
                this.setState({
                    tableDataGoods: obj
                })
            } else if (modalOpenBtn === 'roomGoodsEdit') {
                tableDataGoods[tableIndex] = newObj
            }

            this.refs.roomGoodsModal.resetFields()
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

    // 修改页面数据保存
    parentHandleSave = (oldObj) => {
        const id = parseInt(this.props.params.id)
        const {actionLease, configLease} = this.props

        if (this.editType === 'room') {
            let newObj = Object.assign({}, oldObj, {
                rentroomid: id,
                rentroomconfig: JSON.stringify(this.state.tableDataGoods)
            })
            actionLease.fetchRoomUpdate(newObj)
        } else if (this.editType === 'classLine') {
            let newObj = Object.assign({}, oldObj, {
                transportlineid: id
            })
            actionLease.fetchClassLineUpdate(newObj)
        } else if (this.editType === 'policy') {
            const val = this.refs.otherForm.getFieldsValue()
            if (val.promotiontype === "折扣" && val.promotionnum > 10) {
                notification.error({
                    message: '优惠幅度填写有误',
                    description: '【折扣】类型优惠幅度为[1-10】'
                })
                return false;
            }

            let newObj = Object.assign({}, oldObj, {
                rentpromotionid: id
            })
            actionLease.fetchPolicyUpdate(newObj)
        } else if (this.editType === 'accountManager') {
            let newObj = Object.assign({}, oldObj, {
                status: configLease.accountManagerEdit.data.status,
                salerid: id
            })
            actionLease.fetchManagerUpdate(newObj)
        } else if (this.editType === 'contractTpl') {
            let newObj = Object.assign({}, oldObj, {
                status: configLease.contractTplEdit.data.status,
                pactprintmodelid: id
            })
            actionLease.fetchContractUpdate(newObj)
        }
    }

    componentDidMount() {
        const {actionLease} = this.props
        const id = parseInt(this.props.params.id)

        if (this.editType === 'room') {
            actionLease.fetchArea()
            actionLease.fetchRoomEdit({
                rentroomid: id
            })
            setTimeout(() => {
                this.setState({
                    tableDataGoods: this.props.configLease.roomEdit.tableSource
                })
            }, 500)
        } else if (this.editType === 'classLine') {
            actionLease.fetchClassLineEdit({
                transportlineid: id
            })
        } else if (this.editType === 'policy') {
            actionLease.fetchArea()
            actionLease.fetchPolicyEdit({
                rentpromotionid: id
            })
        } else if (this.editType === 'accountManager') {
            actionLease.fetchManagerEdit({
                salerid: id
            })
        } else if (this.editType === 'contractTpl') {
            actionLease.fetchContractEdit({
                pactprintmodelid: id
            })
        }
    }

    render() {
        console.log('this.editType', this.editType)
        const {
            areaData,
            roomEdit,
            classLineEdit,
            policyEdit,
            accountManagerEdit,
            contractTplEdit
        } = this.props.configLease

        const {
            modalName
        } = this.state

        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        if (this.editType === 'room') {
            this.dataSource = roomEdit
        } else if (this.editType === 'classLine') {
            this.dataSource = classLineEdit
        } else if (this.editType === 'policy') {
            this.dataSource = policyEdit
        } else if (this.editType === 'accountManager') {
            this.dataSource = accountManagerEdit
        } else if (this.editType === 'contractTpl') {
            this.dataSource = contractTplEdit
        }

        if (this.dataSource.loading) {
            return <Loading />
        }

        if (this.editType === 'room') {
            this.dataSource['room'][0].options = areaData.data
            const roomSchema = this.dataSource['tableColumns'].concat([
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
                    schema={this.dataSource['roomGoodsForm']} />
            }
            return (
                <section className="padding m-config-edit">
                    <Modal
                        visible={this.state.modalVisible}
                        title={this.state.modalTitle}
                        width={this.state.modalWidth}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}>
                        {modalContent}
                    </Modal>
                    <InnerForm
                        schema={this.dataSource[this.editType]}
                        showSave={true}
                        parentHandleSelect={this.parentHandleSelect}
                        setFields={this.dataSource.data}
                        sessionShouldGet={this.tableName}
                        parentHandleSave={this.parentHandleSave}>

                        <div className="g-mt20">
                            <div className="button-group g-mb10">
                                <Button onClick={this.handleAddGoods}>新增物品</Button>
                            </div>
                            <InnerTable
                                columns={roomSchema}
                                dataSource={this.state.tableDataGoods}
                                parentHandleClick={this.parentHandleClick}
                                pagination={false}
                                bordered={true} />
                        </div>
                    </InnerForm>
                </section>
            )
        } else if (this.editType == 'contractTpl') {
            return ( <ContractTemplateAdd operateType="edit" /> )
        } else {
            if (this.editType === 'policy') {
                this.editSchema['policy'][5].options = areaData.data
            }
            return (
                <section className="m-config-edit">
                    <InnerForm
                        schema={this.editSchema[this.editType]}
                        showSave={true}
                        parentHandleSelect={this.parentHandleSelect}
                        ref='otherForm'
                        setFields={this.dataSource.data}
                        parentHandleSave={this.parentHandleSave} />
                </section>
            )
        }
    }
}

export default LeaseEdit