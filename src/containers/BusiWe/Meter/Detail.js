import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Loading,
    InnerTable,
    InnerPagination
} from 'COMPONENT'
import { pageChange } from 'UTIL/pageChange'

import actionBusi from 'ACTION/busiWe/meter/manualMeterConfirmedDetail'
const mapDispatchToProps = (dispatch) => ({
    actionBusi: bindActionCreators(actionBusi, dispatch)
})
@connect(
    ({ busiWe }) => ({ busiWe }),
    mapDispatchToProps
)
class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            tmpObj: {
                partyid: props.params.id,
                checkdate: props.location.query.checkdate
            }
        }
        console.log('水电业务-水电管理详情：', props)
    }

    // 分页
    handlePageChange = (skipCount) => {
        const { actionBusi, busiWe } = this.props
        pageChange({}, busiWe.manualMeterConfirmedDetail.pageSize, skipCount, actionBusi.fetchMeterDetail);
    }

    componentDidMount() {
        pageChange(this.state.tmpObj, 30, 0, this.props.actionBusi.fetchMeterDetail);        
    }

    render() {
        const { manualMeterConfirmedDetail } = this.props.busiWe
        return (
            <section className="m-busi">
                {/* 表格及分页 */}
                <InnerTable
                    loading={manualMeterConfirmedDetail.tableLoading}
                    columns={manualMeterConfirmedDetail.tableColumns}
                    dataSource={manualMeterConfirmedDetail.tableData}
                    bordered={true}
                    pagination={false} />
                <InnerPagination
                    total={manualMeterConfirmedDetail.total}
                    pageSize={manualMeterConfirmedDetail.pageSize}
                    skipCount={manualMeterConfirmedDetail.skipCount}
                    parentHandlePageChange={this.handlePageChange} />
            </section>
        );
    }
}

Detail.propTypes = {

};

export default Detail;