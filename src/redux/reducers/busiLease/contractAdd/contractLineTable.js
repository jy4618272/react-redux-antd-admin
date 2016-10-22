/**
 * 合同新增-合同房间表格
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractTabs'

const initialState = {
    topButtons: {
        left: [
            {
                key: 'addLine',
                title: '新增班线'
            }
        ],
        center: [],
        right: []
    },
    tableColumns: [
        {
            title: '班线名称',
            dataIndex: 'linename',
            key: 'linename'
        },
        {
            title: '班线价格',
            dataIndex: 'linefee',
            key: 'linefee'
        },
        {
            title: '操作',
            key: 'operation',
            render: (record) => {
                <a href="javascript:;" className="s-blue" onClick={this.handleDelTr.bind(this, record)}>删除</a>
            }
        }
    ],
    tableData: [],
    skipCount: 1,
    pageSize: 10,
    count: 0
}

export default createReducer(initialState, ACTION_HANDLERS)