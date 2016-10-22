/**
 * 合同新增-合同房间表格
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractTabs'

const initialState = {
    topButtons: {
        left: [],
        center: [],
        right: []
    },
    tableColumns: [
        {
            title: '分期数',
            dataIndex: 'linename',
            key: 'linename'
        },
        {
            title: '交款日期',
            dataIndex: 'linefee',
            key: 'linefee'
        },
        {
            title: '失效日期',
            dataIndex: 'linename',
            key: 'linename'
        },
        {
            title: '交款金额',
            dataIndex: 'linefee',
            key: 'linefee'
        },
        {
            title: '备注',
            dataIndex: 'linename',
            key: 'linename'
        },
        {
            title: '操作',
            key: 'operation',
            render: (record) => {
                <div>
                    <a href="javascript:;" className="s-blue" onClick={this.handlePrint.bind(this, record)}>打印交款单</a>
                    <a href="javascript:;" className="s-blue" onClick={this.handleShow.bind(this, record)}>明细</a>
                </div>
            }
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)