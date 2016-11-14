import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
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
    Loading,
    InnerPagination,
    Err
} from 'COMPONENT'

// 房态图图片
import roomRed from './img/house-red.png'
import roomBlue from './img/house-blue.png'
import roomOrange from './img/house-orange.png'
import actionBusiLease from 'ACTION/busiLease'
import actionConfigLease from 'ACTION/configLease'

import './index.less'

const mapDispatchToProps = (dispatch) => ({
    actionBusiLease: bindActionCreators(actionBusiLease, dispatch),
    actionConfigLease: bindActionCreators(actionConfigLease, dispatch)
})
@connect(
    ({ busiLease, configLease }) => ({ busiLease, configLease }),
    mapDispatchToProps
)
class RoomState extends Component {
    constructor(props) {
        super(props)
        console.log('房态图props:', props)
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
        this.props.actionConfigLease.fetchArea({
            add: '全部'
        })
        this.refresh()
    }

    render() {
        const { areaData } = this.props.configLease
        const {roomState} = this.props.busiLease

        if (areaData.loading) {
            return <Loading />
        }

        // 内容
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
            } else if (item.status === '已出租') {
                imgStatus = roomOrange
                tips = (
                    <div>
                        <p>客户名称：{item.organization}</p>
                        <p>合同编码：{item.pactCode}</p>
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
                        <Popover content={tips} title={item.status} onClick={() => { hashHistory.push(`busi/busi_lease/contract/add?rentroomid=${item.rentroomid}`) } }>
                            <div>
                                <div className="list-img"><img src={imgStatus} /></div>
                                <div className="list-txt">{item.build}- {item.room}</div>
                            </div>
                        </Popover>
                    </Col>
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
            <section className="sm-room-state">
                <ul className="clearfix list-room-state-map">
                    <li><img src={roomRed} />预定</li>
                    <li><img src={roomBlue} />未出租</li>
                    <li><img src={roomOrange} />已出租</li>
                </ul>
                <div className="tabs-vertical">
                    <Tabs defaultActiveKey={areaData.data[0].key} onChange={this.handlerTabs}>
                        {
                            areaData.data.map(pane =>
                                <TabPane tab={pane.value} key={pane.key}>
                                    {content}
                                </TabPane>
                            )
                        }
                    </Tabs>
                </div>
            </section>
        )
    }
}

export default RoomState

