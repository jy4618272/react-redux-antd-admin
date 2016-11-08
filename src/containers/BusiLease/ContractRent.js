// ================================
// 租赁管理-合同-合同变更
// ================================
import React, { Component, PropTypes } from 'react'
import {
    Modal,
    Button
} from 'antd'
import {
    Loading,
    InnerForm,
    InnerTable,
    ModalForm,
    Err
} from 'COMPONENT'

class ContractRent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '500',
            selectDatas: [],
            tableIndex: 0,
            loading: true
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
            this.schema = require(`SCHEMA/${tableName}/contract.rentSchema.js`)
            console.log(this.addSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractRentSchema出错, 请检查配置`
            return false
        }
        this.inited = true;
    }

    // 保存
    handleSave = () => {}


    componentDidMount() {
        this.setState({
            // loading: false
        })
    }

    render() {
        const {
            loading
        } = this.state
        let modalContent = ''

        if (!this.inited) {
            return <Err />
        }

        if (!loading) {
            return <Loading />
        }

        return (
            <section className="padding m-contract-add g-mt20">
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <InnerForm
                    schema={this.schema['form']}
                    setFields={this.props.setFields}>
                    <div className="button-group g-mb10">
                        <Button onClick={this.handleAdd}>新增</Button>
                    </div>
                    <InnerTable
                        columns={this.schema['tableColumns']}
                        dataSource={[]}
                        isRowSelection={true}
                        bordered={true}
                        pagination={false} />
                    <div className="button-group g-tac g-mt20">
                        <Button type="primary" onClick={this.handleSave}>保存</Button>
                        <Button type="primary" onClick={this.handleSubmitFinance}>提交财务</Button>
                        <Button onClick={this.handleCancel}>取消</Button>
                    </div>
                </InnerForm>
            </section>
        )
    }
}

ContractRent.propTypes = {

}

export default ContractRent