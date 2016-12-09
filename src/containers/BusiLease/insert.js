import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Button,
    message,
    notification,
    Form,
    Modal
} from 'antd'
import {
    Cards,
    Err,
    InnerTable,
    Loading,
    FormLayout
} from 'COMPONENT'

import {
    filterQueryObj
} from 'UTIL'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import actionBusiLease from 'ACTION/busiLease'
import actionLease from 'ACTION/configLease'
const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(actionBusiLease, dispatch),
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ busiLease }) => ({ busiLease }),
    mapDispatchToProps
)
class Insert extends Component {
    constructor(props) {
        super(props)
        console.log('新增props', props)
        this.state = {
            site: '',           // 所属公路港
            modalName: 'organization',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '900',
            selectDatas: [],
            partyInfo: {}
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
        this.type = this.props.location.query.type
        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName

        if (this.type === 'bond') {
            try {
                this.bondSchema = require(`SCHEMA/${tableName}/${tableName}.bondAddSchema.js`)
                console.log('保证金初始化表单', this.bondSchema)
            } catch (e) {
                console.error('load add schema error: %o', e)
                this.inited = false
                this.errorMsg = `加载${tableName}表的bondAddSchema出错, 请检查配置`
                return false
            }
        } else if (this.type === 'notContract') {
            try {
                this.notContractSchema = require(`SCHEMA/${tableName}/${tableName}.notContractAddSchema.js`)
                console.log('临时摊位初始化表单', this.notContractSchema)
            } catch (e) {
                console.error('load add schema error: %o', e)
                this.inited = false
                this.errorMsg = `加载${tableName}表的notContractAddSchema出错, 请检查配置`
                return false
            }
        }
        this.inited = true
    }

    // 表单点击
    parentHandleInput = (key) => {
        if (key === 'organization') {
            // 获取用户
            this.setState({
                modalName: 'organization',
                modalVisible: true,
                modalTitle: '选择客户',
                modalWidth: '900'
            })
        }
    }

    // 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectDatas: rows
        })
    }

    // 搜索用户
    handleSearchOrganization = () => {
        console.log('测试可用数据：qq123456222swe')
        const val = this.props.form.getFieldsValue()
        this.props.action.fetchOrganization({
            keywords: val.organizationnum
        })
    }

    // 弹框确认
    handleModalOk = () => {
        const {
            modalName
        } = this.state
        if (modalName === 'organization') {
            if (this.state.selectDatas.length) {
                this.setState({
                    partyInfo: this.state.selectDatas[0]
                })
                this.props.form.setFieldsValue(this.state.selectDatas[0])
            }

            this.props.action.resetOrganization()
            this.handleModalCancel()
        }
    }

    // 弹框关闭
    handleModalCancel = () => {
        const { modalName } = this.state
        const { form, action } = this.props
        if (modalName === 'organization') {
            form.resetFields(['organizationnum'])
            action.resetOrganization()
        }
        this.setState({
            modalVisible: false
        })
    }

    // 表单保存
    handleSave = (e) => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                notification.error({
                    message: '表单填写有误',
                    description: '请按要求正确填写表单'
                })
                return false
            }

            const { form } = this.props
            const oldObj = form.getFieldsValue()
            const newObj = filterQueryObj(oldObj)
            console.log('保存表单字段', oldObj)
            if (this.type === 'bond') {
                // 履约保证金保存             
                const {partyInfo} = this.state
                const saveObj = Object.assign({}, newObj, {
                    partyname: partyInfo.partyname,
                    partyid: partyInfo.partyid
                })
                this.props.action.fetchSaveBond(saveObj)
            } else if (this.type === 'notContract') {
                // 临时摊位交款保存
                this.props.action.fetchSaveNotContract(newObj)
            }
        })
    }

    // 取消返回
    handleCancel = () => {
        history.back();
    }

    componentDidMount() {
        if (this.type === 'bond') {
            // 履约保证金
            xhr('post', paths.leasePath + '/margincs/getSiteAndBusinessNumber', {}, (res) => {
                const hide = message.loading('正在查询...', 0)
                console.log('获取公路港：', res)
                if (res.result === 'success') {
                    hide()
                    this.props.form.setFieldsValue({
                        businessnumber: res.data.businessnumber
                    })
                } else {
                    hide()
                    errHandler(res.msg)
                }
            })
        } else if (this.type === 'notContract') {
            // 临时摊位
            xhr('post', paths.leasePath + '/boothpaymentcs/getSinglePayment', {}, (res) => {
                const hide = message.loading('正在查询...', 0)
                console.log('获取交款单号：', res)
                res && res.msg && this.props.form.setFieldsValue({
                    businessnumber: res.msg
                })
                hide()
            })
        }
    }

    render() {
        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }

        // 弹框内容
        let modalContent
        if (this.state.modalName === 'organization') {
            const { organization } = this.props.busiLease
            modalContent = <section className="m-search-modal">
                <FormLayout
                    schema={organization.querySchema}
                    form={this.props.form}
                    buttonSchema={organization.queryButtons}
                    parentHandleClick={this.handleSearchOrganization}
                    parentHandleSelect={this.parentHandleSelect} />
                <InnerTable
                    columns={organization.tableColumns}
                    dataSource={organization.tableData}
                    parentHandleSelectChange={this.parentHandleSelectChange}
                    isRowSelection={true}
                    bordered={true}
                    pagination={false} />
            </section>
        }

        // 表单填写内容
        let content
        if (this.type === 'bond') {
            content = <FormLayout
                form={this.props.form}
                schema={this.bondSchema}
                parentHandleInput={this.parentHandleInput} />
        } else if (this.type === 'notContract') {
            content = <FormLayout
                form={this.props.form}
                schema={this.notContractSchema}
                parentHandleInput={this.parentHandleInput} />
        }

        return (
            <section>
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width={this.state.modalWidth}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <Form horizontal>
                    {/* 所属公路港 */}
                    <Cards title={`所属公路港：${sessionStorage.getItem('site')}`}>
                        {content}
                    </Cards>

                    <div className="g-tal button-group">
                        <Button type="primary" onClick={this.handleSave} className="g-mr10">保存</Button>
                        <Button type="default" onClick={this.handleCancel}>取消</Button>
                    </div>
                </Form>
            </section>
        )
    }
}

Insert = Form.create()(Insert)

export default Insert