import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
    InnerForm
} from 'COMPONENT'

import actionInsert from 'ACTION/configBase/insert'

import moment from 'moment'


const mapDispatchToProps = (dispatch) => ({
    actionInsert: bindActionCreators(actionInsert, dispatch)
})

@connect(
    ({ }) => ({  }),
    mapDispatchToProps
)
class ConfigBase extends Component {
    constructor(props) {
        super(props)
        console.log('1111112222', props)

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
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.insertSchema.js`)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的addSchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    // 新增页面数据保存
    parentHandleSave = (newObj) => {
        actionInsert.fetchBaseInsert(newObj)
    }

    parentHandleClick = (key) => {
    }

    // 渲染
    render() {
        return (
            <section className="m-config m-config-base">
                <InnerForm
                    formStyle="padding m-advance-fill"
                    schema={this.addSchema}
                    showSave={true}
                    sessionShouldGet={this.addType}
                    parentHandleSave={this.parentHandleSave} />
            </section>
        )
    }
}
export default ConfigBase