import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
    Tabs,
    Row,
    Col
} from 'antd'

const TabPane = Tabs.TabPane

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
     * 点击选项卡切换
     * 
     * @param 
     */
    handlerTabs = (activeKey) => {
        this.area = activeKey

        this.refs.form.resetFields()
        this.refresh()
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
     * 切换分页时触发查询
     *
     * @param page
     */
    handlePageChange = (page) => {
        const {roomState} = this.props.busiLease
        console.debug('handlePageChange, page = %d', page);

        page = (page <= 1) ? 0 : (page - 1) * 10
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
            return (
                <Col xs={24} sm={12} md={6} lg={4}>
                    <div className="list-img"><img src={roomRed} /></div>
                    <div className="list-txt">2323</div>
                </Col>
            )
        })
        
        return (
            <section className="m-room-state">
                <ul className="clearfix list-room-state-map">
                    <li><img src={roomRed} />预定</li>
                    <li><img src={roomBlue} />未出租</li>
                    <li><img src={roomOrange} />已出租</li>
                </ul>
                <div className="tabs-vertical">
                    <Tabs defaultActiveKey="全部">
                        <TabPane tab="全部" key="全部">
                            <div className="padding list-room-state">
                                <Row gutter={20}>
                                    3
                                </Row>
                            </div>
                        </TabPane>
                        <TabPane tab="信息交易中心" key="信息交易中心">
                            <div className="padding list-room-state">
                                信息
                            </div>
                        </TabPane>
                        <TabPane tab="大仓" key="大仓">
                            <div className="padding list-room-state">
                                大仓
                            </div>
                        </TabPane>
                        <TabPane tab="零担" key="零担">
                            <div className="padding list-room-state">
                                零担
                            </div>
                        </TabPane>
                        <TabPane tab="汽修汽配汽贸" key="汽修汽配汽贸">
                            <div className="padding list-room-state">
                                汽修汽配汽贸
                            </div>
                        </TabPane>
                        <TabPane tab="司机之家" key="司机之家">
                            <div className="padding list-room-state">
                                司机之家
                            </div>
                        </TabPane>
                        <TabPane tab="饭店餐饮" key="饭店餐饮">
                            <div className="padding list-room-state">
                                饭店餐饮
                            </div>
                        </TabPane>
                        <TabPane tab="第3方物流" key="第3方物流">
                            <div className="padding list-room-state">
                                第3方物流
                            </div>
                        </TabPane>
                        <TabPane tab="广告位" key="广告位">
                            <div className="padding list-room-state">
                                广告位
                            </div>
                        </TabPane>
                        <TabPane tab="席位" key="席位">
                            <div className="padding list-room-state">
                                席位
                            </div>
                        </TabPane>
                        <TabPane tab="其它" key="其它">
                            <div className="padding list-room-state">
                                其它
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </section>
        )
    }
}

export default RoomState