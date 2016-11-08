import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
    Tabs,
    Row,
    Col,
    Popover,
    Button
} from 'antd'
const TabPane = Tabs.TabPane

import {
    InnerPagination,
    Err
} from 'COMPONENT'

// 房态图图片
import roomRed from './img/house-red.png'
import roomBlue from './img/house-blue.png'
import roomOrange from './img/house-orange.png'
import actionBusiLease from 'ACTION/busiLease'

import './index.less'

const mapDispatchToProps = (dispatch) => ({
    actionBusiLease: bindActionCreators(actionBusiLease, dispatch)
})
@connect(
    ({ busiLease }) => ({ busiLease }),
    mapDispatchToProps
)
class RoomState extends Component {
    constructor(props) {
        super(props)
        this.area = "全部"
    }

    /**
     * 向服务端发送select请求, 会返回一个promise对象
     *
     * @param  包含了form中所有的查询条件, 再加上page和pageSize, 后端就能拼成完整的sql
     * @param page
     * @param pageSize
     * @returns {Promise}
     */
    select = (queryObj, pageSize, skipCount) => {
        const {actionBusiLease} = this.props
        const tmpObj = Object.assign({}, queryObj)

        tmpObj.area = this.area == '全部' ? '' : this.area
        tmpObj.pageSize = pageSize
        tmpObj.skipCount = skipCount
        this.queryObj = tmpObj

        actionBusiLease.fetchRoomState(tmpObj)
    }

    /**
    * 按当前的查询条件重新查询一次
    */
    refresh = (queryObj = {}) => {
        const {roomState} = this.props.busiLease
        this.select(queryObj, roomState.pageSize, 0)
    }

    /**
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.area = activeKey
        this.select({}, 24, 0)
    }

    /**
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {roomState} = this.props.busiLease
        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 24
        this.select(this.queryObj, roomState.pageSize, page)
    }


    /**
     * 刚进入页面时触发一次查询
     */
    componentDidMount() {
        this.refresh()
    }

    render() {
        const {roomState} = this.props.busiLease
        const roomStateList = roomState.roomStateData.map(item => {
            let imgStatus
            let tips
            if (item.status === '预定') {
                imgStatus = roomRed
                tips = (
                    <div>
                        <p>房间号：{item.room}</p>
                    </div>
                )
            } else if (item.status === '未出租') {
                imgStatus = roomBlue
                tips = (
                    <div>
                        <p>房间号：{item.room}</p>
                    </div>
                )
                
                return (
                    <Col xs={24} sm={12} md={6} lg={4} className="popover-theme-primary g-mb20">
                        <Popover content={tips} title={item.status}>
                            <div>
                                <Link to='#'>
                                    <div className="list-img"><img src={imgStatus} /></div>
                                    <div className="list-txt">{item.build}- {item.room}</div>
                                </Link>
                            </div>
                        </Popover>
                    </Col>
                )
            } else if (item.status === '已出租') {
                imgStatus = roomOrange
                tips = (
                    <div>
                        <p>客户名称：{item.organization}</p>
                        <p>合同编码：{item.pactCode}</p>
                    </div>
                )
            }
            return (
                <Col xs={24} sm={12} md={6} lg={4} className="popover-theme-primary g-mb20">
                    <Popover content={tips} title={item.status}>
                        <div>
                            <div className="list-img"><img src={imgStatus} /></div>
                            <div className="list-txt">{item.build}- {item.room}</div>
                        </div>
                    </Popover>
                </Col>
            )
        })

        // 选项卡内容展示
        let content
        if (roomState.roomStateData.length === 0) {
            content = <div className="padding list-room-state">
                <Err errorMsg={`${this.area}中还没有房态图`} />
            </div>
        } else {
            content = <div className="padding list-room-state">
                <Row gutter={20}>
                    {roomStateList}
                </Row>
                <InnerPagination
                    total={roomState.total}
                    pageSize={roomState.pageSize}
                    skipCount={roomState.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </div>
        }

        return (
            <section className="m-room-state">
                <ul className="clearfix list-room-state-map">
                    <li><img src={roomRed} />预定</li>
                    <li><img src={roomBlue} />未出租</li>
                    <li><img src={roomOrange} />已出租</li>
                </ul>
                <div className="tabs-vertical">
                    <Tabs defaultActiveKey="全部" onChange={this.handlerTabs}>
                        <TabPane tab="全部" key="全部">
                            {content}
                        </TabPane>
                        <TabPane tab="信息交易中心" key="信息交易中心">
                            {content}
                        </TabPane>
                        <TabPane tab="大仓" key="大仓">
                            {content}
                        </TabPane>
                        <TabPane tab="零担" key="零担">
                            {content}
                        </TabPane>
                        <TabPane tab="汽修汽配汽贸" key="汽修汽配汽贸">
                            {content}
                        </TabPane>
                        <TabPane tab="司机之家" key="司机之家">
                            {content}
                        </TabPane>
                        <TabPane tab="饭店餐饮" key="饭店餐饮">
                            {content}
                        </TabPane>
                        <TabPane tab="第3方物流" key="第3方物流">
                            {content}
                        </TabPane>
                        <TabPane tab="广告位" key="广告位">
                            {content}
                        </TabPane>
                        <TabPane tab="席位" key="席位">
                            {content}
                        </TabPane>
                        <TabPane tab="其它" key="其它">
                            {content}
                        </TabPane>
                    </Tabs>
                </div>
            </section>
        )
    }
}

export default RoomState