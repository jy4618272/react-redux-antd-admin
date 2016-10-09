import React, {Component} from 'react'
import {
    Row,
    Col,
    Button,
    Icon
} from 'antd'

import Error from 'COMPONENT/Error'
import InnerForm from 'COMPONENT/DBTable/InnerForm'


// import {Table, Checkbox} from 'antd'

class Finance extends Component {
    constructor(props) {
        super(props)
        this.tryFetchSchema(this.props)
        this.state = {
            newData: [],
            loading: true
        }
    }

    tryFetchSchema(props) {
        const routes = props.routes
        const tableName = routes.pop().tableName // busi

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
            this.querySchema = require(`SCHEMA/${tableName}.querySchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load query schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的querySchema出错, 请检查配置`
            return false
        }

        this.inited = true
    }

    /**
     * 点击提交按钮时触发查询
     *
     * @param queryObj
     */
    handleFormSubmit = () => {
        // alert(111)
    }

    render() {
        if (!this.inited) {
            return (
                <Error errorMsg={this.errorMsg} />
            )
        }

        return (
            <section className="padding">
                <InnerForm
                   parentHandleSubmit = {this.handleFormSubmit}
                    schema={this.querySchema}>
                    <Row>
                        <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                            <Button type="primary"><Icon type="search"/>查询</Button>
                            <Button><Icon type="cross"/>清除条件</Button>
                        </Col>
                    </Row>
                </InnerForm>
            </section>
        )
    }
}


export default Finance

