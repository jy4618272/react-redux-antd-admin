import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Form,
    Tabs,
    message,
    Button,
    notification
} from 'antd'
const TabPane = Tabs.TabPane
import moment from 'moment'

import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    DetailWe,
    DetailContract,
    Err,
    Cards,
    Loading,
    InnerTable,
    FormLayout
} from 'COMPONENT'

@connect(
    ({}) => ({})
)
class FinanceShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabsStatus: 'room',
            tableIndex: 0,
            isStagesShow: false,
            stagesNum: 0,
            dataAttachment: [],
            stagesTableData: [],
            stagesShowTableData: [],
            loading: true,
            res: {}
        }
        console.log('财务详情props', props);
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
        const route = props.route
        const tableName = route.tableName
        const commonName = route.commonName
        if (tableName) {
            console.info('init component BusiLease with tableName = %s', tableName)
        } else {
            console.error('can not find tableName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到表名, 请检查路由配置'
            return false
        }

        if (commonName) {
            console.info('init component BusiLease with commonName = %s', commonName)
        } else {
            console.error('can not find commonName, check your router config')
            this.inited = false  // 是否成功获取schema
            this.errorMsg = '找不到公共表名, 请检查路由配置'
            return false
        }

        this.tableName = tableName
        this.commonName = commonName

        try {
            this.showSchema = require(`SCHEMA/${tableName}/${tableName}.showSchema.js`)
            this.financeShowSchema = require(`SCHEMA/${commonName}/contract.showSchema.js`)
            console.log('其他详情：', this.showSchema)
            console.log('财务详情：', this.financeShowSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${commonName}表的showSchema出错, 请检查配置`
            return false
        }
        this.inited = true;
    }

    componentDidMount() {
        const {
            action,
            params,
            location
        } = this.props

        const id = params.id
        const type = location.query.type
        const paytype = location.query.paytype
        console.log('参数：', id, type)

        xhr('post', paths.financePath + '/financecollectioncs/getFinanceCollectionDetail', {
            type: type,
            paytype: paytype,
            businessnumber: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('财务详情', res)
            if (res.result === 'success') {
                hide()
                this.setState({
                    loading: false,
                    res: res.data,
                    stagesTableData: res.data.rentpactpayplanfullinfos,
                    dataAttachment: res.data.rentpactattachments
                });
            } else {
                hide()
                errHandler(res.msg + '，正在前往列表页')
                history.back()
            }
        })
    }

    render() {
        const { location } = this.props
        const { loading, res } = this.state
        const type = location.query.type;

        if (!this.inited) {
            return <Err errorMsg={this.errorMsg} />
        }
        if (type === '履约保证金') {
            const arr = []
            arr.push(res)
            return (
                <section className="padding">
                    <InnerTable
                        loading={loading}
                        columns={this.showSchema['bond']}
                        dataSource={arr}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                </section>
            )
        } else if (type === '临时摊位') {
            const arr = []
            arr.push(res)

            return (
                <section className="padding">
                    <InnerTable
                        loading={loading}
                        columns={this.showSchema['notContract']}
                        dataSource={arr}
                        isRowSelection={false}
                        bordered={true}
                        pagination={false} />
                </section>
            )
        } else if (type === '租赁合同') {
            // 合同详情数据
            const contractData = Object.assign({}, { 
                financeShowSchema: this.financeShowSchema,
                res,
                stagesTableData: this.state.stagesTableData,
                dataAttachment: this.state.dataAttachment
            }); 

            if (loading) {
                return <Loading />
            }
            return <DetailContract {...contractData} />
        } else {
            if (loading) {
                return <Loading />
            }
            const data = {};
            data.tableData = [res];
            return <DetailWe {...data} />
        }
    }
}

FinanceShow = Form.create()(FinanceShow)

export default FinanceShow