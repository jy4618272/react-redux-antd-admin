/**
 * 合同新增-合同房间表格
 */
import createReducer from 'UTIL/createReducer'
import { ACTION_HANDLERS } from 'ACTION/busiLease/contractTabs'

const initialState = {
    topButtons: {
        left: [
            {
                key: 'selectDoc',
                title: '选择文件'
            }
        ],
        center: [],
        right: []
    },
    tableColumns: [
        {
            title: '文件名称',
            dataIndex: '1',
            key: '1'
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