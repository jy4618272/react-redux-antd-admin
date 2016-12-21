import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
    InnerTable
} from 'COMPONENT';
import 'STYLE/modal.less';

class PrintPayment extends Component {
    constructor(props){
        super(props);
        console.log('水电详情props', props);
    }
    render() {
        const tableColumns = [
            {
                dataIndex: 'oldreadingdate',
                key: 'oldreadingdate',
                title: '上次抄表日期'
            },
            {
                dataIndex: 'readingdate',
                key: 'readingdate',
                title: '本次抄表日期'
            },
            {
                dataIndex: 'metertype',
                key: 'metertype',
                title: '类别'
            },
            {
                dataIndex: 'metercode',
                key: 'metercode',
                title: '设备号'
            },
            {
                dataIndex: 'room',
                key: 'room',
                title: '房间号'
            },
            {
                dataIndex: 'prereadout',
                key: 'prereadout',
                title: '上期示数'
            },
            {
                dataIndex: 'currentreadout',
                key: 'currentreadout',
                title: '本期示数'
            },
            {
                dataIndex: 'currentamount',
                key: 'currentamount',
                title: '用量'
            },
            {
                dataIndex: 'currentmoney',
                key: 'currentmoney',
                title: '余额（元）'
            }
        ];
        const data = this.props;
        const username = sessionStorage.getItem('username');
        const currentDate = moment(new Date()).format('YYYY-MM-DD');
        let modalTable
        if (data.tableData && data.tableData.length) {
            modalTable = data.tableData.map(item => {
                return (
                    <div className="item">
                        <h3 className="clearfix">{item.site}公路港水电费交款单<span className="u-mark">{item.businessnumber}</span></h3>
                        {
                            (item.meterbilllist && item.meterbilllist.length) ?
                                <InnerTable
                                    tableStyle='m-table m-table-primary-light m-table-middle'
                                    loading={false}
                                    columns={tableColumns}
                                    dataSource={item.meterbilllist}
                                    bordered={true}
                                    pagination={false}
                                    title={() => (<div className="table-title"><span className="g-fr">水电费合计：{item.currentmoney}</span>客户名称：{item.organization}</div>)}
                                    footer={() => `备注：${item.memo}`} />
                                :
                                <div className="g-tac g-mt20">暂无数据</div>
                        }
                        <ul className="clearfix list-horizontal-txt m-row-4 g-mt10">
                            <li>&nbsp;</li>
                            <li>&nbsp;</li>
                            <li className="g-tar">开单人：{username}</li>
                            <li className="g-tar">开单日期：{currentDate}</li>
                        </ul>
                    </div>
                )
            })
        } else {
            modalTable = '暂无数据'
        }
        return (
            <div className="m-modal">
                {modalTable}
            </div>
        );
    }
}

export default PrintPayment;