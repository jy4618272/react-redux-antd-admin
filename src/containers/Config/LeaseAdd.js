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
    DatePicker
} from 'antd'
const FormItem = Form.Item

import InnerForm from 'COMPONENT/DBTable/InnerForm'
import InnerTable from 'COMPONENT/DBTable/InnerTable'

import actionLeaseAdd from 'ACTION/lease/leaseAdd'

import moment from 'moment'

const tableColumns = [
    {
        title: "房间物品",
        dataIndex: "goods",
        key: "goods"
    },
    {
        title: "物品规格",
        dataIndex: "size",
        key: "size"
    },
    {
        title: "数量",
        dataIndex: "num",
        key: "num"
    },
    {
        title: "价格",
        dataIndex: "price",
        key: "price"
    },
    {
        title: "备注",
        dataIndex: "memo",
        key: "memo"
    },
    {
        title: '',
        key: "add",
        render: () => <a href="javascript:void(0)" onClick={() => { alert(3) } }><Icon type="delete" /> 删除</a>,
    }
]


const tableSource = []

const mapDispatchToProps = (dispatch) => ({
    actionLeaseAdd: bindActionCreators(actionLeaseAdd, dispatch)
})

@connect(
    ({}) => ({}),
    mapDispatchToProps
)
class LeaseAdd extends Component {
    constructor(props) {
        super(props)
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
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${addType}表的addSchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    parentHandleSave = (newObj) => {
        const {actionLeaseAdd} = this.props
        if (this.addType === 'classLine') {
            actionLeaseAdd.fetchClassLineAdd(newObj)
        } else if (this.addType === 'policy') {
            actionLeaseAdd.fetchPolicyAdd(newObj)
        } else if (this.addType === 'accountManager') {
            actionLeaseAdd.fetchManagerAdd(newObj)
        } else if (this.addType === 'contractTpl') {
            actionLeaseAdd.fetchContractAdd(newObj)
        }        
    }

    // 渲染
    render() {
        return (
            <section className="m-config m-config-room">
                {
                    this.addType == 'room' ?
                        <section>
                            <InnerForm
                                formStyle="padding m-advance-fill"
                                schema={this.addSchema[this.addType]} />
                            {/*<div className="padding">
                                <div className="button-group">
                                    <Button type="ghost" onClick={this.handleAdd}>
                                        <Icon type="plus" />新增
                                    </Button>
                                    <Button type="ghost" onClick={this.handleEdit}>
                                        <Icon type="edit" />修改
                                    </Button>
                                    <Button type="ghost" onClick={this.handleDel}>
                                        <Icon type="delete" />删除
                                    </Button>
                                </div>
                                <InnerTable
                                    columns={tableColumns}
                                    schema={[]}
                                    dataSource={tableSource}
                                    isRowSelection={true}
                                    bordered={true} />
                            </div>
                            
                                <Modal
                                    title={this.state.modalTitle}
                                    visible={this.state.modalVisible}
                                    onOk={this.handleModalOk}
                                    onCancel={this.handleHideModal}>
                                    <Form horizontal ref="formFill">
                                        {formItems}
                                    </Form>
                                </Modal>    
                            */}
                        </section> :
                        <InnerForm
                            formStyle="padding m-advance-fill"
                            schema={this.addSchema[this.addType]}
                            showSave={true}
                            sessionShouldGet={this.addType}
                            parentHandleSave={this.parentHandleSave}
                            />
                }
            </section>
        )
    }
}
export default LeaseAdd