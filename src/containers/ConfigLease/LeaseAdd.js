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

import actionLeaseAdd from 'ACTION/configLease/leaseAdd'

import moment from 'moment'


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
    }

    // 渲染
    render() {
        const {roomAddSchema} = this.props.configLease
        return (
            <section className="m-config m-config-room">
                {this.addType == 'room' ?
                    <InnerForm
                        formStyle="padding m-advance-fill"
                        schema={roomAddSchema['room']}
                        sessionShouldGet={this.addType}
                        showSave={true}
                        parentHandleSelect={this.parentHandleSelect}
                        parentHandleSave={this.parentHandleSave}>
                        {/*
                        <InnerTable
                            columns={roomAddSchema.tableColumns}
                            modalSchema={roomAddSchema['room']}
                            schema={{
                                left: [
                                    {
                                        title: '新增',
                                        key: 'add'
                                    }
                                ],
                                center: [],
                                right: []
                            }}
                            dataSource={roomAddSchema.tableSource}
                            parentHandleClick={this.parentHandleClick}
                            bordered={true} />
                        */}
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