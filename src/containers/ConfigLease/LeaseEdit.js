import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import actionLease from 'ACTION/configLease'

import Loading from 'COMPONENT/Loading'
import Error from 'COMPONENT/Error'
import InnerForm from 'COMPONENT/DBTable/InnerForm'

const mapDispatchToProps = (dispatch) => ({
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ configLease }) => ({ configLease }),
    mapDispatchToProps
)
class ClassLineEdit extends Component {
    constructor(props) {
        super(props)
        console.log('编辑props：', props)

        this.initFetchSchema(this.props)

        const id = parseInt(this.props.params.id)
        this.editType = props.location.query.type
        if (this.editType === 'room') {
            this.props.actionLease.fetchRoomEdit({
                rentroomid: id
            })
        } else if (this.editType === 'classLine') {
            this.props.actionLease.fetchClassLineEdit({
                transportlineid: id
            })
        } else if (this.editType === 'policy') {
            this.props.actionLease.fetchPolicyEdit({
                rentpromotionid: id
            })
        } else if (this.editType === 'accountManager') {
            this.props.actionLease.fetchManagerEdit({
                salerid: id
            })
        }else if (this.editType === 'contractTpl') {
            this.props.actionLease.fetchContractEdit({
                pactprintmodelid: id
            })
        }
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

    // 修改页面数据保存
    parentHandleSave = (oldObj) => {
        const id = parseInt(this.props.params.id)
        const {actionLease} = this.props

        if (this.editType === 'room') {
            let newObj = Object.assign({}, oldObj, {
                rentroomid: id
            })
            actionLease.fetchRoomUpdate(newObj)
        } else if (this.editType === 'classLine') {
            let newObj = Object.assign({}, oldObj, {
                transportlineid: id
            })
            actionLease.fetchClassLineUpdate(newObj)
        } else if (this.editType === 'policy') {
            let newObj = Object.assign({}, oldObj, {
                rentpromotionid: id
            })
            actionLease.fetchPolicyUpdate(newObj)
        } else if (this.editType === 'accountManager') {
            let newObj = Object.assign({}, oldObj, {
                salerid: id
            })
            actionLease.fetchManagerUpdate(newObj)
        } else if (this.editType === 'contractTpl') {
            let newObj = Object.assign({}, oldObj, {
                pactprintmodelid: id
            })
            actionLease.fetchContractUpdate(newObj)
        }
    }

    render() {
        const {
            roomEdit,
            classLineEdit,
            policyEdit,
            accountManagerEdit,
            contractTplEdit
        } = this.props.configLease
        // alert(JSON.stringify(classLineEdit.data))

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
            return (
                <Loading />
            )
        }

        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }
        return (
            <section className="padding m-config-edit">
                <InnerForm
                    schema={this.dataSource[this.editType]}
                    showSave={true}
                    parentHandleSelect={this.parentHandleSelect}
                    setFields={this.dataSource.data}
                    sessionShouldGet={this.tableName}
                    parentHandleSave={this.parentHandleSave} />
            </section>
        )
    }
}

export default ClassLineEdit