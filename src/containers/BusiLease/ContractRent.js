// ================================
// 租赁管理-合同-合同变更
// ================================
import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import {
    Form,
    Modal,
    message,
    notification,
    Button
} from 'antd'

import {
    FormLayout,
    Loading,
    InnerForm,
    InnerTable,
    ModalForm,
    Err
} from 'COMPONENT'
import {
    filterQueryObj
} from 'UTIL'
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

class ContractRent extends Component {
    constructor(props) {
        super(props)
        console.log('###', props)
        this.state = {
            modalOpenBtn: 'rentInsert',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '500',
            tableIndex: 0,
            loading: true,
            rentTableData: [],
            isSaveDisabeld: false
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
            this.schema = require(`SCHEMA/${tableName}/${tableName}.rentSchema.js`)
            console.log(this.addSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractRentSchema出错, 请检查配置`
            return false
        }
        this.inited = true;
    }

    // 新增
    handleAdd = () => {
        this.setState({
            modalOpenBtn: 'rentInsert',
            modalVisible: true,
            modalTitle: '新增费用名称',
            modalWidth: '500'
        })
    }

    // 修改
    handleRentEdit = (text, record, index) => {
        this.setState({
            modalOpenBtn: 'rentEdit',
            modalVisible: true,
            modalTitle: '修改费用名称',
            modalWidth: '500',
            tableIndex: index
        })
        const newObj = filterQueryObj(record)
        setTimeout(() => {
            this.refs.rentModal.setFieldsValue(newObj)
        }, 200)
    }

    // 删除
    handleRentDel = (text, record, index) => {
        const obj = this.state.rentTableData
        obj.map((item, ind) => {
            if (ind == index) {
                obj.splice(index, 1)
            }
        })
        this.setState({
            rentTableData: obj
        })
    }

    // 弹框确认
    handleModalOk = () => {
        this.refs.rentModal.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false;
            } else {
                const {
                    tableIndex,
                    modalOpenBtn,
                    rentTableData
                } = this.state
                const oldObj = this.refs.rentModal.getFieldsValue()
                const newObj = filterQueryObj(oldObj)
                console.log('保存表单字段', newObj)
                let obj = rentTableData

                if (this.state.modalOpenBtn === 'rentInsert') {
                    const tmp = obj.filter(item => item['itemname'] === newObj['itemname'])
                    if (tmp.length) {
                        notification.error({
                            message: '【' + newObj['itemname'] + '】已经存在',
                            description: '请重新选择费用名称'
                        })
                        return false;
                    }
                    obj.push(Object.assign({}, newObj))
                } else if (modalOpenBtn === 'rentEdit') {
                    const tmpEdit = rentTableData[tableIndex].itemname
                    const tmpInsert = obj.filter(item => item['itemname'] === newObj['itemname'])

                    if (tmpEdit !== newObj['itemname'] && tmpInsert.length) {
                        notification.error({
                            message: '【' + newObj['itemname'] + '】已经存在',
                            description: '请重新选择费用名称'
                        })
                        return false;
                    }
                    obj[tableIndex] = Object.assign({}, newObj)
                }
                this.setState({
                    rentTableData: obj
                })
                this.refs.rentModal.resetFields()
                this.handleModalCancel()
            }
        })
    }

    // 弹框关闭
    handleModalCancel = () => {
        const {modalName} = this.state
        this.refs.rentModal.resetFields()
        this.setState({
            modalVisible: false
        })
    }

    // 保存
    handleSave = (e) => {
        e.preventDefault()
        this.setState({
            isSaveDisabeld: true
        })

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                this.setState({
                    isSaveDisabeld: false
                })
                return false
            } else {
                const {form} = this.props
                const oldObj = form.getFieldsValue()
                if (oldObj.refundreason && oldObj.refundreason.length) {
                    oldObj.refundreason = oldObj.refundreason.join(',')
                }
                const newObj = filterQueryObj(oldObj)
                const tmp = Object.assign({}, newObj, {
                    rentpactrefundlist: JSON.stringify(this.state.rentTableData)
                })
                console.log('提交字段', tmp)

                xhr('post', paths.leasePath + '/rentpactcs/refundRentPack', tmp, (res) => {
                    const hide = message.loading('正在查询...', 0)
                    console.log('数据：', res)
                    if (res.result === 'success') {
                        hide()
                        hashHistory.push('busi/busi_lease')
                    } else {
                        hide()
                        errHandler(res.msg)
                    }
                    this.setState({
                        isSaveDisabeld: false
                    })
                })
            }
        })
    }

    componentDidMount() {
        xhr('post', paths.leasePath + '/rentpactcs/selectRentPactById', {
            rentpactid: this.props.params.id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('退租初始化数据详情', res)
            if (res.result === 'success') {
                hide()
                this.props.form.setFieldsValue(res.data)
            } else {
                hide()
                errHandler(res.msg)
            }
        })

    }

    render() {
        const {
            loading,
            rentTableData
        } = this.state
        let modalContent = <ModalForm
            ref="rentModal"
            schema={this.schema['tableSchema']} />

        if (!this.inited) {
            return <Err />
        }

        if (!loading) {
            return <Loading />
        }

        const rentTableColumns = this.schema['tableColumns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div class="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleRentEdit.bind(this, text, record, index)}>修改</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleRentDel.bind(this, text, record, index)}>删除</a>
                </div>
            }
        ])

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
                <Form horizontal>
                    <FormLayout
                        schema={this.schema['form']}
                        form={this.props.form} />
                    <div className="button-group g-mb10">
                        <Button onClick={this.handleAdd}>新增</Button>
                    </div>
                    <InnerTable
                        columns={rentTableColumns}
                        dataSource={rentTableData}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                    <div className="button-group g-tac g-mt20">
                        <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSave}>保存</Button>
                        <Button onClick={this.handleCancel}>取消</Button>
                    </div>
                </Form>
            </section>
        )
    }
}

ContractRent = Form.create()(ContractRent)

export default ContractRent