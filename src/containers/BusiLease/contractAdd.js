import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {
    Form,
    Tabs
} from 'antd'
const TabPane = Tabs.TabPane

import {
    FormLayout,
    InnerTable
} from 'COMPONENT'

@connect(
    ({ busiLease }) => ({ busiLease })
)
class ContractAdd extends Component {
    constructor(props) {
        super(props)
        this.initFetchSchema(this.props)
    }

    /**
     * 尝试获取某个表的querySchema和dataSchema
     * 无论是从远端获取还是从本地配置读取, 这个方法必须是同步的
     *
     * @param dbName
     * @param tableName
     */
    initFetchSchema(props){
        const routes = props.routes
        const tableName = routes.pop().tableName

        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        try {
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.contractAddSchema.js`)
            console.log(this.querySchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractAddSchema出错, 请检查配置`
            return false
        }
    }

    // 合同数据来演-选项卡
    handleContractDataFrom = (activeKey) => {
        console.log(activeKey)
    }

    render() {
        const {
            contractAddCustom
        } = this.props.busiLease
        return (
            <section className="padding m-contract-add">
                <Form horizontal>
                    {/* 客户选择 */}
                    <FormLayout
                        schema={this.addSchema['organization']}
                        form={this.props.form}
                        setFields={this.props.setFields}
                        />

                    {/* 合同号 */}
                    <Tabs className="g-mt20" defaultActiveKey="contractRoom" onChange={this.handleContractDataFrom}>
                        <TabPane tab="合同房间" key="contractRoom">
                            <InnerTable />
                        </TabPane>
                        <TabPane tab="合同班线" key="contractLine">
                            <InnerTable />
                        </TabPane>
                        <TabPane tab="合同优惠冲抵" key="contractDiscount">
                            <InnerTable />
                        </TabPane>
                        <TabPane tab="履约保证金冲抵" key="contractBond">
                            <InnerTable />
                        </TabPane>
                        <TabPane tab="合同附件" key="contractField">
                            <InnerTable />
                        </TabPane>
                        <TabPane tab="分期明细" key="contractShow">
                            <InnerTable />
                        </TabPane>
                    </Tabs>

                    {/* 客户选择 */}
                    <FormLayout
                        schema={this.addSchema['contractInfo']}
                        form={this.props.form}
                        showSave={this.props.showSave}
                        setFields={this.props.setContractInfoFields}
                        />
                </Form>
            </section>
        );
    }
}

ContractAdd = Form.create()(ContractAdd)

export default ContractAdd