// ================================
// 租赁管理-合同-合同变更
// ================================
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import {
    Form,
    Tabs,
    Select,
    Button,
    Modal,
    Input,
    Row,
    Col,
    message,
    Upload,
    Icon,
    notification
} from 'antd'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
import {
    filterQueryObj
} from 'UTIL'
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'

import {
    WorkFlow,
    FormLayout,
    InnerTable,
    InnerPagination,
    ModalTable,
    ModalForm
} from 'COMPONENT'
import {
    handleUniq,
    handleContractCalc
} from 'UTIL/contractCalc'

import './contract.less'

import actionBusiLease from 'ACTION/busiLease'
import actionLease from 'ACTION/configLease'

const mapDispatchToProps = (dispatch) => ({
    action: bindActionCreators(actionBusiLease, dispatch),
    actionLease: bindActionCreators(actionLease, dispatch)
})

@connect(
    ({ busiLease, configLease }) => ({ busiLease, configLease }),
    mapDispatchToProps
)
class ContractInsert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabsStatus: 'room',
            rentpactid: 0,
            renttype: '',
            pactprintmodelid: 0,
            partyid: 0,
            partyname: '',
            modalOpenBtn: 'add',
            modalName: 'room',
            modalVisible: false,
            modalTitle: '新增',
            modalWidth: '900',
            selectDatas: [],
            dataRoom: [],
            dataLine: [],
            dataPolicy: [],
            dataBond: [],
            dataAttachment: [],
            isStagesShow: false,
            stagesNum: 1,
            stagesShowNum: 1,
            tableIndex: 0,
            stagesTableData: [],
            stagesShowTableData: [],
            isSaveDisabeld: false,
            isCalcChange: true,
            footer: <div>
                <Button size="large" onClick={this.handleModalCancel}>取消</Button>
                <Button size="large" type="primary" onClick={this.handleModalOk}>确定</Button>
            </div>
        }

        console.log('合同新增props:', props)

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
            this.addSchema = require(`SCHEMA/${tableName}/${tableName}.contractAddSchema.js`)
            this.stagesSchema = require(`SCHEMA/${tableName}/${tableName}.contractStagesSchema.js`)
            console.log(this.addSchema)
        } catch (e) {
            console.error('load add schema error: %o', e)
            this.inited = false
            this.errorMsg = `加载${tableName}表的contractAddSchema出错, 请检查配置`
            return false
        }
    }

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount, fetchHandle) => {
        const tmpObj = Object.assign({}, queryObj)
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount
        fetchHandle(tmpObj)
    }

    /**
     * 按当前的查询条件重新查询一次
     */
    refresh = (fetchHandle) => {
        this.select({}, 10, 0, fetchHandle)
    }

    // 分页
    handlePageChange = (page) => {
        const {
            tabsStatus,
            modalName
        } = this.state
        const {
            roomData,
            classLineData,
            policyData,
        } = this.props.configLease
        const {
            bondData
        } = this.props.busiLease
        const {
            fetchRoomTable,
            fetchFilterClassLineTable,
            fetchFilterPolicyTable
        } = this.props.actionLease

        const {
            fetchFilterBondTable,
            fetchContractHistory
        } = this.props.action

        page = (page <= 1) ? 0 : (page - 1) * 10

        if (modalName === 'changeHistory') {
            this.select({
                rentpactid: this.state.rentpactid,
            }, bondData.pageSize, page, fetchContractHistory)
        } else {
            if (tabsStatus === 'room') {
                this.select({
                    status: '未出租'
                }, roomData.pageSize, page, fetchRoomTable)
            } else if (tabsStatus === 'classLine') {
                this.select({
                    status: '开启'
                }, classLineData.pageSize, page, fetchFilterClassLineTable)
            } else if (tabsStatus === 'policy') {
                this.select({}, policyData.pageSize, page, fetchFilterPolicyTable)
            } else if (tabsStatus === 'contractBond') {
                this.select({
                    status: '开启'
                }, bondData.pageSize, page, fetchFilterBondTable)
            }
        }
    }

    // 下拉选择
    parentHandleSelect = (key, value) => {
        const { busiLease, action } = this.props
        // 合同模板
        if (key === 'modelname') {
            busiLease.contractFrom[0].options.map(item => {
                if (item.value === value) {
                    this.props.form.setFieldsValue({
                        pactkind: item.pactkind
                    })
                    this.setState({
                        pactprintmodelid: item.pactprintmodelid
                    })

                    // 合同流程
                    action.fetchWorkFlow({
                        type: '变更',
                        modelname: value
                    })

                    // 获取合同号
                    xhr('post', paths.leasePath + '/rentpactcs/getPactCode', {
                        pactkind: item.pactkind
                    }, (res) => {
                        const hide = message.loading('正在查询...', 0)
                        if (res.result === 'success') {
                            hide()
                            this.props.form.setFieldsValue({
                                pactcode: res.data.pactCode
                            })
                        } else {
                            hide()
                            errHandler(res.msg)
                        }
                    })
                }
            })
        }
    }

    // 表单失去焦点
    parentHandleBlur = (key) => {
        if(key === 'marginmoney'){
            const {dataRoom, dataLine, dataPolicy, dataBond, isCalcChange} = this.state
            const {getFieldValue, setFieldsValue} = this.props.form
            
            // alert(getFieldValue('marginmoney'))
            if(getFieldValue('marginmoney')){
                // 表单设值
                const tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate'))
                setFieldsValue(tmp)

                // 重置明细
                isCalcChange && this.handleResetStages()
            }else{
                // 表单设值
                const tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, dataBond, 0, getFieldValue('startdate'), getFieldValue('enddate'))
                setFieldsValue(tmp)

                // 重置明细
                isCalcChange && this.handleResetStages()
            }
        }
    }

    // 合同数据来源-选项卡
    handleTabsContractFrom = (activeKey) => {
        console.log(activeKey)
        this.setState({
            tabsStatus: activeKey,
            modalName: activeKey
        })
    }

    // 表单点击
    parentHandleInput = (key) => {
        if (key === 'organization') {
            // 获取用户
            this.setState({
                modalName: 'selectOrganization',
                modalVisible: true,
                modalTitle: '选择客户',
                modalWidth: '900'
            })
        }
    }

    // 日期选择
    parentHandleDateChange = (key, value) => {
        // alert(value)
        if (key === 'enddate' || key === 'startdate') {
            const {
                dataRoom, dataLine, dataPolicy, dataBond, isCalcChange
            } = this.state
            const {setFieldsValue, getFieldValue} = this.props.form

            let tmp
            // 表单设值
            if(key === 'startdate'){
                tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, dataBond, getFieldValue('marginmoney'), value, getFieldValue('enddate'))
            }
            if(key === 'enddate'){
                tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), value)
            }
            this.props.form.setFieldsValue(tmp)

            // 重置明细
            isCalcChange && this.handleResetStages()
        }
    }

    // 搜索用户
    handleSearchOrganization = () => {
        console.log('测试可用数据：qq123456222swe')
        const val = this.props.form.getFieldsValue()
        this.props.action.fetchOrganization({
            keywords: val.organizationnum
        })
    }

    // 算法
    handleCalc = (room, line, bond) => {
        let tmp = {}

        let roommoney = 0
        let linemoney = 0
        let marginmoneyoffset = 0

        let standardmoney = 0
        let totaloffsetmoney = 0
        let money = 0

        // 合同房间
        if (room.length) {
            room.map(item => {
                roommoney += parseFloat(item.money)
            })
        } else {
            roommoney = 0
        }

        // 合同班线
        if (line.length) {
            line.map(item => {
                linemoney += parseFloat(item.linefee)
            })
        } else {
            linemoney = 0
        }

        // 履约保证金冲抵
        if (bond.length) {
            bond.map(item => {
                marginmoneyoffset += parseFloat(item.marginmoney)
            })
        } else {
            marginmoneyoffset = 0
        }

        standardmoney = roommoney + linemoney
        totaloffsetmoney = marginmoneyoffset
        money = standardmoney - totaloffsetmoney

        tmp = {
            roommoney,
            linemoney,
            marginmoneyoffset,
            standardmoney,
            totaloffsetmoney,
            money
        }
        // tmp['money'] = sum + parseFloat(getFieldValue('linemoney')) - parseFloat(getFieldValue('totaloffsetmoney'))
        this.props.form.setFieldsValue(tmp)
    }

    // 新增房间
    handleAddRoom = () => {
        this.setState({
            modalVisible: true,
            modalWidth: '900',
            modalTitle: '选择房间',
            modalName: 'room'
        })
        this.select({
            status: '未出租'
        }, 10, 0, this.props.actionLease.fetchRoomTable)
    }

    // 新增班线
    handleAddLine = () => {
        this.setState({
            modalName: 'classLine',
            modalWidth: '900',
            modalVisible: true,
            modalTitle: '选择班线'
        })
        this.select({
            status: '开启'
        }, 10, 0, this.props.actionLease.fetchFilterClassLineTable)
    }

    // 新增优惠
    handleAddPolicy = () => {
        this.setState({
            modalName: 'policy',
            modalWidth: '900',
            modalVisible: true,
            modalTitle: '选择优惠'
        })
        this.select({}, 10, 0, this.props.actionLease.fetchFilterPolicyTable)
    }

    // 新增冲抵
    handleAddBond = () => {
        if (this.state.partyid === 0) {
            notification.error({
                message: '请选择客户',
                description: '选择客户后才能新增保证金'
            })
            return false;
        }

        this.setState({
            modalName: 'contractBond',
            modalWidth: '900',
            modalVisible: true,
            modalTitle: '选择保证金'
        })
        this.select({
            partyid: this.state.partyid,
            status: '开启'
        }, 10, 0, this.props.action.fetchFilterBondTable)
    }

    // 新增明细
    handleStagesInsert = () => {
        this.setState({
            modalOpenBtn: 'stagesShowInsert',
            modalVisible: true,
            modalWidth: '600',
            modalTitle: '新增第' + this.state.stagesNum + '期明细',
            modalName: 'stagesShowModal'
        })
    }

    // 关闭明细
    handleStagesClose = () => {
        this.setState({
            isStagesShow: false
        })
    }

    parentHandleClick = (key) => {
        if (key === 'makeDefault') {
            const {form} = this.props
            const oldObj = form.getFieldsValue()
            const newObj = filterQueryObj(oldObj, 'YYYY-MM-DD')
            newObj['totalstages'] = parseInt(newObj['totalstages'].match(/\d+/)[0])

            console.log('保存表单字段', newObj)
            this.setState({
                isCalcChange: true
            })

            this.props.form.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    notification.error({
                        message: '表单填写有误',
                        description: '请按要求正确填写表单'
                    })
                    return false;
                } else {
                    // 传给后端字段
                    const tmp = Object.assign({}, {
                        rentpact: JSON.stringify((newObj)),
                        rentpactrooms: JSON.stringify(this.state.dataRoom),
                        rentpactlines: JSON.stringify(this.state.dataLine),
                        rentpactpromotions: JSON.stringify(this.state.dataPolicy),
                        offsetmargins: JSON.stringify(this.state.dataBond)
                    })
                    console.log('传给后端数据：', tmp)

                    xhr('post', paths.leasePath + '/rentpactfullinfocs/reloadRentPactPlan', tmp, (res) => {
                        const hide = message.loading('正在查询...', 0)
                        console.log('获取【分期】数据：', res)
                        if (res.result === 'success') {
                            this.setState({
                                isStagesShow: false,
                                stagesTableData: res.data
                            })
                        } else {
                            errHandler(res.msg)
                        }
                        hide()
                    })
                }
            })
        }
    }

    // 获取客户信息
    handleGetOrganization = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '选择客户',
            modalName: 'selectOrganization'
        })
    }

    handleDelRoom = (record) => {
        const {getFieldValue} = this.props.form
        const {dataRoom, dataLine, dataPolicy, dataBond, isCalcChange} = this.state
        const obj = dataRoom
        const ids = []
        let tmp = {}
        obj.map((item, index) => {
            if (item.rentroomid == record.rentroomid) {
                obj.splice(index, 1)
            }
        })
        obj.map(item => {
            ids.push(item.room)
        })
        this.setState({ dataRoom: obj })
        // 表单设值
        tmp['roomlist'] = ids.join(',')
        tmp = Object.assign({}, tmp, handleContractCalc(obj, dataLine, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate')))
        this.props.form.setFieldsValue(tmp)

        // 重置明细
        isCalcChange && this.handleResetStages()
    }

    handleDelLine = (record) => {
        const {getFieldValue} = this.props.form
        const {dataRoom, dataLine, dataPolicy, dataBond, isCalcChange} = this.state
        const obj = dataLine
        let ids = []
        obj.map((item, index) => {
            if (item.transportlineid == record.transportlineid) {
                obj.splice(index, 1)
            }
        })
        obj.map(item => {
            ids.push(item.linename)
        })
        this.setState({ dataLine: obj })

        // 表单设值
        tmp['linelist'] = ids.join(',')
        tmp = Object.assign({}, tmp, handleContractCalc(dataRoom, obj, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate')))
        this.props.form.setFieldsValue(tmp)

        // 重置明细
        isCalcChange && this.handleResetStages()
    }

    handleDelPolicy = (record) => {
        const {getFieldValue} = this.props.form
        const {dataRoom, dataLine, dataPolicy, dataBond, isCalcChange} = this.state
        const obj = dataPolicy
        const moneyList = []

        obj.map((item, index) => {
            if (item.rentpromotionid == record.rentpromotionid) {
                obj.splice(index, 1)
            }
        })
        obj.map(item => {
            moneyList.push(parseFloat(item.promotionnum))
        })
        this.setState({ dataPolicy: obj })
        // 表单设值
        const tmp = handleContractCalc(dataRoom, dataLine, obj, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate'))
        this.props.form.setFieldsValue(tmp)

        // 重置明细
        isCalcChange && this.handleResetStages()
    }

    handleDelBond = (record) => {
        const {getFieldValue} = this.props.form
        const {dataRoom, dataLine, dataPolicy, dataBond, isCalcChange} = this.state
        const obj = dataBond

        obj.map((item, index) => {
            if (item.marginid == record.marginid) {
                obj.splice(index, 1)
            }
        })

        this.setState({
            dataBond: obj
        })
        // 表单设值
        const tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, obj, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate'))
        this.props.form.setFieldsValue(tmp)

        // 重置明细
        isCalcChange && this.handleResetStages()
    }

    // 合同附件
    handleUpload = (info) => {
        if (info.file.status !== 'uploading') {
            console.log('上传中', info.file, info.fileList)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name}文件上传成功`)
            console.log('上传成功', info.file, info.fileList)

            const obj = this.state.dataAttachment
            obj.push(info.file.response.data)

            this.setState({
                dataAttachment: obj
            })

            console.log('文件列表', this.state.dataAttachment)
            // this.props.action.fetchFileUpload({
            //     rentpactid: 3,
            //     type: res.type,
            //     filename: res.filename,
            //     url: res.url
            // })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name}文件上传失败`)
        }
    }

    /* 下载文件 */
    handleViewDoc = (text, record, index) => {
        const {dataAttachment} = this.state
        window.location.href = rootPaths.imgPath + paths.imgPath + '/' + dataAttachment[index].url
    }

    // 删除文件
    handleDelDoc = (text, record, index) => {
        const {dataAttachment} = this.state
        const obj = dataAttachment
        obj.splice(index, 1)

        this.setState({
            dataAttachment: obj
        })
    }

    // 分期-打印
    handlePrintStages = () => { }

    // 分期-修改
    handleEditStages = (text, record, index) => {
        console.log('修改前', record)

        this.setState({
            modalVisible: true,
            modalWidth: '600',
            modalTitle: '修改第' + record.stagesnumber + '期',
            modalName: 'stagesModal',
            stagesNum: record.stagesnumber,
            tableIndex: index
        })
        const newObj = {}

        for (const key in record) {
            if (record[key]) {
                if (key.indexOf('date') > -1) {
                    newObj[key] = moment(record[key], 'YYYY-MM-DD HH:mm:ss')
                } else {
                    newObj[key] = record[key]
                }
            }
        }

        setTimeout(() => {
            this.refs.stagesModal.setFieldsValue(newObj)
        }, 0)
    }

    // 明细    
    handleShowStages = (record) => {
        this.setState({
            isStagesShow: true,
            stagesShowNum: record.stagesnumber,
            stagesShowTableData: this.state.stagesTableData[record.stagesnumber - 1].rentpactpaylists
        })
    }

    // 明细-修改、删除
    handleEditStagesShow = (text, record, index) => {
        this.setState({
            modalOpenBtn: 'stagesShowEdit',
            modalVisible: true,
            modalWidth: '600',
            modalTitle: '修改第' + record.stagesnumber + '期明细',
            modalName: 'stagesShowModal',
            tableIndex: index,
        })
        setTimeout(() => {
            this.refs.stagesShowModal.setFieldsValue(record)
        }, 0)
    }

    handleDelStagesShow = (text, record, index) => {
        const obj = this.state.stagesShowTableData
        obj.map((item, ind) => {
            if (ind == index) {
                obj.splice(index, 1)
            }
        })
        this.handleStageCalc(obj)
        this.setState({
            stagesShowTableData: obj
        })
    }

    // 筛选
    parentHandleSelectChange = (keys, rows) => {
        this.setState({
            selectDatas: rows
        })
    }

    // 变更历史
    handleChangeHistory = () => {
        this.setState({
            modalName: 'changeHistory',
            modalWidth: '900',
            modalVisible: true,
            modalTitle: '合同变更历史信息',
            footer: ''
        })
        this.select({
            rentpactid: this.state.rentpactid,
        }, 10, 0, this.props.action.fetchContractHistory)
    }
    /**
     * 生成默认明细后，再次操作选项卡影响合同金额时执行该函数
    */
    handleResetStages = () => {
        this.setState({
            isCalcChange: false,
            isStagesShow: false,
            stagesTableData: []      // 情况明细数据
        })
        this.props.form.resetFields(['totalstages'])   // 情况分期期数
    }

    // 明细更改合同金额算法     
    handleStageCalc = (obj) => {
        let stageMoneys = 0
        let totalMoneys = 0
        const {
            stagesShowNum,
            stagesTableData
        } = this.state
        const ind = stagesShowNum - 1

        obj.map(item => {
            stageMoneys += parseFloat(item.money)
        })
        stagesTableData[ind].money = stageMoneys
        stagesTableData.map(item => {
            totalMoneys += parseFloat(item.money)
        })

        this.props.form.setFieldsValue({
            money: totalMoneys
        })
        this.setState({
            stagesTableData: stagesTableData,
            money: totalMoneys
        })
    }
    // 弹框确认
    handleModalOk = () => {
        const {
            selectDatas,
            dataRoom,
            dataLine,
            dataPolicy,
            dataBond,
            stagesNum,
            modalName,
            tableIndex,
            modalOpenBtn,
            isCalcChange
        } = this.state

        const {action, form} = this.props
        const {getFieldValue, setFieldsValue, resetFields} = form
        if (modalName === 'room' && selectDatas.length !== 0) {
            const obj = handleUniq(this.state.dataRoom, selectDatas, 'rentroomid')
            const ids = []
            let tmp = {}

            this.setState({ dataRoom: obj })
            obj.map(item => {
                ids.push(item.room)
            })

            // 设置表单
            tmp['roomlist'] = ids.join(',')
            tmp = Object.assign({}, tmp, handleContractCalc(obj, dataLine, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate')))
            setFieldsValue(tmp)

            // 重置明细
            isCalcChange && this.handleResetStages()
        } else if (modalName === 'classLine' && selectDatas.length !== 0) {
            const obj = handleUniq(this.state.dataLine, selectDatas, 'transportlineid')
            const ids = []
            let tmp = {}

            this.setState({ dataLine: obj })
            obj.map(item => {
                ids.push(item.linename)
            })
            // 设置表单
            tmp['linelist'] = ids.join(',')
            tmp = Object.assign({}, tmp, handleContractCalc(dataRoom, obj, dataPolicy, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate')))
            setFieldsValue(tmp)

            // 重置明细
            isCalcChange && this.handleResetStages()
        } else if (modalName === 'policy' && selectDatas.length !== 0) {
            const obj = handleUniq(this.state.dataPolicy, selectDatas, 'rentpromotionid')
            const moneyList = []
            this.setState({
                dataPolicy: obj
            })
            // 设置表单
            const tmp = handleContractCalc(dataRoom, dataLine, obj, dataBond, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate'))
            setFieldsValue(tmp)

            // 重置明细
            isCalcChange && this.handleResetStages()
        } else if (modalName === 'contractBond' && selectDatas.length !== 0) {
           const obj = handleUniq(this.state.dataBond, selectDatas, 'marginid')
            this.setState({
                dataBond: obj
            })
            // 设置表单
            const tmp = handleContractCalc(dataRoom, dataLine, dataPolicy, obj, getFieldValue('marginmoney'), getFieldValue('startdate'), getFieldValue('enddate'))
            setFieldsValue(tmp)

            // 重置明细
            isCalcChange && this.handleResetStages()
        } else if (modalName === 'selectOrganization') {
            if (this.state.selectDatas.length) {
                this.setState({
                    partyid: this.state.selectDatas[0].partyid,
                    partyname: this.state.selectDatas[0].partyname
                })
                setFieldsValue(this.state.selectDatas[0])
            }
            resetFields(['organizationnum'])
            this.props.action.resetOrganization()
        } else if (modalName === 'stagesModal') {
            const oldObj = this.refs.stagesModal.getFieldsValue()
            const newObj = filterQueryObj(oldObj)
            console.log('保存表单字段', newObj)
            const obj = this.state.stagesTableData
            if (newObj['money'] <= 0) {
                notification.error({
                    message: '【交款类型】应该为正数',
                    description: '请按要求正确填写表单'
                })
                return false;
            }

            obj[this.state.tableIndex] = Object.assign({}, obj[this.state.tableIndex], newObj, {
                stagesnumber: this.state.stagesNum
            })
            console.log('保存前', obj)
            this.setState({
                stagesTableData: obj
            })
            this.refs.stagesModal.resetFields()
        } else if (modalName === 'stagesShowModal') {
            this.refs.stagesShowModal.validateFieldsAndScroll((errors, values) => {
                if (errors) {
                    notification.error({
                        message: '表单填写有误',
                        description: '请按要求正确填写表单'
                    })
                    return false;
                }
                let obj = this.state.stagesShowTableData
                const oldObj = this.refs.stagesShowModal.getFieldsValue()

                if (oldObj['itemname'] === '履约保证金冲抵' || oldObj['itemname'] === '优惠减免' || oldObj['itemname'] === '优惠折扣') {
                    if (oldObj['money'] >= 0) {
                        notification.error({
                            message: '【' + oldObj['itemname'] + '】应该为负数',
                            description: '请按要求正确填写表单'
                        })
                        return false;
                    }
                } else {
                    if (oldObj['money'] <= 0) {
                        notification.error({
                            message: '【' + oldObj['itemname'] + '】应该为正数',
                            description: '请按要求正确填写表单'
                        })
                        return false;
                    }
                }
                const newObj = filterQueryObj(oldObj)
                console.log('保存表单字段', newObj)

                if (modalOpenBtn === 'stagesShowInsert') {
                    const tmp = obj.filter(item => item.itemname === oldObj['itemname'])
                    if (tmp.length) {
                        notification.error({
                            message: '【' + oldObj['itemname'] + '】已经存在',
                            description: '请重新选择交款类型'
                        })
                        return false;
                    }
                    obj.push(Object.assign({}, newObj, {
                        stagesnumber: this.state.stagesNum
                    }))
                } else if (modalOpenBtn === 'stagesShowEdit') {
                    const tmpEdit = this.state.stagesShowTableData[this.state.tableIndex].itemname
                    const tmpInsert = obj.filter(item => item.itemname === newObj['itemname'])

                    if (tmpEdit !== newObj['itemname'] && tmpInsert.length) {
                        notification.error({
                            message: '【' + oldObj['itemname'] + '】已经存在',
                            description: '请重新选择交款类型'
                        })
                        return false;
                    }
                    obj[this.state.tableIndex] = Object.assign({}, newObj, {
                        stagesnumber: this.state.stagesNum
                    })
                }

                // 合同算法：明细改变
                this.handleStageCalc(obj)
                this.setState({
                    stagesShowTableData: obj
                })
                this.refs.stagesShowModal.resetFields()
            })
        }

        this.handleModalCancel()
    }

    // 弹框关闭
    handleModalCancel = () => {
        const {modalName} = this.state
        if (modalName === 'stagesShowModal') {
            this.refs.stagesShowModal.resetFields()
        } else if (modalName === 'stagesModal') {
            this.refs.stagesModal.resetFields()
        }
        this.setState({
            modalVisible: false
        })
    }

    handleGoBack = () => {
        hashHistory.push('busi/busi_lease')
    }
    handleSaveAll = (e) => {
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
                const type = this.props.location.query.type

                const {form} = this.props
                const oldObj = form.getFieldsValue()
                const newObj = filterQueryObj(oldObj)
                newObj['totalstages'] = parseInt(newObj['totalstages'].match(/\d+/)[0])

                const {
                    rentpactid,
                    renttype,
                    pactprintmodelid,
                    partyid,
                    partyname,
                    dataRoom,
                    dataLine,
                    dataPolicy,
                    dataBond,
                    dataAttachment,
                    stagesTableData
                } = this.state

                console.log('保存表单字段', newObj)

                // 传给后端字段
                const rentValue = Object.assign({}, newObj, {
                    rentpactid: rentpactid,
                    renttype: renttype,
                    flowtype: type,
                    pactprintmodelid: pactprintmodelid,
                    partyid: partyid,
                    partyname: partyname
                })
                // renttype|pactprintmodelid|partyid|partyname
                if (stagesTableData.length < 1) {
                    notification.error({
                        message: '分期明细没有生成',
                        description: '请生成分期明细'
                    })
                    this.setState({
                        isSaveDisabeld: false
                    })
                    return false
                }
                const tmp = Object.assign({}, {
                    rentpact: JSON.stringify(rentValue),
                    rentpactattachments: JSON.stringify(dataAttachment),
                    rentpactrooms: JSON.stringify(dataRoom),
                    rentpactlines: JSON.stringify(dataLine),
                    rentpactpromotions: JSON.stringify(dataPolicy),
                    offsetmargins: JSON.stringify(dataBond),
                    rentpactpayplanfullinfos: JSON.stringify(stagesTableData)
                })
                console.log('传给后端数据：', tmp)

                xhr('post', paths.leasePath + '/rentpactfullinfocs/updateRentPactFullInfo', tmp, (res) => {
                    const hide = message.loading('正在查询...', 0)
                    console.log('保存合同新增数据：', res)
                    if (res.result === 'success') {
                        hashHistory.push('busi/busi_lease')
                    } else {
                        errHandler(res.msg)
                    }
                    this.setState({
                        isSaveDisabeld: false
                    })
                    hide()
                })
            }
        })
    }

    componentDidMount() {
        const {action} = this.props
        action.fetchContractFrom()
        action.fetchManager()

        const id = parseInt(this.props.params.id)
        xhr('post', paths.leasePath + '/rentpactfullinfocs/selectRentPactFullInfoById', {
            rentpactid: id
        }, (res) => {
            const hide = message.loading('正在查询...', 0)
            console.log('获取【合同】数据：', res)
            if (res.result === 'success') {
                const oldObj = res.data.rentpact
                const newObj = {}
                for (const key in oldObj) {
                    if (key.indexOf('date') > -1) {
                        newObj[key] = moment(oldObj[key], 'YYYY-MM-DD HH:mm:ss')
                    } else if (key.indexOf('totalstages') > -1) {
                        newObj[key] = oldObj[key] + '期'
                    } else {
                        newObj[key] = oldObj[key]
                    }
                }

                // 合同流程
                action.fetchWorkFlow({
                    type: '变更',
                    modelname: newObj.modelname
                })

                this.props.form.setFieldsValue(newObj)
                this.setState(Object.assign({}, newObj, {
                    rentpactid: res.data.rentpact.rentpactid,
                    renttype: res.data.rentpact.renttype,
                    prepactcode: res.data.rentpact.pactcode,
                    dataRoom: res.data.rentpactrooms,
                    dataLine: res.data.rentpactlines,
                    dataPolicy: res.data.rentpactpromotions,
                    dataBond: res.data.offsetmargins,
                    dataAttachment: res.data.rentpactattachments,
                    stagesTableData: res.data.rentpactpayplanfullinfos,
                    isCalcChange: true
                }))
                hide()
            } else {
                hide()
                errHandler(res.msg)
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const type = this.props.location.query.type

        const {
            busiLease,
            configLease
        } = this.props


        const uploadProps = {
            action: "/tfPassParkAdmin/rentpactattachmentcs/uploadFiles",
            showUploadList: false,
            onChange: this.handleUpload
        }

        const tableColumnsRoom = this.addSchema['room']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelRoom.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsLine = this.addSchema['line']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelLine.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsPolicy = this.addSchema['policy']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelPolicy.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsBond = this.addSchema['contractBond']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (record) => <a href="javascript:;" className="s-blue" onClick={this.handleDelBond.bind(this, record)}>删除</a>
            }
        ])
        const tableColumnsAttachment = this.addSchema['attachment']['columns'].concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleViewDoc.bind(this, text, record, index)}>下载</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleDelDoc.bind(this, text, record, index)}>删除</a>
                </div>
            }
        ])

        const tableStagesColumns = this.stagesSchema.tableColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleEditStages.bind(this, text, record, index)}>修改</a>
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleShowStages.bind(this, record, index)}>明细</a>
                </div>
            }
        ])

        const tableStagesShowColumns = this.stagesSchema.tableShowColumns.concat([
            {
                title: '操作',
                key: 'operation',
                render: (text, record, index) => <div className="button-group">
                    <a href="javascript:;" className="s-blue g-mr10" onClick={this.handleEditStagesShow.bind(this, text, record, index)}>修改</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleDelStagesShow.bind(this, text, record, index)}>删除</a>
                </div>
            }
        ])

        const {tabsStatus, modalName} = this.state
        let modalContent = ''

        if (modalName === 'room') {
            modalContent = <ModalTable
                dataSource={configLease.roomData}
                isRowSelection={true}
                parentHandleSelectChange={this.parentHandleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'classLine') {
            modalContent = <ModalTable
                dataSource={configLease.classLineData}
                isRowSelection={true}
                parentHandleSelectChange={this.parentHandleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'policy') {
            modalContent = <ModalTable
                dataSource={configLease.policyData}
                isRowSelection={true}
                parentHandleSelectChange={this.parentHandleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'contractBond') {
            modalContent = <ModalTable
                dataSource={busiLease.bondData}
                isRowSelection={true}
                parentHandleSelectChange={this.parentHandleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'changeHistory') {
            modalContent = <ModalTable
                dataSource={busiLease.changeHistory}
                isRowSelection={false}
                parentHandleSelectChange={this.parentHandleSelectChange}
                handlePageChange={this.handlePageChange} />
        } else if (modalName === 'selectOrganization') {
            const {
                organization
            } = this.props.busiLease
            modalContent = <div className="m-search-modal">
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
            </div>
        } else if (modalName === 'stagesModal') {
            modalContent = <ModalForm
                ref="stagesModal"
                schema={this.stagesSchema.tableSchema} />
        } else if (modalName === 'stagesShowModal') {
            modalContent = <ModalForm
                ref="stagesShowModal"
                schema={this.stagesSchema.tableShowSchema} />
        }

        const workFlowProps = {
            flow: busiLease.contractWorkFlow
        }

        return (
            <section className="padding m-contract-add g-mt20">
                <Modal
                    visible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    width={this.state.modalWidth}
                    footer={this.state.footer}
                    onCancel={this.handleModalCancel}>
                    {modalContent}
                </Modal>
                <Form horizontal>
                    {/* 获取合同模板 */}
                    <FormLayout
                        schema={busiLease.contractFrom}
                        form={this.props.form}
                        fromLayoutStyle="g-border-bottom"
                        parentHandleSelect={this.parentHandleSelect} />

                    {/* 合同流程 */}
                    <section className="g-border-bottom">
                        <WorkFlow {...workFlowProps} />
                    </section>

                    {/* 客户名称 */}
                    <div className="g-border-bottom">
                        <FormLayout
                            parentHandleInput={this.parentHandleInput}
                            schema={this.addSchema['organization']}
                            form={this.props.form} />
                    </div>

                    {/* 合同号 */}
                    <Tabs className="g-mt20 g-mb20" defaultActiveKey="room" onChange={this.handleTabsContractFrom}>
                        <TabPane tab="合同房间" key="room">
                            <div className="padding-lr g-mb20">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddRoom}><Icon type="plus" />新增房间</Button>
                                </div>
                                <InnerTable
                                    columns={tableColumnsRoom}
                                    dataSource={this.state.dataRoom}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同班线" key="classLine">
                            <div className="padding-lr g-mb20">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddLine}><Icon type="plus" />新增班线</Button>
                                </div>
                                <InnerTable
                                    columns={tableColumnsLine}
                                    dataSource={this.state.dataLine}
                                    schema={this.addSchema['line']['topButtons']}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同优惠冲抵" key="policy">
                            <div className="padding-lr g-mb20">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddPolicy}><Icon type="plus" />新增合同优惠</Button>
                                </div>
                                <InnerTable
                                    columns={tableColumnsPolicy}
                                    dataSource={this.state.dataPolicy}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="履约保证金冲抵" key="contractBond">
                            <div className="padding-lr g-mb20">
                                <div className="button-group g-mb10">
                                    <Button onClick={this.handleAddBond}><Icon type="plus" />新增保证金冲抵</Button>
                                </div>
                                <InnerTable
                                    columns={tableColumnsBond}
                                    dataSource={this.state.dataBond}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    parentHandleSelectChange={this.parentHandleSelectChange}
                                    pagination={false} />
                            </div>
                        </TabPane>
                        <TabPane tab="合同附件" key="contractAttachment">
                            <div className="padding-lr g-mb20">
                                <div className="g-mb10">
                                    <Upload {...uploadProps}>
                                        <Button type="ghost">
                                            <Icon type="upload" />文件上传
                                    </Button>
                                    </Upload>
                                </div>
                                <InnerTable
                                    columns={tableColumnsAttachment}
                                    dataSource={this.state.dataAttachment}
                                    bordered={true}
                                    parentHandleClick={this.parentHandleClick}
                                    pagination={false} />
                            </div>
                        </TabPane>
                    </Tabs>

                    {/* 客户数据录入*/}
                    <FormLayout
                        schema={busiLease.contractTabs}
                        form={this.props.form}
                        parentHandleBlur = {this.parentHandleBlur}
                        parentHandleDateChange={this.parentHandleDateChange}
                        fromLayoutStyle="g-border-bottom" />

                    {/* 分期明细 */}
                    <div className="padding-lr g-mb20">
                        <FormLayout
                            schema={this.addSchema['stages']['form']}
                            form={this.props.form}
                            buttonSchema={this.addSchema['stages']['buttons']}
                            parentHandleClick={this.parentHandleClick}
                            parentHandleSelect={this.parentHandleSelect} />
                        {/*
                            <div>
                            <Button onClick={this.handleMakeDefault}>生成默认明细</Button>
                        </div>
                        */}
                        {
                            this.state.isStagesShow ?
                                <div className="m-stages-show">
                                    <h2>{`第${this.state.stagesShowNum}期明细`}</h2>
                                    <div className="button-group g-mb10">
                                        <Button onClick={this.handleStagesInsert}><Icon type="plus" />新增明细</Button>
                                        <Button onClick={this.handleStagesClose}><Icon type="close" />关闭明细</Button>
                                    </div>
                                    <InnerTable
                                        columns={tableStagesShowColumns}
                                        dataSource={this.state.stagesShowTableData}
                                        bordered={true}
                                        size="middle"
                                        tableStyle="m-table"
                                        pagination={false} />
                                </div> :
                                ''
                        }

                        <InnerTable
                            columns={tableStagesColumns}
                            dataSource={this.state.stagesTableData}
                            bordered={true}
                            pagination={false} />
                    </div>
                    <div className="g-tac button-group">
                        <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSaveAll}>保存</Button>
                        {/*<Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleSubmitChange}>变更提交</Button>*/}
                        {/*<Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handlePrintView}>打印预览</Button>*/}
                        {type === '变更' ? <Button type="primary" disabled={this.state.isSaveDisabeld} onClick={this.handleChangeHistory}>变更历史</Button> : ''}
                        <Button type="default" onClick={this.handleGoBack}>取消</Button>
                    </div>
                </Form>
            </section>
        )
    }
}

ContractInsert = Form.create()(ContractInsert)

export default ContractInsert