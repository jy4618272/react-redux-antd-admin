/**
 * 
 *  选择责任人弹窗组件
 * 
 * this.props
 *  selectOwnerDisplay boolean 控制modal的显示和隐藏
 *  selectOwnerOk(selectedOwner)  确定后的回调
 *  selectOwnerCancle()   取消后的回调
 * 
 */
import React, { Component } from 'react'

// antd
import {
    Input,
    Button,
    Row,
    Col,
    Select,
    Modal
} from 'antd'

// 自定义
import xhr from 'SERVICE'
import { errHandler, rootPaths, paths } from 'SERVICE/config'
import { parseArrayToTree } from 'COMPONENT/BusiAsset/component/parseArrayToTree'

import {
    InnerForm,
    InnerPagination,
    InnerTable
} from 'COMPONENT'

class SelectOwner extends Component {
    constructor() {
        super()
        this.state = {
            jobCard: '', // 员工工号
            page: 1,  //页码，从1开始，第二页就是2
            pageSize: 10,
            isLoading: false,
            ownerDataSource: [], // 责任人
            total: 0,
            selectedOwner: {},  // 用来保存被选中的责任人
        }
    }

    componentWillMount() {
        this.searchOwnerByjobCard()
    }

    /**
     * 选择责任人的modal的取消
     *  关闭modal时，清空modal中数据
     */
    handleModalCancel() {
        const { selectOwnerCancle } = this.props

        // todo 关闭时是否需要清空所有数据？
        // this.setState({
        //     page: 1,
        //     jobCard: '',
        //     ownerDataSource: []
        // })

        selectOwnerCancle()
    }

    /**
     * 确定
     *  设置责任人、责任部门
     */
    handleModalOk() {
        const { selectOwnerOk } = this.props
        // 父组件传入的设置input的方法，需要参数是被选中的行 todo
        selectOwnerOk(Object.assign({}, this.state.selectedOwner));
        // 关闭modal
        this.handleModalCancel()
    }

    /** 
     * 处理搜索click
     * 
     * */
    handleOwnerByjobCard() {
        this.state.page = 1
        this.searchOwnerByjobCard()
    }

    /**
     * 责任人表格头
     *  */
    getOwnerColumns() {
        return [
            { key: 1, title: '工号', dataIndex: 'jobcard' },
            { key: 2, title: '姓名', dataIndex: 'realname' },
            { key: 3, title: '责任部门', dataIndex: 'departmentname' },
            { key: 4, title: '类型', dataIndex: 'usertype' }
        ]
    }

    /**
     * 处理翻页事件
     *  page时目标页的页码
     */
    parentHandlePageChange(page) {

        this.state.page = page
        this.searchOwnerByjobCard()
    }

    /**
     * 处理table的行clicked
     *  keys是下标数组，items是被选中行数组
     */
    handleTableRowClick(keys, items) {
        // 被选中的行数据
        const item = items[0]
        // 将被选中行的所表达的数据中需要的信息设置到this.state的selectedOwner
        this.setState({
            selectedOwner: {
                owner: item.username,
                assetdeplist: item.departmentname
            }
        })
    }

    /**
     * 根据工号查询员工信息
     * 
     */
    searchOwnerByjobCard() {
        const { jobCard, pageSize, page } = this.state
        this.setState({
            isLoading: true
        })
        xhr('post', paths.leasePath + '/assetcs/selectDepartmentByJobCard', {
            jobcard: jobCard,
            pagesize: pageSize,
            page
        }, (res) => {
            if (res.result == 'success') {
                this.setState({
                    ownerDataSource: res.data,
                    total: res.count,
                    isLoading: false
                })
            } else {
                errHandler(res.msg)
                this.setState({
                    isLoading: false
                })
            }
        })
    }

    /**
     * 渲染
     * 
     */
    render() {
        const { selectOwnerDisplay } = this.props
        return (
            <div>
                <Modal
                    width="60%"
                    onCancel={this.handleModalCancel.bind(this)}
                    onOk={this.handleModalOk.bind(this)}
                    visible={selectOwnerDisplay}
                    title="选择责任人">
                    <Row>
                        <Col span={12}>
                            <Input
                                value={this.state.jobCard}
                                onChange={(e) => { this.setState({ jobCard: e.target.value }) } } />
                        </Col>
                        <Col span={5} offset={1}>
                            <Button type="primary" onClick={this.handleOwnerByjobCard.bind(this)}>搜索</Button>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        {/** 表格 */}
                        <InnerTable
                            loading={this.state.isLoading}
                            columns={this.getOwnerColumns()}
                            dataSource={this.state.ownerDataSource}
                            ref="owner"
                            rowClassName="owner"
                            parentHandleRowClick={this.handleTableRowClick.bind(this)}
                            isRowSelection={false}
                            bordered={true}
                            size="middle"
                            pagination={false} />
                        {/** 翻页 */}
                        <InnerPagination
                            total={this.state.total}
                            pageSize={this.state.pageSize}
                            skipCount={this.state.page}
                            parentHandlePageChange={this.parentHandlePageChange.bind(this)} />
                    </Row>
                </Modal>
            </div>
        )
    }
}


export default SelectOwner